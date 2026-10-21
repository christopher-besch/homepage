---
title: "How to Sensor with Devicetree (on Raspberry Pi)"
description: "
On an Arduino there are libraries to drive sensors.
On a Linux desktop the hardware is automatically configured and abstracted.
But what about embedded Linux?
What about a Raspberry Pi.
This is where the Devicetree comes in:
how Linux learns about the hardware — your way of specifying hardware.
"
banner: "./banner.webp"
hero: "./hero.webp"
hero_horizontal_position: 0
hero_vertical_position: 60
slug: devicetree
date: "2026-10-21"
tags: [raspberry_pi, hardware, linux, dlr]
listed: true
---
In the beginning there was the Arduino.
The way you read out a sensor on an Arduino is by using libraries.
You search for your sensor's Arduino library and use its API.
This library code runs as part of the application's code directly on bare-metal — without an operating system.<br />
On desktop Linux your code runs as a process and doesn't directly interact with the hardware.
Instead, the Linux kernel provides abstractions over the hardware; like a filesystem for storage or ALSA for audio.
Firstly, the motherboard's firmware (i.e., UEFI/BIOS) tells Linux what hardware is needed to boot.
Secondly, Linux automatically enumerates certain devices, e.g., those over USB or PCIe.
Therefore, the user and application developer doesn't need to worry about telling Linux what hardware there is.<br />
But then there's embedded Linux:
We have a Raspberry Pi 5 Compute Module with
1. a DS18B20 temperature sensor connected via One-Wire,
2. an MCP3008 Analogue-to-Digital Converter (ADC) connected via `SPI0` and chip-select `GPIO18` and
3. an AISIH accelerometer connected via `SPI1` and chip-select `GPIO16`.

<HalfImage src="./overview.svg" full={true} />

How do you configure these sensors?
For one, the drivers need to know what SPI interface with what chip-select pin interfaces the hardware.
There's no enumeration procedure that could do this.<br />
This article gives an introduction to Devicetree and answer the above question without going into too much details.

### Devicetree: How the Bootloader tells Linux What it Runs On
And this brings us to the Devicetree.
If your Linux uses Devicetree you can run `dtc -I fs /sys/firmware/devicetree/base` to print out the currently loaded device tree (on x86 this is quite rare but on ARM, like on a Raspberry Pi, Devicetree is quite ubiquitous).
```c
spi@50000 {
    pinctrl-names = "default";
    #address-cells = <0x01>;
    num-cs = <0x02>;
    pinctrl-0 = <0x2b 0x2c>;
    clock-names = "ssi_clk";
    interrupts = <0x13 0x04>;
    clocks = <0x02 0x0c>;
    #size-cells = <0x00>;
    dma-names = "tx", "rx";
    compatible = "snps,dw-apb-ssi";
    status = "okay";
    reg = <0xc0 0x40050000 0x00 0x130>;
    phandle = <0x6e>;
    dmas = <0x2a 0x0d 0x2a 0x0c>;
    cs-gpios = <0x2d 0x12 0x01>;

    adc@0 {
        vref-supply = <0xa1>;
        spi-max-frequency = <0xf4240>;
        compatible = "microchip,mcp3008";
        reg = <0x00>;
    };
};
```
In this example there are two nodes describing hardware: an `spi@50000` node with a single child, an `accelerometer@0` sensor.
Notice how the `spi@50000` node specifies what chip-select pins are under this interface's control, only GPIO18.
This allows the child, `accelerometer@0` to set the `reg` attribute to `<0>`, selecting the first and only chip-select pin.
If you had other or more chip-select pins, you would need to change the Devicetree accordingly.
Another important detail is the `compatible` attribute.
It's purpose is to let Linux choose what driver to load.
By specifying `microchip,mcp3008` Linux will load the kernel module (unless the driver is already compiled into the kernel itself).
Therefore, the user doesn't need to worry about having the right kernel modules loaded; pretty neat, right?
Let's slowly get to how to adjust the Devicetree:<br />
The extract above is part of a *Devicetree source* (`.dts`) file.
We won't go into the details of the Devicetree specification and invite you to read the well-written [specification](https://www.devicetree.org), instead.
But as you might have guessed, `dtc`, the Devicetree Compiler, converts the loaded Devicetree from the virtual filesystem into the Devicetree source representation.
Besides the *source* and *filesystem* representation there also is the *Devicetree blob* representation(`.dtb` or `.dtbo` files).
Typically, this is the type of file the firmware loads at boot as a basis to create the final Devicetree (`/boot/firmware/bcm2712-rpi-cm5-cm5io.dtb` in our case).
This is because in the Raspberry Pi's case (like in a lot of other embedded devices) it's the bootloader's job to provide Linux with a Devicetree (see the [Raspberry Pi docs](https://www.raspberrypi.com/documentation/computers/configuration.html)).<br />
A very important concept for this article are Devicetree overlays:
Overlays define further hardware, like a sensor, that isn't part of the base `.dtb` Devicetree.
Creating a base `.dtb` file for each and every possible hardware combination would be ridiculous.
Therefore, there are `.dtbo` files, Devicetree overlays.
These describe how the base Devicetree should be extended to support whatever hardware the overlay is for.
We'll get into the details of how overlays look like later.
For now it suffices that the Raspberry Pi already comes with a lot of overlays in `/boot/firmware/overlays`.
These overlays are also in the form of *Devicetree blobs*.
You can find the *source* in the Raspberry Pi's [kernel git repo](https://github.com/raspberrypi/linux/tree/rpi-6.12.y/arch/arm/boot/dts/overlays).
We were quite surprised at the plethora of hardware the Raspberry Pi people created overlays for.

## DS18B20: Enable One-Wire
So let's tackle the first of our three sensors: the DS18B20 One-Wire temperature sensor.
The Raspberry Pi comes with an overlay for the One-Wire interface, [this](https://github.com/raspberrypi/linux/blob/rpi-6.12.y/arch/arm/boot/dts/overlays/w1-gpio-overlay.dts) is it's *source*.
Because One-Wire comes with an enumeration protocol, we don't need to specify what sensor we use — it suffices to enable the One-Wire interface by loading the `w1-gpio` overlay.
You do that by editing the `/boot/firmware/config.txt` file and add this line under the `[all]` section:
```ini
dtoverlay=w1-gpio
```

This instructs the bootloader to integrate overlay from the `/boot/firmware/overlays/w1-gpio.dtbo` file into the Devicetree to hand over to Linux.
Therefore, you always need to reboot after adjusting the `config.txt`, it's the config for the bootloader.
You can check by reading the bootloader log with `sudo vclog --msg`.
If you've saved the original Devicetree, you can also use `dtdiff` to compare them.<br />
Lastly, the virtual filesystem exposes the temperature reading through `/sys/bus/w1/devices/28-0000112202bc/temperature` (the id `0000112202bc` varies with the hardware).<br />
Btw, this change to the `config.txt` is exactly what `rpi-config` does when you enable One-Wire with it.

## MCP3008: Configure SPI
Once we know the temperature we want to approach the ADC, connected through `SPI0` and chip-select `GPIO18`.
Firstly, we enable the `SPI0` interface with one chip-select pin by loading the `spi0-1cs` overlay.
By specifying the dtparam `cs0_pin`, a Devicetree parameter, we define what chip-select pin we want to use.
We simply add the following line to the `config.txt`:
```ini
dtoverlay=spi0-1cs,cs0_pin=18
```

But SPI doesn't support any enumeration.
Therefore, we need to manually describe the hardware in the Devicetree.
The Raspberry Pi already comes with an [overlay for the MCP3008](https://github.com/raspberrypi/linux/blob/rpi-6.12.y/arch/arm/boot/dts/overlays/mcp3008-overlay.dts).
Initially, we used that by adding this line to the `config.txt`:
```ini
dtoverlay=mcp3008,spi0-0-present=on
```
Unfortunately, the Raspberry Pi's overlay for the MCP3008 doesn't expose the `vref-supply` attribute.
Therefore, we need to create a custom Devicetree overlay:
```c
/dts-v1/;
/plugin/;

/ {
  compatible = "brcm,bcm2712";

  fragment@0 {
    target-path = "spi0/spidev@0";
    __overlay__ {
      status = "disabled";
    };
  };

  fragment@1 {
    target-path = "spi0";
    __overlay__ {
      status = "okay";
      #address-cells = <1>;
      #size-cells = <0>;

      adc@0 {
        compatible = "microchip,mcp3008";
        reg = <0>;
        vref-supply = <&vdd_3v3_reg>;
        spi-max-frequency = <1000000>;
      };
    };
  };
};
```
This overlay, which applies to the `brcm,bcm2712` (the Raspberry Pi 5's main processor) compatible, does two things:
1. `fragment@0` disables the existing, generic `spidev@0`.
2. `fragment@1` addresses the `spi0` node and gives it a new child node, `adc@0`.
    This child has the `microchip,mcp3208` compatible attribute, uses the first chip-select pin belonging to the `spi0` node and properly defines the `vref-supply` attribute.
    Btw, `spi0` is an alias to `spi@50000` (see chapter 3.3 in the Devicetree specification for more details on aliases).

Be aware that there is another shorthand syntax for overlays, which we don't use.
This other syntax is explained quite well in the [Android docs](https://source.android.com/docs/core/architecture/dto/syntax).<br />
We store this the overlay's *source* in `~/mcp3008_with_vref.dts` and compile it into the right format and place with `sudo dtc -@ -I dts -O dtb -o /boot/firmware/overlays/mcp3008_with_vref.dtbo mcp3008_with_vref.dts`.
Afterwards we change the `config.txt` to:
```ini
dtoverlay=spi0-1cs,cs0_pin=18
dtoverlay=mcp3008_with_vref
```
This loads the overlay, which we can verify with `sudo vclog --msg`:
```
005454.508: Loaded overlay 'spi0-1cs'
005456.720: dtparam: cs0_pin=18
005499.339: Loaded overlay 'mcp3008_with_vref'
```
If there were any problems, the kernel log would tell us (check with `dmesg`).
Now the `/sys/bus/iio/devices/iio:device0/in_voltage_scale` file reads the voltage reference and we can check the voltage readings with `cat /sys/bus/iio/devices/iio\:device0/in_voltage{0..7}_raw`.
There's no need for any userspace libraries (like the Python gpiozero library); the kernel does it all once properly configured like this.
What an amazing piece of software, the Linux kernel.

## AIS2IH: The Annoying One
Let's go on a quick rant about Linux drivers:
- There are the absolutely awful ones: closed-source drivers.
    Sometimes vendors only hand you a compiled Linux module implementing a driver for some hardware.
    This module only works for one specific Linux version.
    Therefore, you can't update to any other Linux version and are stuck.
    Furthermore, you're just supposed to trust this opaque blob and load it into kernelspace!
    How awful!
-   Then there are the amazing ones: upstreamed Open-Source drivers, like the one for the MCP3008.
    Linux is a monolithic kernel; it isn't a microkernel like Windows.
    This means that all the drivers are already part of the kernel.
    Read through the single Linux kernel [git repo](https://github.com/torvalds/linux) and there they are, all the drivers.
    For example, [`drivers/iio/adc/mcp320x.c`](https://github.com/torvalds/linux/blob/master/drivers/iio/adc/mcp320x.c) is the driver for the MCP3008.<br />
    When a driver is upstreamed into this git repo the users are in the best most situation to be in.
    The user only has to adjust the Devicetree (if the interface doesn't support enumeration) as we did above and the kernel takes care of the hardware.
    Therefore, we always look for hardware with drivers upstreamed to the Linux kernel.
- And then there are the somewhat dumb ones: not-upstreamed Open-Source drivers.
    In this case there are Open-Source drivers but the vendor (for whatever stupid reason) chose not to upstream them to the Linux kernel.
    Therefore, you need to patch the kernel sources and build kernel modules for the specific kernel you want to use.
    At least you can read the source code and form trust for it.
    Also you are a lot more free in your choice of kernel version.
    Nevertheless, it's so frustrating that these vendors didn't take the last step of properly upstreaming the drivers.
    This would have done the users (the engineer having purchased the vendor's product) job so much easier.

<HalfImage src="./ais2ihtr.webp" full={false} />

In our case, in the AIS2IH case, the vendor, ST, chose not to upstream their [Open-Source drivers](https://github.com/STMicroelectronics/st-mems-android-linux-drivers-iio).
Their instructions are, I kid you not, to add their repo as a git remote and manually merge their version into your kernel version...
And there are conflicts, because of course there are (only in `README.md`, but still).
These are the steps we had to perform to merge and configure the kernel sources:
1. `sudo apt update && sudo dpkg --add-architecture arm64 && sudo apt install -y git bc bison flex libssl-dev make libssl-dev:arm64`
2. `git clone https://github.com/raspberrypi/linux && cd linux && git checkout 5d39807272da852e10f3fc4467c33b57f59ecc61` oldstable_20260611 somehow doesn't compile
3. `git checkout -b custom_kernel`
4. `git remote add stmems_iio_github https://github.com/STMicroelectronics/st-mems-android-linux-drivers-iio.git`
5. `git fetch stmems_iio_github`
6. `git checkout 0455f406e00484260474473e8fed29bddd15bfa2`
7. `git checkout -b stemems_iio_branch`
8. `git checkout custom_kernel`
9. `git merge --allow-unrelated-histories custom_kernel stemems_iio_branch` Yes, do fix the merge conflict in `README.md` manually
10. `git am stm_iio_patches/6.12.y/*-stm-*.patch`
11. `KERNEL=kernel_2712`
12. `make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcm2712_defconfig`
13. `make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- menuconfig` and
   - mark as module: *Device Drivers/Industrial I/O support/STM MEMS Device drivers*
   - mark as module: *Device Drivers/Industrial I/O support/STM MEMS Device drivers/Accelerometer/STMicroelectronics LIS2DW12/IIS2DLPC/AIS2IH Accelerometer Driver*

Afterwards we could compile the kernel like normal, install it onto the Raspberry Pi and boot, see my [article on that](/articles/embedded_systemd/).
The relevant module that all this effort adds to a more vanilla kernel is `st_lis2dw12_spi`.
Once we've configured the Devicetree, Linux loads it automatically:
```c
/dts-v1/;
/plugin/;

/ {
  compatible = "brcm,bcm2712";

  fragment@0 {
    target-path = "spi1/spidev@0";
    __overlay__ {
      status = "disabled";
    };
  };

  fragment@1 {
    target-path = "spi1";
    __overlay__ {
      status = "okay";
      #address-cells = <1>;
      #size-cells = <0>;

      accelerometer@0 {
        compatible = "st,ais2ih";
        reg = <0>;
        spi-max-frequency = <1000000>;
      };
    };
  };
};
```

Like before we compile this Devicetree overlay with `sudo dtc -@ -I dts -O dtb -o /boot/firmware/overlays/ais2ih.dtbo ais2ih.dts` and configure `config.txt` like so:
```ini
dtoverlay=spi1-1cs,cs0_pin=16
dtoverlay=ais2ih
```

With that done, run `cat /sys/bus/iio/devices/iio\:device1/in_accel_{x,y,z}_*` to read the acceleration.<br />
Isn't it fascinating how this one data structure, the Devicetree, can describe the entire hardware configuration?
The bootloader can do all it needs to do, initialize hardware, enumerate things, load overlays; all to build a single Devicetree to hand Linux and let the kernel do its thing.
The Devicetree is quite the clean interface.
