---
title: "Dabbling with Zephyr Driver Development: STM32 direct LCD Driver"
description: "
I want to use an LCD glass on an STM32WB55RG, which has an LCD direct driver in hardware.
You directly connect all LCD segment and common pins to the SoC.
Because I want to use Zephyr but Zephyr doesn't have an LCD driver already, I implemented one myself.
"
banner: "./banner.jpg"
hero: "./hero.jpg"
hero_horizontal_position: 0
hero_vertical_position: 100
slug: zephyr_lcd_driver
date: "2026-05-31"
tags: [zephyr, stm32, hardware, c]
listed: true
---
I want to use an LCD glass on an STM32WB55RG, which has an LCD direct driver in hardware.
You directly connect all LCD segment and common pins to the SoC.
Because I want to use Zephyr but Zephyr doesn't have an LCD driver already, I implemented one myself.
It only supports my very own use-case, which is why I didn't attempt upstreaming it.
Nevertheless, I'd like to talk about a few of the hurdles I had to overcome.
However, I won't explain all details.
Take a look at [my repository](https://codeberg.org/christopher-besch/watch_firmware) for the entire code.
Do be aware that this article is for readers already accustomed to developing applications with Zephyr.

<HalfImage id="fig:dev_setup" caption="My development setup around the Casio LCD." src="./banner.jpg" full="false" />

Okay, I do something Zephyr can't do, so I have to go a step lower than the Zephyr API and use the STM32 HAL.
You're expected to do the things explained in the [reference manual](https://www.st.com/resource/en/reference_manual/rm0434-multiprotocol-wireless-32bit-mcu-armbased-cortexm4-with-fpu-bluetooth-lowenergy-and-802154-radio-solution-stmicroelectronics.pdf) and use the STM32 HAL; even though you could do everything without it, too.<br />
Zephyr already uses the STM32 HAL internally, so it's part of the SDK.
Because I don't implement an upstream driver, I have to select `USE_STM32_HAL_LCD` in a custom Kconfig to link to the STM32 HAL.

[stm32wbxx_hal_lcd.c](https://github.com/zephyrproject-rtos/hal_stm32/blob/main/stm32cube/stm32wbxx/drivers/src/stm32wbxx_hal_lcd.c) is the most helpful and comes with a step-by-step instruction on how to use the LCD.
The tricky one is implementing the `HAL_LCD_MspInit` function.
It should do two things:
1. Enable LCDCLK and
2. configure the LCD GPIOs.

How do you do that on Zephyr?

### LCDCLK
While Zephyr doesn't have a driver for the LCD, it does have drivers for clocks, just not for the LCDCLK.
Luckily the LCDCLK is the same as the RTCCLK.
We only need to set bit 9 in the APB1 peripheral clock enable register instead of bit 10, which activates RTCCLK instead.
All I need to do is look at Zephyr's [RTC driver](https://github.com/zephyrproject-rtos/zephyr/blob/main/drivers/rtc/rtc_stm32.c), copy the relevant bits and add the `clocks` attribute to my custom LCD device tree node with.
```
clocks = 
    /* Activate the lcd clock (routed from rtc clock). */
    <&rcc STM32_CLOCK(APB1, 9)>,
    /* Use the lse source for the rtc clock. */
    <&rcc STM32_SRC_LSE RTC_SEL(1)>;
```

### LCD GPIOs
The clock ticks, now we need to configure the GPIOs.
There's Zephyr [pinctrl](https://docs.zephyrproject.org/latest/hardware/pinctrl/index.html), which does this.
You could also use the STM32 HAL again but that'd be against Zephyr's way of doing things and it'll work against you—especially with power management.
The relevant bit is `AF11`, the alternate function for the LCD.
Use that on all LCD pins.
```
lcd_seg8: lcd_seg8 {
    pinmux = <STM32_PINMUX('B', 8, AF11)>;
    bias-disable;
};
```

<HalfImage id="fig:tht_cap" caption="The VLCD capacitor with prosthetic legs." src="./tht.jpg" full="false" />

There's only one hiccup.
While the reference manual proclaims:
<Quote text="No need for external analog components" author="STM32WB55RG reference manual" />
It says a few pages down:
<Quote text="[...] the VLCD pin must be connected to V_SS with a capacitor" author="also the STM32WB55RG reference manual" />
And most importantly, the VLCD pin must use `AF11`, too.
Otherwise `HAL_LCD_Init`, which calls `HAL_LCD_MspInit` internally, fails without an error message.<br />
I didn't have any THT capacitors of the right capacitance so I added legs to an SMD one.

With the device tree configured, you only need to activate it like this:
```c
static const struct pinctrl_dev_config *lcd_pinctrl =
    PINCTRL_DT_DEV_CONFIG_GET(DT_NODELABEL(lcd));
pinctrl_apply_state(lcd_pinctrl, PINCTRL_STATE_DEFAULT);
```

Lastly, I added the custom `seg_ids` and `com_ids` attributes to my custom device tree compatible.
They are arrays resolving every segment of my LCD to the used GPIO.
The really cool thing about this is that I've decoupled the implementation from the pinout definition.
All I have to do to switch to a different board is swap the device tree overlay.
I can leave the entire C code the same.

### Configuration and Usage
I simply used the STM32 HAL library to configure the LCD.
Do be aware that a proper configuration is required for low-power operations.
You can easily have two orders of magnitudes higher power consumption because of a bad config.

Lastly, the STM32 HAL's `HAL_LCD_Write` takes care of setting and clearing individual LCD segments.
Because I'm using the LCD of a Casio A159W watch, I simply copied the text printing library from the [Sensor Watch](https://www.sensorwatch.net).

<HalfVideo id="vid:demo_lcd" caption="A demo application printing text onto the Casio LCD." src="lcd.mp4" width={1080} height={1920} />

### Conclusion
Software development so close to the hardware is really hard.
It took days to get the `HAL_LCD_Init` call to not fail.
Reading the fucking manual (RTFM) is your only saviour.
Even if you use an abstraction layer like Zephyr or some library, you **need** the reference manual.
You **need** to understand what's going on.
It has thousands of pages but there really is no way around knowing your way around that document.<br />
Especially not LLMs!
Perhaps my biggest mistake in all this was my over-reliance on LLMs to *help*.
There were so many situations in which I and the LLM were stuck and nothing worked.
The LLM kept trying random junk without any hope of working.
After all, LLMs only pattern match.
And what I'm doing is something not in their training set to pattern match against.<br />
I only mangage to proceed once I turned the LLM off and read the relevant parts in the STM32 manual, Zephyr documentation and Zephyr source-code top to bottom, multiple times.
Then I used my human brain to combine all that data with my experience and figured out what to do.
There's just no substitute for understanding and experience.<br />
In the end I'm certain I would have been faster entirely without LLMs.
But I did give them a try, didn't I?
