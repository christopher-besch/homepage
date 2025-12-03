---
title: "Real-Time Linux on RISC-V"
description: "
Setting up Linux v6.12 on a StarFive VisionFive 2 with PREEMPT_RT.

Also: How to setup your Linux laptop as a simple NAT router.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 20
hero_vertical_position: 40
slug: riscv_rt
date: "2025-06-27"
listed: true
---

I got access to a StarFive VisionFive 2 and wanted to play around with Real-Time Linux on it.
This article goes into excruciating detail on how I set that machine up to with `PREEMPT_RT`.

The first mainline Kernel with PREEMPT_RT is v6.12.
At the time of writing v6.15 is the newest kernel and my Debian laptop runs on v6.1.0.
For the Debian user that I am v6.12 is pretty new.

So, how do we get this single board computer (SBC) to work and run on such a new kernel?
There is no StarFive Debian release with a Linux kernel v6.12 or newer.
So we need to make due with engineering release 202409 and kernel v6.6.20 and get to v6.12 later.
(That's still newer than my Debian laptop...)

# Installing the Initial Image
I just stick to the [official installation guide for Debian on the VisionFive 2](https://rvspace.org/en/project/VisionFive2_Debian_User_Guide).
I chose to boot off of an SD card, pop it in my laptop and run:
```bash
bzip2 -d starfive-jh7110-202409-SD-minimal-desktop-wayland.img.bz2
sudo dd if=starfive-jh7110-202409-SD-minimal-desktop-wayland.img of=/dev/sda conv=fsync bs=4M status=progress
```
Now we can insert the SD card into the SBC and watch it boot for the first time.

# UART
I have a USB to UART adapter attached to my laptop and the SBC.
After having added myself to the dialout group on my laptop I rebooted (a relogin would have done it as well):
```bash
sudo usermod -a -G dialout chris
sudo reboot
```

Now I plug in the adapter to my laptop and check what tty adapter it is on:
```bash
sudo dmesg
```
This should print something including the tty path.
I use this path to attach a terminal to that adapter.
```bash
screen -U /dev/ttyUSB0 -b 115200
```
Exit with `Ctrl+a d`.

There is this magic of LEDs on a UART adapter blinking as you type.

# Setting up Networking

Linux is running on the SBC but I'd like to have network access.
I have my Linux Laptop right here and want to share its network connection with the SBC.

## On the Laptop
First we need to know what network cards we're dealing with:
```bash
~ λ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: wlp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DORMANT group default qlen 1000
    link/ether 10:6f:d9:1e:4f:e1 brd ff:ff:ff:ff:ff:ff
3: enx00133bb15f5b: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 00:13:3b:b1:5f:5b brd ff:ff:ff:ff:ff:ff```
```
As you can see I have three network cards, the loopback device (i.e. for localhost) my wifi card `wlp1s0` and a usb LAN adapter `enx00133bb15f5b`.

### NAT Setup
We need to setup NAT to forward packets meant for the SBC with the laptop.
```bash
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o wlp1s0 -j MASQUERADE
sudo iptables -A FORWARD -i enx00133bb15f5b -o wlp1s0 -j ACCEPT
sudo iptables -A FORWARD -i wlp1s0 -o enx00133bb15f5b -m state --state RELATED,ESTABLISHED -j ACCEPT
```

### IP Addresses
We want to assign a new IP address for the laptop to the `enx00133bb15f5b` link.
```bash
sudo ip addr add 192.168.10.1/24 dev enx00133bb15f5b
sudo ip link set enx00133bb15f5b up
```

I check that this worked with:
```bash
~ λ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: wlp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 10:6f:d9:1e:4f:e1 brd ff:ff:ff:ff:ff:ff
    inet 172.17.65.91/17 brd 172.17.127.255 scope global dynamic noprefixroute wlp1s0
       valid_lft 1694sec preferred_lft 1694sec
    inet6 2a00:1398:9:fb03:c786:4d2:ce2e:e30d/64 scope global dynamic noprefixroute
       valid_lft 2591999sec preferred_lft 604799sec
    inet6 fe80::cebf:38eb:9589:c3a0/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: enx00133bb15f5b: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:13:3b:b1:5f:5b brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.1/24 scope global enx00133bb15f5b
       valid_lft forever preferred_lft forever
```
The `enx00133bb15f5b` link has a new IP address (192.168.10.1) assigned to it.

## On the SBC
```bash
user@starfive:~$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 6c:cf:39:00:49:50 brd ff:ff:ff:ff:ff:ff
    altname end0
3: eth1: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc mq state DOWN mode DEFAULT group default qlen 1000
    link/ether 6c:cf:39:00:49:51 brd ff:ff:ff:ff:ff:ff
    altname end1
4: sit0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/sit 0.0.0.0 brd 0.0.0.0
```

I have attached the LAN cable to the `eth0` network card.

```bash
sudo ip addr add 192.168.10.2/24 dev eth0
sudo ip link set eth0 up
sudo ip route add default via 192.168.10.1
```
With this we have added the ip `192.168.10.2` to the SBC's `eth0` interface.
DHCP would have done that automatically but we didn't setup a DHCP server on the laptop so we have to do this manually.

### DNS

```bash
sudo vi /etc/resolv.conf
```

Add this line (we all like Google, don't we?):
```
nameserver 8.8.8.8
```

We don't need the NetworkManager for this, btw.
Feel free to disable it:
```bash
sudo systemctl disable --now NetworkManager
```

### Let's Test this
```bash
# ping the laptop
# this tests the link works
ping 192.168.10.1
# ping google infrastructure without the DNS
# this tests the NAT works
ping 8.8.8.8
# ping google with DNS
# this tests that the DNS works
ping google.com
```

This setup works most of the time.
Sometimes it's a bit flaky.
I presume that's because the NetworkManager on my laptop interferes but I'm not sure and can't turn it off there.
I often have to run the commands multiple times until they stick.

### SSH
There already is an SSH server installed and running on the SBC.
All I have to do is connect to it from the host:
```bash
ssh user@192.168.10.2
```
So much faster than UART, damn!
No blinking lights, though `:<`

# Building the Kernel
Again we refer to the [VisionFive 2 docs](https://rvspace.org/en/project/VisionFive2_Debian_User_Guide#h-46-compiling-and-updating-linux-kernel).
```bash
sudo apt-get -y install build-essential linux-source bc kmod cpio flex libncurses5-dev libelf-dev libssl-dev dwarves bison git debhelper
git clone --depth 1 --single-branch --branch JH7110_VisionFive2_6.12.y_devel https://github.com/starfive-tech/linux
cd linux
cp arch/riscv/configs/starfive_visionfive2_defconfig .config
make ARCH=riscv olddefconfig
```

Now we need to configure PREEMPT_RT:
```bash
make ARCH=riscv menuconfig
```

<HalfImage src="preemption_model_config.png" />

In this menu screen we select **Scheduler controlled preemption model** mode under **General setup** then **Preemption Model**.
In my case I also had to set this in the `.config` file in order to differentiate this kernel from a `PREEMPT_DYNAMIC` build I also created.
```
CONFIG_LOCALVERSION="preempt-rt"
```

Back to the documentation and we start the compilation:
```bash
make ARCH=riscv -j$(nproc) bindeb-pkg
# for me the .deb files ended up being in the $HOME directory
cd ..
sudo dpkg -i \
    linux-headers-6.12.5*_riscv64.deb \
    linux-image-6.12.5*_riscv64.deb \
    linux-libc-dev_6.12.5*_riscv64.deb
```
When doing so more than once, I had to uninstall an old kernel; probably because there isn't enough space for the rgx firmware on initrd but I'm really not sure.

This takes a while — some time to do the toilet, nice.
Still not done?
Then I have some time to write this article, also nice.
Maybe I should've crosscompiled on my laptop.
Compiling the Linux kernel on a computer that doesn't even have a heat-sink is something...
That took roughly an hour.

Some notes:
The documentation warns about the dtbs not being synced but for me they were, so I left that as is and rebooted.
Installing `debhelper` was missing in the documentation.

## Dealing with Multiple Kernels
I ended up having two v6.12.5 kernels installed: a `PREEMPT_RT` and a `PREEMPT_DYNAMIC` one.
To choose which one to boot I edited `/boot/extlinux/extlinux.conf`.
It has such a nice warning not to edit it.
Here I just renamed the `l0` and `l0r` labels to `l1` and `l1r` and the other way around.
I also rearranged the labels to be a little nicer; I have no idea if that was needed.

I did try using a *proper* method of changing the kernel to boot but this was the only thing I came up with and it works.
I left the `l2` and `l2r` labels in case I screwed something up.

```bash
sudo vi /boot/extlinux/extlinux.conf
```

```
## /extlinux/extlinux.conf
##
## IMPORTANT WARNING
##
## The configuration of this file is generated automatically.
## Do not edit this file manually, use: u-boot-update

default l0
menu title U-Boot menu
prompt 0
timeout 50

label l0
        menu label Debian GNU/Linux trixie/sid 6.12.5preempt-rt+
        linux /vmlinuz-6.12.5preempt-rt+
        initrd /initrd.img-6.12.5preempt-rt+
        fdtdir /dtbs/6.12.5preempt-rt+

        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0

label l0r
        menu label Debian GNU/Linux trixie/sid 6.12.5preempt-rt+ (rescue target)
        linux /vmlinuz-6.12.5preempt-rt+
        initrd /initrd.img-6.12.5preempt-rt+
        fdtdir /dtbs/6.12.5preempt-rt+
        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0 single

label l1
        menu label Debian GNU/Linux trixie/sid 6.12.5+
        linux /vmlinuz-6.12.5+
        initrd /initrd.img-6.12.5+
        fdtdir /dtbs/6.12.5+

        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0

label l1r
        menu label Debian GNU/Linux trixie/sid 6.12.5+ (rescue target)
        linux /vmlinuz-6.12.5+
        initrd /initrd.img-6.12.5+
        fdtdir /dtbs/6.12.5+
        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0 single

label l2
        menu label Debian GNU/Linux trixie/sid 6.6.20-starfive
        linux /vmlinuz-6.6.20-starfive
        initrd /initrd.img-6.6.20-starfive
        fdtdir /dtbs/6.6.20-starfive

        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0

label l2r
        menu label Debian GNU/Linux trixie/sid 6.6.20-starfive (rescue target)
        linux /vmlinuz-6.6.20-starfive
        initrd /initrd.img-6.6.20-starfive
        fdtdir /dtbs/6.6.20-starfive
        append root=/dev/mmcblk1p4 root=/dev/mmcblk1p4 rw console=tty0 console=ttyS0,115200 earlycon rootwait stmmaceth=chain_mode:1 selinux=0 single
```

# Testing
Now we can do some testing of our real-time performance with cyclictest:
```bash
sudo apt install rt-tests stress-ng
sudo echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
# cpu
stress-ng --matrix 4
# mem
stress-ng --vm 4
sudo cyclictest --mlockall --smp --priority=99 --interval=200 --quiet --duration=10m --histofall=200 > out.txt
```

# Some Ideas for Further Investigation
- disable `CONFIG_NO_HZ_IDLE`
- use `CONFIG_HZ_1000` instead of `CONFIG_HZ_100`

# Other Things
To get my custom configs to work I had to edit my `.bash_profile`: [unix.stackexchange.com/questions/94490/bash-doesnt-read-bashrc-unless-manually-started](https://unix.stackexchange.com/questions/94490/bash-doesnt-read-bashrc-unless-manually-started)
