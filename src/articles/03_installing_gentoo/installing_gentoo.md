---
type: article
title: "Installing Gentoo To My Liking"
description: "
    Gentoo is a Linux distribution that offers as many options as possible.
    This article leads you through the decisions I took to end up with a system that best suits my needs.
"
banner: /social_banner/installing_gentoo.png
thumb: ../../../static/social_banner/installing_gentoo.png
slug: installing_gentoo
date: 2022-04-08T00:00:00+00:00
listed: true
version: 0.0.1
---
import AutoPlayVideo from "src/components/autoplay_video";
import HalfImage from "src/components/half_image";
import Spacer from "src/components/spacer";

import cpu_usage from "./cpu_usage.png";
import pavucontrol from "./pavucontrol.png";
import xfce_system_defaults_keyboard_layout from "./xfce_system_defaults_keyboard_layout.png";
import firefox_keyword_enabled from "./firefox_keyword_enabled.png";
import firefox_search_bar from "./firefox_search_bar.png";
import stage3_download from "./stage3_download.png";
import my_desktop from "./my_desktop.png";
import bash_completion from "./bash_completion.mp4";
import vm_snapshots from "./vm_snapshots.png";

Gentoo is a Linux distribution that offers as many options as possible.
While its package manager Portage leverages the heavy lifting, you have to deal with the choosing such freedom entails:
What init system causes the least amount of pain with the software you intend to run, what desktop suits your personal style and which display manager goes best with that?

I've setup Gentoo countless times with different decisions along the way.
While dysfunctional combinations butchered some of those installations beyond repair, others became my daily driver for weeks and months.
In the end I might not have become an expert but I surely did learn a lot during this endeavour.
So this opinionated article documents said endeavour, all choices I made, any problems I encountered and their subsequent solutions.

<HalfImage src={vm_snapshots} />

If you decide to try Gentoo for yourself, I'd recommend doing so in a virtual machine instead of directly on your hardware.
VMs allow you to save snapshots before each step.
Thus when you screw something up—and trust me you will—you can simply go back.
Please don't write me any angry emails after you accidentally deleted your family photos lacking a backup ;)

### Table of Contents
```toc
exclude: Table of Contents
to-heading: 3
```

<Spacer />

# Choices Along the Way
The [Gentoo Handbook (AMD64)](https://wiki.gentoo.org/wiki/Handbook:AMD64) is such a great tutorial that there is basically nothing left for me to add.
Instead I'll go through the decisions leading to a system of my liking.
If a choice is not explained, I chose the default or non-extra option as explained in the handbook.
When you stumble upon some concepts you are unfamiliar with, you should take a look at the handbook or [Gentoo wiki](https://wiki.gentoo.org).
I should also add that the choices available to you and my opinion change with time.
In a few years this article may very well mostly consist of outdated information, so make sure to always consult up-to-date references, like the [Gentoo Handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64).

# Installing Gentoo

## GPT, UEFI vs. MBR, Legacy BIOS
There are two different ways of partitioning your disk, GPT and MBR.
They are closely tied to the two boot process types, UEFI and legacy BIOS.
[The handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Disks) explains the differences more closely so I'll leave it at stating that I used the modern GPT, UEFI option.

### fstab
The `/etc/fstab` file defines what partitions should be mounted where and how.
This is explained in [later chapters of the handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/System).

To address a partition you can choose between filesystem labels and UUIDs.
While labels like `/dev/sdb3` are easier to comprehend than UUIDs (e.g. `0b04fdcc-6d7f-4a88-bf57-1c2965bf8ceb`), UUIDs are a lot less risky.
This is because labels are defined by the order the devices get detected by the kernel.
And this order can change, for example when adding or replacing disks.
UUIDs on the other hand don't change.

To convert labels to UUIDs you can use the `blkid` command like this:
```bash
~ λ blkid
/dev/sdb1: UUID="A76D-24D1" [...]
/dev/sdb2: UUID="c8211424-0c21-4eec-aa92-9cc4a9c043bf" [...]
/dev/sdb3: UUID="0b04fdcc-6d7f-4a88-bf57-1c2965bf8ceb" [...]
[...]
```

So my fstab looks like this:
```bash
UUID=A76D-24D1                            /boot vfat defaults,noatime 0 2
UUID=c8211424-0c21-4eec-aa92-9cc4a9c043bf none  swap sw               0 0
UUID=0b04fdcc-6d7f-4a88-bf57-1c2965bf8ceb /     ext4 noatime          0 1
```

## systemd
To install the operating system, a few tools need to be available.
These are the first things your soon to be Linux installation gets to consist out of, or in other words its primordial soup.
This primordial soup, correctly called stage 3, comes in a few varieties:
<HalfImage src={stage3_download} />

I want a system with a desktop, so I chose the appropriate desktop profile.
And then there's the matter of the init system.

On Linux the init system is the first program that starts once the kernel has booted up.
With Gentoo you can use whatever init system you like but the usual options are OpenRC and systemd.
OpenRC is Gentoo's default.
When you choose to use systemd, you should read the [systemd article](https://wiki.gentoo.org/wiki/Systemd).

I'm used to systemd and wanted to try something non-default so I went with that on my final installation.
In my experience the handbook makes a good job at explaining what you have to do differently when using systemd.
The only thing I noticed to be missing was [NTP to synchronize your clock with `sudo timedatectl set-ntp true`](https://wiki.gentoo.org/wiki/Systemd#Time_and_date)—something you realize very quickly when daylight saving starts.
So you should nevertheless read the [systemd article](https://wiki.gentoo.org/wiki/Systemd).

<Spacer />

## genkernel and GRUB 2
At some point you have to decide how you intend to install the Linux kernel.
My first attempts used the [manual configuration](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Kernel#Manual_configuration), which always caused trouble but would theoretically result in a very clean build.
On my final installation I ended up using the much simpler to use [genkernel](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Kernel#Alternative:_Using_genkernel), with which I had no problems whatsoever.

Once the kernel is installed and a few other steps in the handbook have been traversed, you get to the stage of choosing a bootloader.
The bootloader is the piece of software starting the kernel after the power button has been pressed.
As described in the [systemd article](https://wiki.gentoo.org/wiki/Systemd#GRUB_2) it is crucial to edit `/etc/default/grub` and add this line:
```bash
[...]
# Append parameters to the linux kernel command line
GRUB_CMDLINE_LINUX="init=/lib/systemd/systemd"
[...]
```
Otherwise the kernel wouldn't launch systemd and leave you stranded on a black screen with a kernel panic.

I also have to add this to my `/etc/portage/make.conf` before emerging `sys-boot/grub` because I'm using the UEFI boot process.
```bash
[...]
GRUB_PLATFORMS="efi-64"
[...]
```

### os-prober
Because I enjoy playing games from time to time, Windows still does a better job at that and I like separating work and play, I'm running a Gentoo-Windows dual boot.
To be prompted at every boot which OS you want to endure at the moment, you need os-prober.
You can install it with `emerge --ask sys-boot/os-prober` and have to enable it in `/etc/default/grub`:
```bash
[...]
GRUB_DISABLE_OS_PROBER=false
[...]
```
os-prober doesn't run at every boot, instead it only looks for any other bootable partitions when you `grub-mkconfig -o /boot/grub/grub.cfg` and makes grub aware of them.

## Xfce
I use the terminal emulator for **everything**.
Usually nothing graphical, besides it and Firefox, is running.
So my focus lies entirely on making the terminal as pleasant and efficient to use as possible.
Therefore I'm using the most lightweight and least painful desktop environment I could find, Xfce.
Out of the box it doesn't look as fancy as your average [r/unixporn](https://www.reddit.com/r/unixporn) post but you can tailor it to your liking—which I promptly didn't do.

So my desktop looks as basic as you can get:
<HalfImage src={my_desktop} full={true} />

<Spacer />

Coming back to Gentoo, there's an article on [installing Xfce](https://wiki.gentoo.org/wiki/Xfce) you should follow.
This most notably includes selecting an appropriate profile when [installing the base system](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Base#Choosing_the_right_profile).

There are a few extra packages I like to complement Xfce with.
- `xfce-extra/xfce4-screenshooter`: A simple screenshot tool.
<HalfImage src={cpu_usage} />
- `xfce-extra/xfce4-cpugraph-plugin`: Show your current CPU usage in the task bar.
- `xfce-extra/xfce4-notifyd`: Enable notifications.
<HalfImage src={pavucontrol} />
- `media-sound/pavucontrol`: Allow for more fine grained control over your audio devices.
- `media-fonts/fonts-meta`: Install non-Latin character set.

Since I use VI as my editor, which requires pressing Escape very often and I never understood why anyone would want to use Caps Lock, I bind my Caps Lock key to Escape.
On a system using Xorg, which mine is, this can be achieved using an `.Xmodmap` file in your home directory:
```bash
! make caps key perform escape action
remove Lock = Caps_Lock
keysym Caps_Lock = Escape
```
It is part of my [config collection](https://github.com/christopher-besch/configs).

<Spacer />

### SDDM
Without a display manager your newly booted up system presents you only with a terminal—even when Xfce is installed.
To give you a graphical login prompt and launch Xfce, you need something like [SDDM](https://wiki.gentoo.org/wiki/SDDM).
It is one of many [display managers](https://wiki.gentoo.org/wiki/Display_manager) out there.
Feel free to play around with other options, SDDM is only the first one I tried and that fulfills all my simple needs.
(Don't forget to activate its daemon with `systemctl enable sddm.service`.)

To set the keyboard layout for the login screen—what Xfce calls it's "system defaults"—you have to create the `/usr/share/sddm/scripts/Xsetup` script.
<HalfImage src={xfce_system_defaults_keyboard_layout} />

This sets it to the UK keyboard layout:
```bash
#!/bin/sh
# Xsetup - run as root before the login dialog appears
setxkbmap "gb"
```
`setxkbmap` is a command you have to install first with `emerge --ask x11-apps/setxkbmap`.

<Spacer />

## Wi-Fi
When you only use Ethernet, you can simply [install dhcpcd](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/System#DHCP_via_dhcpcd_.28any_init_system.29).
If instead you rely on Wi-Fi, you should use NetworkManager.

The installation is described [here](https://wiki.gentoo.org/wiki/NetworkManager);
this paragraph only summarizes the most important steps.
You have to enable the `networkmanager` and `wifi` USE flags, update your system using `emerge --ask --changed-use --deep @world` and install NetworkManager `emerge --ask net-misc/networkmanager`.
A really useful but not mandatory addition is `gnome-extra/nm-applet`.
It offers a graphical interface for connecting to networks.

## Programs I Use
Installing software on Gentoo is often as simple as emerging the appropriate package.
For me this means installing:

- `app-admin/keepass`: A local password manager.
- `net-im/discord-bin`: A chat program everyone uses and hates at the same time.
- `app-text/tree`: A convenient way of displaying folder structures in the terminal.
- `app-text/pdftk`: A **T**ool**K**it for handling **PDF**s in the terminal.
- `media-gfx/gimp`: The **G**NU **I**mage **M**anipulation **P**rogram.
- `app-text/pdfgrep`: Searching in PDFs with the familiar GREP syntax.
- `sys-apps/exa`: A colourful replacement for `ls`.
- `app-editors/vim`: Quite useful when you don't want to go through the hassle of [installing Lunarvim](#lunarvim) during setup.
- `app-portage/gentoolkit`: A few useful tools for working with Portage.
- `app-portage/genlop`: Estimate compilation time with Portage.
- `media-video/vlc`: You've got some obscure media format to play? VLC can handle it.
- `sys-process/time`: Display resources used by a program.

You can install these packages with `emerge --ask [package name]`.
Sometimes this command prompts you to set some USE flags.
These can either be set in `/etc/portage/make.conf` [to affect all packages](https://wiki.gentoo.org/wiki/etc/portage/make.conf#USE) or in `/etc/portage/package.use` [to not alter the global USE flags](https://wiki.gentoo.org/wiki/etc/portage/package.use).
My `make.conf` and `package.use` can be found in my [config collection](https://github.com/christopher-besch/configs) under the Gentoo section.

What follows are a few more programs with more complicated installations.

### Kitty
My terminal emulator of choice is Kitty, mainly because it supports displaying images directly in the terminal.
Unfortunately you have to jump through a few hoops to install it on Gentoo, because it's still in the testing branch.
Refer to the [Kitty on Gentoo article](https://wiki.gentoo.org/wiki/Kitty) for installation instructions.
To be able to show images in the terminal, you also have to install `media-gfx/imagemagick`.
My kitty config is also part of my [config collection](https://github.com/christopher-besch/configs).

### Lunarvim
Lunarvim forms a configuration layer on top of Neovim and is the text editor I used for writing this article.
Neovim, in turn, is a fork of vim, which is the **i**mproved of version of **vi**.

Lunarvim has a few requirements:
- `sys-apps/fd`
- `x11-misc/xclip`
- Neovim latest

The last one is a problem since the version Portage supplies is too old so you have to [compile Neovim yourself](https://github.com/neovim/neovim/wiki/Building-Neovim#building).
After Lunarvim has been installed, you can copy my config, which, again, can be found in my [config collection](https://github.com/christopher-besch/configs).

### Noisetorch
I spend a lot of time in voice calls so good noise suppression is absolutely vital.
Noisetorch does a good job at that and filters out my hammering on the keyboard while leaving my voice untouched.
To install it you have to extract a tarball in your home directory.
This is explained [here](https://github.com/lawl/NoiseTorch#download--install).

### Git
<AutoPlayVideo src={bash_completion} width={600} height={280} />

To make git work the way you're used to, you need two packages:
- `dev-vcs/git`
- `app-shells/bash-completion`

The second one is required to give bash the ability to autocomplete, as you can see in the video.

### LaTeX
On Gentoo, the TeX Live compiler lives in the `app-text/texlive` package.
You should take a look at [its USE flags](https://wiki.gentoo.org/wiki/TeX_Live) as you might need some of them for your particular document.
I simply include them all with line `app-text/texlive *` in my `package.use`.

### OCRmyPDF
[OCRmyPDF](https://ocrmypdf.readthedocs.io/en/latest) is a Python program that uses Tesseract to convert scanned PDFs to text and make them searchable with Ctrl+F.
On Gentoo you need these two packages
- `app-text/tesseract`
- `media-gfx/pngquant`

and have to install OCRmyPDF itself using `python3 -m pip install`

Tesseract comes with only the English language pack by default.
As described [here](https://ocrmypdf.readthedocs.io/en/latest/languages.html#gentoo-users) you have to set the [`L10N` use extension](https://wiki.gentoo.org/wiki//etc/portage/make.conf#L10N) in your `make.conf` to install more.
This for example lets you convert German and English PDFs.

```bash
L10N="en de"
```

This use extension is respected by many packages to install language specific features, not just by Tesseract.

### OBS Studio
OBS Studio is a very convenient way of recording your screen.
It can be installed using Portage, but similar to Kitty, OBS Studio is as of writing this article in the testing branch.
So you have to install it using `emerge --ask --autounmask=y --autounmask-write media-video/obs-studio`.

### Firefox
You have two main ways of [installing Firefox](https://wiki.gentoo.org/wiki/Firefox), `www-client/firefox` to compile it from source and the precompiled `www-client/firefox-bin`.
I chose the latter, binary version as Firefox receives very frequent updates and compiling a browser always takes a lot of time.
Incidentally this is the only program I don't compile from source.

I like using these extensions:
- [Unhook](https://addons.mozilla.org/en-US/firefox/addon/youtube-recommended-videos): Remove YouTube recommended videos.
- [Sponser Block](https://addons.mozilla.org/en-US/firefox/addon/sponsorblock): Skip sponsorships on YouTube.
- [Adblock Plus](https://addons.mozilla.org/en-US/firefox/addon/adblock-plus): Block ads.
- [Kee](https://addons.mozilla.org/en-US/firefox/addon/keefox): Firefox integration for Keepass.
- [Google Lighthouse](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse): Create performance and accessibility reports for any webpage.
- [Dark Reader](https://addons.mozilla.org/en-US/firefox/addon/darkreader): Add dark mode to every website.
- [Stylus](https://addons.mozilla.org/en-US/firefox/addon/styl-us): Add prettier dark mode to GitHub with [this StylishTheme](https://github.com/StylishThemes/Github-Dark).

What I also like doing is splitting the address and search bar.
<HalfImage src={firefox_search_bar} />

Then you can remove search results from the address bar and not leak any urls to your search provider.
You can do so in the `about:config` page.
<HalfImage src={firefox_keyword_enabled} />

### QEMU and Virt-manager
After a friend made me aware of the huge performance increase KVM (**K**ernel-based **V**irtual **M**achine) entails, I switched to QEMU with the Virt-manager frontend.
And I can confirm, it is much faster than VirtualBox, which I've used before—something around 85% native performance with my crude benchmarks.
To install it you should read the [QEMU](https://wiki.gentoo.org/wiki/QEMU) and [Virt-manager](https://wiki.gentoo.org/wiki/Virt-manager) articles for Gentoo.
Only make sure to add this to your `make.conf`:
```bash
USE="spice usb usbredir"
QEMU_SOFTMMU_TARGETS="x86_64"
```

<Spacer />

## Disabling the PC Speaker
I ran into the weird problem that my pc speaker, that squeaky little piezo thing, just didn't shut up and constantly annoyed me when I mistyped a command.
A sustainable solution to this problem is to disable the appropriate kernel module by creating the file `/etc/modprobe.d/blacklist.conf` and writing this line:
```bash
blacklist pcspkr
```

# Wrapping Up

## Config Collection
As you might have noticed I very often referred to my [config collection](https://github.com/christopher-besch/configs).
While I won't always keep this article up-to-date, this GitHub repository will always reflect the configs I'm using at the time.
What exactly it contains is listen in its `README.md`.

## Cheat Sheet
Take a look at the [official cheat sheet](https://wiki.gentoo.org/wiki/Gentoo_Cheat_Sheet).
- install package: `emerge --ask [package name]`
- update system repository: `emerge --sync`
- propagate USE flag changes: `emerge --ask --update --newuse --deep @world`, `emerge --ask --depclean`
- uninstall package: `emerge --deselect [package name]`, `emerge --ask --depclean`

## What Remains
There are quite a few more things I would have liked to try but didn't get to.
This includes Bluetooth support and compiling packages on multiple machines using distcc.
But this article already took long enough so I'll leave it at that.

Even though installing Gentoo was incredibly tiresome and painful, I learned a lot about Linux and am more content with my current operating system than ever before.
Sometimes you just have to endure some pain to reach heaven.

Thanks for sticking around and I wish you a splendid day!

<!-- # Still Unsolved Problems -->
<!-- - xfce-extra/xfce4-pulseaudio-plugin doesn't work -->
<!-- - xfce-extra/xfce4-netload-plugin doesn't work -->
<!-- - fstab doesn't mount smb drives on boot -->
<!-- - getsby develop not working -->

