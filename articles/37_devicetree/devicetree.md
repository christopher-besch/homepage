---
title: "How to Sensor with Embedded Linux' Devicetree (on Raspberry Pi)"
description: "
TODO
"
banner: "./banner.webp"
hero: "./hero.webp"
hero_horizontal_position: 0
hero_vertical_position: 100
slug: devicetree
date: "2026-10-20"
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
2. an MCP3008 Analogue-to-Digital Converter (ADC) connected via SPI0 and chip-select GPIO18 and
3. an AISIH accelerometer connected via SPI1 and chip-select GPIO16.

<HalfImage src="./overview.webp" full={true} />

How do you drive these sensors?
For one, the drivers need to know what SPI interface with what chip-select pin interfaces the hardware.
There's no enumeration procedure that could do this.

### Devicetree
And this brings us to the Devicetree.
If your Linux uses Devicetree you can run `dtc -I fs /sys/firmware/devicetree/base` to print out the currently loaded device tree (on x86 this is quite rare but on ARM, like on a Raspberry Pi, Devicetree is quite ubiquitous).
TODO: use full, real example
```
// --snip--
spi@54000 {
    status = "okay";
    #address-cells = <1>;
    #size-cells = <0>;
    // --snip--

    mcp3008@0 {
        compatible = "microchip,mcp3008";
        reg = <0>;
        spi-max-frequency = <1600000>;
    };
};
// --snip--
```
In this example there are two nodes describing hardware: an `spi@54000` node with a single child, an `mcp3008@0` sensor.
Notice how the `spi@54000` node specifies what chip-select pins are under this interface's control, only GPIO18.
This allows the child, `mcp3008@0` to set the `reg` attribute to `<0>`, selecting the first and only chip-select pin.
If you had other or more chip-select pins, you would need to change the Devicetree accordingly.<br />
Let's slowly get to how to adjust the Devictree:
The extract above is part of a Devicetree source (`.dts`) file.
I won't go into the details of the Devicetree specification and invite you to read the well-written [documentation](https://www.devicetree.org), instead.
But as you might have guessed, `dtc`, the Devicetree Compiler, converts the loaded devicetree from the virtual filesystem into the Devicetree source representation.
Besides the source and filesystem representation there also is the Devicetree blob representation(`.dtb` or `.dtbo` files).
Typically, these are the type of file the firmware loads at boot as a basis to create the final Devicetree.
Because in the Raspberry Pi's case (like in a lot of other embedded devices) it's the bootloader's job to provide Linux with a Devicetree.
The Raspberry Pi relies quite heavily on the Devicetree, actually.<br />
A very important concept for this article are Devictree overlays:
In our case we want to add more hardware to the Devicetree; hardware that the Raspberry Pi bootloader isn't aware of.
The way one does this is by instructing the bootloader to load a Devicetree overlay, in the form of a `.dtbo` file.

- overlay: including both formats
- raspberry pi config for devicetree, including how to load custom overlays
- config for adc
- custom overlay for adc
- custom overlay for stm acc
- building the kernel for stm modules
- helpful commands to debug:
  - `vclog --msg`
  - `dmesg`
  - compile dts to dtbo
  - decompile currently loaded log, combined with `dtdiff`
  - (raspberry pi) linux sources

## DS18B20: Enable One-Wire
- `dtoverlay=w1-gpio` in `config.txt`
- `cat /sys/bus/w1/devices/28-0000112202bc/temperature` (28-... differs)
- `/sys/bus/w1/devices/28-0000112202bc/temperature`

```yaml
# METABEGIN
# X-Env-Layer-Name: ds18b20
# X-Env-Layer-Version: 1.0.0
# X-Env-Layer-Category: example
# X-Env-Layer-Desc: Enable temperature sensor.
# X-Env-Layer-Requires: debian-trixie-arm64-multi,
#  rpi-debian-trixie,
#  rpi-misc-utils,
#  rpi-essential-base,
#  rpi-misc-skel
# METAEND
# TODO: the requirements are not necessarily absolutely required.

---
mmdebstrap:
  customize-hooks:
    - |
      cat <<'EOF' >> "$1/boot/firmware/config.txt"
      [all]
      dtoverlay=w1-gpio
      EOF
```

## MCP3008: Configure SPI
- raspberry pi mcp3008
- enable SPI on Raspberry Pi with raspi-config `dtparam=spi=on` in `config.txt` this isn't actually needed
- `import gpiozero` this isn't actually needed
- `gpiozero.MCP3008(5, select_pin=18).value` this isn't actually needed
- `dtoverlay=mcp3008` in `config.txt`
- `/boot/firmware/overlays/mcp3008.dtbo`
- `sudo vclog --msg` for firmware log
- `sudo dtc -@ -I dts -O dtb -o /boot/firmware/overlays/mcp3008.dtbo mcp3008.dts`
- `cat /sys/bus/iio/devices/iio\:device0/in_voltage{0..7}_raw`
- `cat /sys/bus/iio/devices/iio\:device0/of_node/name` must be `hk_adc`
- better: `cat /sys/bus/spi/devices/spi0.2/iio\:*/in_voltage{0..7}_raw`
- this also loads the module autmatically: `lsmod | grep mcp320x`
- Apparently, the Raspberry Pi people created a lot of overlays for all sorts of hardware. I don't quite like that closed source firmware loading code does all this but it does appear to have good support. `arch/arm/boot/dts/overlays/mcp3008-overlay.dts` The relevant documentation is in `scripts/dtc/include-prefixes/arm64/overlays/README`
- `/sys/bus/iio/devices/iio:device0/in_voltage0_raw`
- `/sys/bus/iio/devices/iio:device0/in_voltage_scale`

```yaml
# METABEGIN
# X-Env-Layer-Name: mcp3008
# X-Env-Layer-Version: 1.0.0
# X-Env-Layer-Category: example
# X-Env-Layer-Desc: Enable house keeping ADC.
# X-Env-Layer-Requires: debian-trixie-arm64-multi,
#  rpi-debian-trixie,
#  rpi-misc-utils,
#  rpi-essential-base,
#  rpi-misc-skel
# METAEND
# TODO: the requirements are not necessarily absolutely required.

---
mmdebstrap:
  customize-hooks:
    - |
      dtc -@ -I dts -O dtb -o "$1/boot/firmware/overlays/mcp3008_with_vref.dtbo" <<'EOF'
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
              // I thought we had to use spi4 but spi4 only supports the periphery mode of spi, not controller.
              // Confusingly, the spi0 pins are labeled SPI0_SIO[0] and SPI0_SIO[1].
              target-path = "spi0";
              __overlay__ {
                  status = "okay";
                  #address-cells = <1>;
                  #size-cells = <0>;

                  hk_adc@0 {
                      compatible = "microchip,mcp3008";
                      reg = <0>;
                      vref-supply = <&vdd_3v3_reg>;
                      spi-max-frequency = <1000000>;
                  };
              };
          };
      };
      EOF

    - |
      cat <<'EOF' >> "$1/boot/firmware/config.txt"
      [all]
      dtoverlay=spi0-1cs,cs0_pin=18
      # We could also not use the custom overlay and instead use the Raspberry Pi's mcp3008 overlay.
      # However, that overlay doesn't expose the vref-supply attribute.
      dtoverlay=mcp3008_with_vref
      EOF
```

## AIS2IH: The Annoying One
- has linux drivers that must be installed in custom kernel
- https://github.com/STMicroelectronics/st-mems-android-linux-drivers-iio
- SPI1 and cs GPIO16
- `sudo dtc -@ -I dts -O dtb -o /boot/firmware/overlays/ais2ih.dtbo ais2ih.dts`
- `dtoverlay=ais2ih` in `config.txt`
- `drivers/iio/stm/accel/st_lis2dw12/st_lis2dw12_spi.c`
- `CONFIG_IIO_ST_LIS2DW12_SPI=m`
- described in `scripts/dtc/include-prefixes/arm64/overlays/README` in the raspberry pi linux kernel sources
- module to load: `st_lis2dw12_spi`
- raspberry pi convention: `__dormant__` is an inactive version of `__overlay__`, which actually does something  
  https://www.raspberrypi.com/documentation/computers/configuration.html#part2.2.8
- `cat /sys/bus/iio/devices/iio\:device1/in_accel_{x,y,z}_*`
- `/sys/bus/iio/devices/iio:device1/in_accel_x_raw`

```yaml
# METABEGIN
# X-Env-Layer-Name: ais2ih
# X-Env-Layer-Version: 1.0.0
# X-Env-Layer-Category: example
# X-Env-Layer-Desc: Enable accelerometer.
# X-Env-Layer-Requires: debian-trixie-arm64-multi,
#  rpi-debian-trixie,
#  rpi-misc-utils,
#  rpi-essential-base,
#  rpi-misc-skel
# METAEND
# TODO: the requirements are not necessarily absolutely required.

---
mmdebstrap:
  customize-hooks:
    - |
      dtc -@ -I dts -O dtb -o "$1/boot/firmware/overlays/ais2ih.dtbo" <<'EOF'
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

                  hk_acc@0 {
                      compatible = "st,ais2ih";
                      reg = <0>;
                      spi-max-frequency = <1000000>;
                  };
              };
          };
      };
      EOF

    - |
      cat <<'EOF' >> "$1/boot/firmware/config.txt"
      [all]
      dtoverlay=spi1-1cs,cs0_pin=16
      dtoverlay=ais2ih
      EOF
```

### Building the Image
building the kernel on an x86 build machine (see https://chris-besch.com/articles/embedded_systemd):
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
   - mark as module *Device Drivers/Industrial I/O support/STM MEMS Device drivers*
   - mark as module *Device Drivers/Industrial I/O support/STM MEMS Device drivers/Accelerometer/STMicroelectronics LIS2DW12/IIS2DLPC/AIS2IH Accelerometer Driver*
