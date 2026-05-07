---
title: "Don't forget about the Option Bytes"
description: "
What's the reason for a watchdog taking 23 times as long to reset the device?
It turns out the Flash Option Bytes are.
And a mass erase doesn't reset those.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 100
hero_vertical_position: 100
slug: soc_option_bytes
date: "2026-05-07"
tags: [hardware_dev, stm32, c, zephyr]
listed: true
---

There are two boards with the same STM32 SoC; one a devkit and the other a consumer device.
I activate the IWDG watchdog on both and the devkit resets after the set timeout.
The consumer device, however, takes consistently 23 times as long until it resets!
How could that be?

There are quite a few differences between the two boards:
1. The surrounding hardware is different.
   The devkit potentially uses different crystals and power components.
2. The device tree I used in [Zephyr](https://www.zephyrproject.org) differs, because the attached hardware is different.
3. Something else???

My first guess was that the watchdog isn't properly configured.
The critical parts are the prescalar and the reload value.
They configure the timeout length, see this figure from the [reference manual](https://www.st.com/resource/en/reference_manual/rm0434-multiprotocol-wireless-32bit-mcu-armbased-cortexm4-with-fpu-bluetooth-lowenergy-and-802154-radio-solution-stmicroelectronics.pdf).
<HalfImage src="./iwdg.png" full="true" />
I use Zephyr's watchdog API and just tell it to set a watchdog timeout of 2 seconds and to use the IWDG.
So maybe it got something wrong?
Let's check!
```c
printk("setting watchdog to: %u %u\n", IWDG->PR, IWDG->RLR);
```
That prints `setting watchdog to: 2 3999`, which indicates a correct timeout: $(\frac{2^(2+2) \cdot (3999+1)}{32kHz})=2s$.

But that only works if the $32kHz$ are correct.
The IWDG is clocked by the LSI (Low Speed Internal clock), which runs at roughly $32kHz$.
Maybe the different boards have differently configured LSIs?
Though, as the LSI is an internal clock it doesn't use any external components and should be exactly the same across both boards.

As a last attempt I played around with different timeout lengths and realized that when I use a timeout below $1.143$ seconds, the watchdog does not show any 23-factor!
Weird!

After a lot of wondering, I realized something critical:
My firmware has a boot period, in which it calculates things, and later goes in an infinite loop.
That loop doesn't feed the watchdog and should lead to a reset of the SoC.
Importantly, it goes to sleep (using STOP2 on my STM32) for a second each.
```c
int main() {
  boot();

  // Don't feed the watchdog for testing:
  while (true) {
    do_work();
    k_sleep(K_MSEC(1000));
  }
}
```

That boot period takes a little longer than one second.
Somehow when the watchdog timeout hits during the boot phase, the timeout length is correct.
And then it clicked:
The timeout is not running in STOP2!
And that's where the 23-factor comes from:
I spend roughly $\frac{1}{22}$ seconds doing work and then sleep for a second.

But why?
And why only on one device and not both?
I didn't tell Zephyr to freeze the watchdog in sleep modes.
Zephyr has the [`WDT_OPT_PAUSE_IN_SLEEP`](https://docs.zephyrproject.org/latest/doxygen/html/group__watchdog__interface.html#gafe8472573a7d77a283974cd3843c3c01) option in the `wdt_setup` function.
I didn't set it so it shouldn't pause in sleep.
Reading the reference manual, there is the low-power freeze feature, enabled by the `IWDG_STOP` and `IWDG_STBY` options.
I expected that Zephyr sets those options according to `WDT_OPT_PAUSE_IN_SLEEP`.

Actually, reading the Zephyr source code, that's wrong.
`WDT_OPT_PAUSE_IN_SLEEP` is unsupported on the IWDG.
`IWDG_STOP` and `IWDG_STBY` is actually part of a Flash Option Bytes!
I thought it was part of a register but that's wrong.
Flash Option Bytes are part of the flash which don't get reset during programming and mass erase.
For whatever reason the consumer hardware had that Option Byte changed and the devkit left it as is.
I reset that Option Byte to factory defaults and the watchdog worked as it should!

So it wasn't that
1. Zephyr configures the watchdog incorrectly,
2. the LSI clock isn't running at the correct speed ($32kHz$) or that
3. Zephyr disables the watchdog in sleep modes.

All that was fine;
it was the `IWDG_STOP` and `IWDG_STBY` Option Byte.<br />
That took half a day to figure out.
I opened a [PR in the Zephyr docs](https://github.com/zephyrproject-rtos/zephyr/pull/108622).

Taking a step back, it keeps surprising me just how hard hardware and firmware are (no pun intended).
I expected that when I mass erase two devices with the same SoC, they do the same thing.
That assumption is wrong.<br />
I'm more of a software-guy and only recently started dabbling with hardware.
In software you can reproduce and try out things so easily.
Developing firmware so close to hardware, you only have the boards you bought and there are so many more variables you need to keep track of.<br />
For another example, when the multimeter is still attached but turned off, your device might reset seemingly randomly and you pull your hair out trying to figure out what your firmware is doing wrong.
Those things don't happen in software and never really happened to me.
Now they do.
