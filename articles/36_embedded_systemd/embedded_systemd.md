---
title: "A Minimal Linux and systemd for Embedded"
description: "
"
banner: "./banner.webp"
hero: "./hero.webp"
hero_horizontal_position: 0
hero_vertical_position: 100
slug: embedded_systemd
date: "2026-10-02"
tags: [raspberry_pi, hardware, linux, real_time]
listed: true
---

*My name is Chris and I'm afraid of daemons.*
Well, not literally but I am engineering the firmware for an embedded, real-time device.
And I chose to use Debian Linux with systemd on this device.
What I'm afraid of are background processes, *daemons*, performing actions I don't anticipate.
I'm afraid of activities, that I can't reason about but am responsible for.<br />
Now take a look at a desktop operating system:
On my Debian Linux desktop I count 179 running processes (`ps --ppid 2 -p 2 --deselect | wc -l`).
Imagine having that zoo running on the embedded, real-time device.
Do I understand what all the processes do?
Do I trust them not to interfere with the devices critical tasks?
For a general purpose desktop computer, this is okay but for my embedded device?
For my embedded device I want a minimal environment, all parts of which have a good reason for being there.
All parts of which I can reason about.

### The Hardware and its Task
My firmware runs on a Raspberry Pi Computer Module 5 on a custom board.
It's job is to measure some stuff and talk to other computers via its two Ethernet interfaces.
The network needs to be statically configured, there's no DHCP server.
Most importantly, it may not fail at its job and operate in real-time;
it may never send out data at the wrong point in time!

### System Architecture Considerations
I implement task-specific logic in a C++ program: measure things, talk to other things.
For the networking I rely on the Linux kernel, SSH is done by OpenSSH and there are a few other processes that handle NTP and PTP.
I developed all this on a stock Raspberry Pi OS.
However, the stock Raspberry Pi OS runs a few dozen processes, most of which I don't need.
A network manager, for example, or wireless things like wpa_supplicant.
I don't have anything wireless and do the network statically.
All a network manager could do is interfere with that setup.
Raspberry Pi OS is based on Debian and runs sytemds as its init system.
Therefore, these daemons are handled by *systemd units*.
While, I could just disable all the units I don't want, it'd be cleaner if they don't exist in the first place.
And there are other reasons against Raspberry Pi OS:
Firstly, because of the real-time requirements, I want to use PREEMPT_RT, which I've already explained in my [Real-Time Linux on RISC-V article](https://chris-besch.com/articles/riscv_rt).
This requires a custom kernel and I don't want to install a kernel on the device at runtime.
Secondly, Raspberry Pi OS uses cloud-init to perform configuration, e.g., username, password and WiFi setup.
Those are the configurations you requested with the [rpi-imager](https://www.raspberrypi.com/software).
cloud-init applies this configuration at the first boot.
But I want the first boot and all other boots to be the same;
I want a `custom_image.img` file to flash onto the device's EMMC and have the device not change anything about its configuration.
The fewer files change at runtime, the easier to comprehend what's happening.
You could even make most of the filesystem immutable, if you prefer a shotgun over trust.
But, arguably, for my use-case I like being able to SSH into a running test system and toy around.
Lastly, I want all programs I need, including my custom C++ program to be pre-installed and slated to run at boot.
All this asks for a custom image.

### Image Creation with rpi-image-gen
So how do you create such a custom image?
Unfortunately I don't want to use [pi-gen](https://github.com/RPi-Distro/pi-gen), which builds the official Raspberry Pi OS image.
While adjusting it to my needs might already not be trivial the real problem is that pi-gen compiles all the image's software, which takes hours.
Luckily, there is [rpi-image-gen](https://raspberrypi.github.io/rpi-image-gen), a tool to create custom images by installing pre-built deb packages with apt.
This tool has official support and also creates a Debian based image with systemd.
Arguably, I don't particularly like rpi-image-gen, either.
It's YAML based layer system appears unnecessarily over-engineered and so purpose-built for the Raspberry Pi.
I would have liked to use a more cross platform solution that also works well on other hardware than Raspberry Pis.
But rpi-image-gen comes with official support and a plethora of Raspberry Pi specific layers, e.g., for the proprietary `:<` Raspberry Pi firmware.
Additionally, I still dislike the way you define a variable like `${IGconf_linux_kver}`:

```
# X-Env-VarPrefix: linux
#
# X-Env-Var-kver: 6.18.50-v8-16k-custom-kernel-1+
# X-Env-Var-kver-Desc: kernel version
# X-Env-Var-kver-Set: force
```

It took me so much time to comprehend this build system.
But in the end the image this overly complex build process spits out is exactly what I want and simple to reason about.
So I treat rpi-image-gen as a strange black-box as a means to an end.<br />
There are build tools like rpi-image-gen for other platforms, too.
The general idea of creating a custom, minimal Linux image remains a universal one, see [Linux from Scratch](https://www.linuxfromscratch.org):
The build system creates a *chroot* directory as the basis of the final image.
There, for example, is a `/bin` and `/etc` directory inside it.
Those directories will be the `/bin` and `/etc` directories of the final image.
After the build system placed a bunch of basic programs , e.g., cat, ls or apt inside the chroot directory, it enters it using the `chroot` command.
This command lets you run a program with a **ch**anged **root* directory.
So while that program still runs under the build machine's kernel, it appears to the program as if it already where on the actual hardware, with the custom image.
In this environment the build system can, for example, use apt to install further programs.
For this to work the build host and the final device must have same architecture, in my case arm64.
Therefore, I use another Raspberry Pi to build the image.

I won't go into all details how rpi-image-gen exactly constructs this custom image.
But in short, I started with the `trixie-minbase` builtin rpi-image-gen layer, and used it's dependency layers directly.
This let me exclude `systemd-timesyncd`, `wireless-regulatory` and `iwd`, which I don't need.
This leaves a pretty bare-bone image.
Additionally, I added custom layers for all the things I need, as described below.
This includes a layer for my custom C++ program.
Because I run rpi-image-gen on another Raspberry pi, I compile my program directly inside the chroot by running cmake from my custom layer.

### Static Network Setup
As my [Userspace's Role in Linux Networking article](https://chris-besch.com/articles/linux_networking) explains, on desktop Linux you have a network manager configuring your network dynamically.
After all the user might want the desktop to automatically connect to WiFi.
On my embedded device, however, the network configuration is entirely static and doesn't change;
there isn't even a DHCP server.
Therefore, I simply use the iproute2 tools with a bash script to configure the Ethernet links:

```bash
#!/bin/bash
set -euo pipefail

MY_DEVICE=eth0
MY_ADDRESS=192.168.188.3/24

until ip link show dev $MY_DEVICE 2>&1 >/dev/null; do
    sleep 1
done
echo found MY_DEVICE $MY_DEVICE
ip link set dev $MY_DEVICE up
ip addr flush dev $MY_DEVICE
ip addr add $MY_ADDRESS dev $MY_DEVICE
echo configured MY_DEVICE $MY_DEVICE for $MY_ADDRESS
```

I place this script in `$1/usr/local/sbin/static_network_config.sh` and mark it executable.
Notice that I write `$1` instead of the path to the chroot directory;
I'm not installing these files on the build host.
Furthermore, I decided that on my device systemd units shall take care of running all programs.
Therefore, I created the file `$1/etc/systemd/system/static_network_config.service`

```ini
[Unit]
Description=Static Network Config
Wants=network-pre.target
After=network-pre.target
Before=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/sbin/static_network_config.sh

[Install]
WantedBy=multi-user.target
```

Lastly, to make make this run at boot, I enabled the systemd unit with `chroot "$1" sh -c "systemctl enable static_network_config"`
Do notice that I run the `systemctl` command inside the chroot environment.
I also disabled the `systemd-networkd` and `systemd-resolved` units because I don't need DNS or a network manager.<br />
This already works and defines a very simple but robust network configuration.

### Custom Kernel
While I build the image on another Raspberry Pi, I don't have the patience to let it also compile the kernel.
Therefore, I use an x86 Debian Linux build machine and cross compile the kernel as the [Raspberry pi docs](https://www.raspberrypi.com/documentation/computers/linux_kernel.html) explain (I found a few mistakes in the docs, see [#4328](https://github.com/raspberrypi/documentation/pull/4328)).

- `sudo apt update && sudo sudo dpkg --add-architecture arm64 && sudo apt install -y git bc bison flex libssl-dev make libssl-dev:arm64`
- `git clone https://github.com/raspberrypi/linux && cd linux && git checkout stable_20260911`
- `KERNEL=kernel_2712`
- `make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcm2712_defconfig`
- `make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- menuconfig` and enable *General Setup/Preemption Model/Fully Preemptible Kernel*.
- Change `.config` to `CONFIG_LOCALVERSION="-v8-16k-custom-kernel-1"` and, if you like, [configure PREEMPT_RT](https://chris-besch.com/articles/riscv_rt).
- `make -j12 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs` (1.5x nproc)
- `mkdir -p ~/custom_kernel/boot/firmware/overlays/`; ensure `~/custom_kernel` doesn't exist prior to this.
- `sudo env "PATH=$PATH" make -j12 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- INSTALL_MOD_PATH=~/custom_kernel modules_install`
- `sudo cp arch/arm64/boot/Image ~/custom_kernel/boot/firmware/$KERNEL.img`
- `sudo cp arch/arm64/boot/dts/broadcom/*.dtb ~/custom_kernel/boot/firmware`
- `sudo cp arch/arm64/boot/dts/overlays/*.dtb* ~/custom_kernel/boot/firmware/overlays/`
- `sudo cp arch/arm64/boot/dts/overlays/README ~/custom_kernel/boot/firmware/overlays/` This leaves `~/custom_kernel` with all the files you need inside the image. I copy that directory over to the Raspbery pi image build machine and create the raspi-image-gen layer `custom_kernel` to install it into the image:

```yaml
# METABEGIN
# X-Env-Layer-Name: custom_kernel
# X-Env-Layer-Category: kernel
# X-Env-Layer-Desc: Install a custom kernel
# X-Env-Layer-Version: 1.0.0
# X-Env-Layer-Requires: linux-base
# X-Env-Layer-RequiresProvider: hw:device:rpi,hw:soc:bcm2712
#
# X-Env-VarPrefix: linux
#
# X-Env-Var-page_size: 16384
# X-Env-Var-page_size-Desc: 2712 uses a 16K page size kernel
# X-Env-Var-page_size-Valid: int:16384-16384
# X-Env-Var-page_size-Set: force
#
# X-Env-Var-kver: 6.18.50-v8-16k-custom-kernel-1+
# X-Env-Var-kver-Desc: kernel version
# X-Env-Var-kver-Set: force
# METAEND
---

mmdebstrap:
  architectures:
    - arm64
  customize-hooks:
    # install the kernel as described in https://www.raspberrypi.com/documentation/computers/linux_kernel.html
    - mkdir -p "$1/lib/modules"
    - cp -rv ./custom_kernel/lib/modules/${IGconf_linux_kver}/ "$1/lib/modules/${IGconf_linux_kver}/"
    - mkdir -p "$1/boot/firmware/overlays"
    - cp -v ./custom_kernel/boot/firmware/kernel_2712.img "$1/boot/firmware/"
    - cp -v ./custom_kernel/boot/firmware/*.dtb "$1/boot/firmware/"
    - cp -v ./custom_kernel/boot/firmware/overlays/*.dtb* "$1/boot/firmware/overlays/"
    - cp -v ./custom_kernel/boot/firmware/overlays/README "$1/boot/firmware/overlays/"

    # Lock out any linux-image-* pkg to prevent installation via apt.
    - mkdir -p "$1/etc/apt/preferences.d"
    - |
      cat <<-EOF > "$1/etc/apt/preferences.d/99-kernel-lock"
        Package: linux-image-*
        Pin: release *
        Pin-Priority: -1
      EOF
```

To actually use this layer I created a custom version of the `rpi-cm5` layer (what rpi-image-gen calls a *device layer*).
This custom device layer uses my `custom_kernel` layer instead of the builtin `rpi-linux-2712` layer.
Like this rpi-image-gen properly installs the kernel.
Unfortunately, the `image-rpios` builtin layer (what rpi-image-gen calls an *image layer*) changes the `root=` parameter inside `/boot/firmware/cmdline.txt`.
It changes it to `root=/dev/disk/by-slot/system`.
This `root=` parameter is for A/B slots (used for over the air updates (OTA)).
This appears to be buggy as it prevents the device from mounting the root device.
It just eternally waits for the root device to appear, without an error.

Okay, let's go on a little tangent here: *initramfs*
Firstly, know that on a Raspberry Pi OS image and on a typical desktop you have at least two partitions on your hard drive: the root partition (e.g., ext4) and a much smaller boot partition (typically vfat).
The bootloader, loads the kernel from the boot partition and executes it.
The bootloader doesn't mount anything, it just starts the kernel.<br />
Secondly, the Linux kernel binary already includes drivers for quite some hardware.
But there are many drivers which only some systems with certain hardware need.
Putting those drivers in the binary, too, would be quite wasteful.
Therefore, these drivers often take the form of modules.
Those modules are files on the root partition, e.g., in `/lib/modules`.
The kernel loads the modules from such a path.
But the kernel can only do so once it has mounted the root partition.
Oftentimes this isn't an issue but in some cases the kernel actually needs those modules to mount the root partition.
Maybe you have a network mounted root partition or some other special hardware.
Now the kernel needs

1. the modules to mount the root partition and
2. a mounted root partition to load the modules. Chicken and egg.<br />To break out of this conundrum there is the *initramfs*. The initramfs is a special kind of filesystem that doesn't have any backing storage, it lives entirely in RAM. To load the filesystem into RAM there is a single file with its content. So the idea is to mount a very small initial root filesystem, which contains all programs and modules needed to mount the actual root filesystem. Then the program specified by the `initrd=` kernel parameter (typically `/init`) mounts the root filesystem (using pivot_root) To do this the initramfs file is on the boot partition, accessible to the early kernel (`/boot/firmware/initramfs_2712`).<br />In my case, I don't need any of this, my root partition is a simple ext4 with a fixed device path, `root=/dev/mmcblk0p2` does the job. So I don't use an initramfs.

Going back to the buggy `image-rpios`, it configures the kernel cmdline.txt in a way that only works if `/init` inside the initramfs properly creates the `/dev/disk/by-slot/system`.
To my knowledge, the `image-rpios` layer simply doesn't properly configure `/init` to do that leading to the kernel failing to completely boot.<br />
Maybe this issue is fixed it by now.
I'm using rpi-image-gen commit `d1021e82dd578b588cc3b4d45cd7b4b86e57b796`.<br />
Btw, there also is a custom_kernel example in the rpi-image-gen repo, which somehow didn't work for me.
It goes a convoluted way by creating a Docker image, compiling the kernel inside that and packaging it into a `.deb` file.
Put simply, I chose not to do it that way.
I just copied the `image-rpios` layer and threw all the initrafms and `cmdline.txt` editing out.
My kernel mounts the root partition directly.

### Handling Images
Say you have a custom image or [an official one](https://www.raspberrypi.com/software/operating-systems).
How do you look inside or modify it?
Firstly, extract it to have a `.img` file.
With `sudo losetup -fP 2026-06-18-raspios-trixie-arm64-lite.img` you create a loop block device, which you can mount with, e.g., `sudo mount /dev/loop0p1 /mnt`.
There might be more partitions, e.g., `/dev/loop0p2`.
On the Raspberry Pi OS image the first partition is the boot partition, mounted as `/boot/firmware` and the second is the root partition.
To close all such loop devices run `sudo losetup -D`.<br />
Also be aware that if you create an image with a page size of 16KiB you need a kernel that is capable of actually mounting such a filesystem.
A lot of kernels still only allow up to 4KiB page sizes.

### Conclusion
And like this I've given you the basics of creating a custom Linux image.
You can flash it using the rpi-imager tool or dd.
Afterwards the device boots very quickly and results in quite the slim system.
Or as `pstree` would put it:

```
systemd─┬─agetty
        ├─dbus-daemon
        ├─sshd
        ├─systemd-journal
        ├─systemd-logind
        ├─systemd-udevd
        └─custom_cpp_program
```

Leaving only the daemons I'm not afraid of.
