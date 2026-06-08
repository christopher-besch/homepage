---
title: "Mistakes in the Docs: UART on Raspberry Pi 5 Compute Module"
description: "
We have a Raspberry Pi Compute Module 5 IO Board without a monitor or network connection.
How do you see what the system is doing?
How to read the Linux and bootloader log?
A simple answer is UART.
Turns out, UART isn't so simple on the Raspberry Pi 5 and its documentation, datasheet and raspi-config is wrong in a couple of places.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 0
hero_vertical_position: 100
slug: raspberry_pi_5_uart
date: "2026-06-08"
tags: [raspberry_pi, hardware, linux]
listed: true
---

We have a Raspberry Pi Compute Module 5 IO Board without a monitor or network connection.
How do you see what the system is doing?
How to read the Linux and bootloader log?<br />
A simple answer is UART.
Turns out, UART isn't so simple on the Raspberry Pi 5 and its documentation, datasheet and `raspi-config` is wrong in a couple of places.
Let's dig in!

### [Raspberry Pi 5 Boot Flow](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#eeprom-boot-flow)
The Raspberry Pi doesn't immediately hand Linux control over the device.
Instead there is a two-staged bootloader:
1. The first stage bootloader loads from the SoC's internal ROM (and is thus not updatable).
    That's where the reset vector points.
    It loads the second stage bootloader from the SPI EEPROM.
2. The second stage bootloader loads Linux or any other firmware from wherever you placed it.
    As this stage lives in EEPROM, one may update it (using the first stage bootloader).
    The second stage bootloader is also the thing `rpiboot` interacts with to update the firmware from another PC.

<HalfImage src="./banner.png" full="true" />

### Raspberry Pi 5 UART(s)
The Raspberry Pi 5 doesn't just have one UART interface;
it has six: `UART0`, `UART1`, `UART2`, `UART3`, `UART4` and, confusingly, `UART10` (also called debug UART by the [Raspberry Pi 5 Compute Module 5 datasheet](https://pip-assets.raspberrypi.com/categories/944-raspberry-pi-compute-module-5/documents/RP-008180-DS-6-cm5-datasheet.pdf)).
This is especially confusing, because the documentation and the datasheet, wrongly, state there were only four UARTs.
The datasheet states which UART uses what pins:
- `UART0`: GPIO 14/15
- `UART1`: GPIO 0/1
- `UART2`: GPIO 4/5
- `UART3`: GPIO 8/9
- `UART4`: GPIO 12/13
- `UART10`: debug UART connector (in the top left corner in the image above and shown below in the [reverse engineered PCB layout](https://github.com/schlae/cm5-reveng)) and also testpoints `TP35` and `TP36`

<HalfImage src="./debug_uart.png" full="true" />

`UART10` is an addition to the Raspberry Pi 5;
older models don't have it.
The [documentation](https://www.raspberrypi.com/documentation/computers/configuration.html#primary-and-secondary-uart) specifies what UART is the `primary UART` for each model.
On the Raspberry Pi 5 that is `UART10`.
For all older models the `primary UART` instead is the UART which uses GPIO 14/15.

### Raspberry Pi 5 Bootloader log to UART
Okay, so we want to read the bootloader log.
The [documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#BOOT_UART) states that `BOOT_UART` would enable second level bootloader logging on the UART interface which uses GPIO 14/15.
On the Raspberry Pi `UART0` uses those GPIOs.
But the documentation is wrong;
`BOOT_UART` enables logging on the `primary UART`.
That is `UART10` for the Raspberry Pi 5, which is exposed using the debug UART connector, not GPIO 14/15!
The datasheet even says so, "Debug UART [...] is useful for programming and debugging during boot.".<br />
Because the bootloader cannot write to other UARTs, one must use the debug UART connector to read the booloader log.
Unfortunately, that isn't possible in our case so we had to give up on the bootloader log.

### Raspberry Pi 5 Linux Kernel log to UART
What's most important to us is the Linux kernel log.
`raspi-config` configures that correctly on all older models but makes a mistake on the Raspberry Pi 5.
`raspi-config` does two things when you ask it to enable the Linux kernel log on UART:
1. It enables `UART0`'s device tree node:
   For that, `raspi-config` changes `/boot/firmware/config.txt` in the firmware image.
   It adds the line `[all] dtparam=uart0=on` on the Raspberry Pi 5.<br />
   This initializes the node for use by *anything*, like the Linux kernel.
   Importantly, this doesn't already make *anything* use it.
2. `raspi-config` tells the Linux kernel to log to UART:
   This is done using the Linux command-line.
   If you didn't know Linux itself had command-line parameters, now you do.
   `raspi-config` changes `/boot/firmware/cmdline.txt` and adds `console=serial0,11520 console=tty1` on the Raspberry Pi 5.
   Now, what does that mean?
   `serial0` refers to `/dev/serial0`, which is a symlink.
   On the Raspberry Pi 5 this symlink points to `/dev/ttyAMA10`, which identifies `UART10`.
   Notice that this isn't `UART0`.

That means `raspi-config` enables `UART0` but tells Linux to use `UART10` on the Raspberry Pi 5!
That of course doesn't work.<br />
To fix this we leave the device bootloader config at `[all] dtparam=uart0=on` but change the kernel command-line to `console=ttyAMA0,11520 console=tty1`.
Then `UART0` is enabled and used by the kernel.
We attach our UART-to-USB adapter on GPIO 14/15 and interact with the Linux kernel.
Hooray!<br />
Instead, we could have enabled `UART10` in the device tree and use that.
But, as I've said, we don't have physical access to the debug UART connector.

Lastly, don't forget to reconnect your UART adapter when you close `screen` and want to reconnect.
Otherwise you'll get very buggy output.<br />
This and all the problems we've had with the Raspberry Pi documentation cost us some two days.
We've opened a PR fixing the documentation: [#4310](https://github.com/raspberrypi/documentation/pull/4310).
