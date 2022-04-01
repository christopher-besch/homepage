---
type: article
title: "Surviving Gentoo for a Month"
description: "
    [description here]
"
banner: /social_banner/gentoo_challenge.png
thumb: ../../../static/social_banner/gentoo_challenge.png
slug: gentoo_challenge
date: 2022-03-20T00:00:00+00:00
listed: true
version: 0.0.1
---
import Quote from "src/components/quote";

Gentoo is a Linux distribution that offers as many options as possible while its Portage package manager leverages the heavy lifting.
In my arguably still very inexperienced opinion the most difficult aspect is the choosing such freedom entails.
What init system causes the least amount of pain with the software you intend to run, what desktop suits your personal style and what display manager goes best with that?

I installed Gentoo countless times with different decisions along the way.
While dysfunctional combinations butchered some of those installations beyond repair with, others became my daily driver for weeks and months.
In the end I might not have become an expert but I surely did learn a lot during this endeavour.
So this opinionated article documents said endeavour, all choices I made, any problems I encountered and their subsequent solutions.

If you decide to try Gentoo for yourself, I'd recommend doing so in a virtual machine instead of directly on your main PC.
VMs allow you to save snapshots before each step in the installation.
So when you screw something up—and trust me you will—you can simply go back.
Please don't write me any angry emails when you accidentally deleted your family photos lacking a backup ;)
<!-- TODO: add image -->

```toc
exclude: Table of Contents
```

# Choices Along the Way
The [Gentoo Handbook (AMD64)](https://wiki.gentoo.org/wiki/Handbook:AMD64) is such a great tutorial that there is basically nothing left for me to add.
Instead I'll go through the decisions one has to make to end up with a system to my liking.
When you stumble upon some concepts that aren't explained here but you're unfamiliar with, you should take a look at the handbook or [the Gentoo wiki](https://wiki.gentoo.org).

Generally when this article doesn't explain a choice, I chose the default or non-extra option.

# systemd
To install the operating system, a few tools need to be installed first.
These are the first things your soon to be Linux installation gets to see, or in other words its primordial soup.
This primordial soup, correctly call stage 3, comes in a few varieties.
<!-- TODO: add image -->

I want a system with a desktop, so I choose the appropriate desktop profile.
And then there's the matter of the init system.

On Linux the init system is the first program that starts once the kernel has booted up.
With Gentoo you can use whatever init system you like but the usual options are OpenRC and systemd.
OpenRC is Gentoo's default and when you choose to use systemd, you should read the [systemd article](https://wiki.gentoo.org/wiki/Systemd).

I'm used to systemd and wanted to try something non-default so I went with it on my final installation.
In my experience the handbook makes a good job at explaining what you have to do differently when using systemd.
The only thing I noticed to be missing was [NTP to synchronize your clock with `sudo timedatectl set-ntp true`](https://wiki.gentoo.org/wiki/Systemd#Time_and_date)—something you realize very quickly when daylight saving starts.

# Xfce
I use the terminal emulator for **everything**.
Usually nothing graphical, besides it and Firefox, is running.
So my focus lies entirely on making the terminal as pleasant and efficient to use as possible.
Therefore I'm using the most lightweight and least painful desktop environment I could find, Xfce.
Out of the box it doesn't look as fancy as your average [r/unixporn](https://www.reddit.com/r/unixporn) post but you can tailor it to your liking—which I promptly didn't do.

So my desktop looks like this:
<!-- TODO: add image -->
and not like this:
<!-- TODO: add image with credit -->

Coming back to Gentoo, there's an article on [installing Xfce](https://wiki.gentoo.org/wiki/Xfce) you should follow.
This most notably includes selecting an appropriate profile.
You should do this when [installing the base system](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Base#Choosing_the_right_profile).

## SDDM
Without a display manager your newly booted up system presents you only with a terminal—even when Xfce is installed.
To give you a graphical login prompt and launch Xfce, you need something like [SDDM](https://wiki.gentoo.org/wiki/SDDM).
It is one of many [display managers](https://wiki.gentoo.org/wiki/Display_manager) out there.
Feel free to play around with other options, SDDM is only the first one I tried and that fulfills all my simple needs.

(Don't forget to activate its daemon with `systemctl enable sddm.service`.)

[SDDM](https://wiki.gentoo.org/wiki/SDDM)

# Programs I Like
Installing software on Gentoo is often as simple as installing the appropriate package.
For me this means installing:
- `app-admin/keepass`: A local password manager.
- `net-im/discord-bin`: A chat program everyone uses and hates.
- `app-text/tree`: A convenient way of displaying folder structures in the terminal.
- `app-text/pdftk`: A toolkit for handling PDFs in the terminal.
- `media-gfx/gimp`: The GNU image manipulation program.
- `app-text/pdfgrep`: Searching in PDFs with the familiar GREP syntax.

You can install these packages with `emerge --ask media-gfx/gimp`.
Sometimes this command prompts you to set some USE flags.
These can either be set in `/etc/portage/make.conf` [to affect all packages](https://wiki.gentoo.org/wiki/etc/portage/make.conf#USE) or in `/etc/portage/package.use` [to not alter the global USE flags](https://wiki.gentoo.org/wiki/etc/portage/package.use).

My `make.conf` looks like this:
```
[...]
ACCEPT_LICENSE="*"
GRUB_PLATFORMS="efi-64"
USE="mount pulseaudio gtk3"
L10N="en-GB en de"
[...]
```
And my `package.use` like this:
```
# used for Keepass2
dev-lang/mono minimal
# install everything
app-text/texlive *
app-text/texlive-core xetex
```
These files change over time;
you can find the current versions [here](TODO: add).

### Kitty
My current terminal emulator of choice is Kitty mainly because it supports displaying images directly in the terminal.
Unfortunately you have to jump through a few hoops to install it on Gentoo.
Refer to the [Kitty on Gentoo article](https://wiki.gentoo.org/wiki/Kitty) for installation instructions.

# Notes
- where am I coming from?
- what is Gentoo, why Gentoo(advantages, disadvantages)
- challenges, solutions -> disclaimer!, not static
- configs (fstab, make.conf)
- explain Xkbmpa, bash...
- only set few keybinds with gui -> image
- set keyboard layout with sddm instead of xfce4
- os prober config
- firefox:
    - copy bookmarks
    - keyword:enabled

## Goals

### Done
- systemd
- xfce
- wifi
- kitty
- bash, git, gdb
- lunarvim
- discord
- firefox
- audio/mic, noisetorch
- power
- os prober

### Unfished
- distcc
- fan control?
- bluetooth
- virtual machine

## Steps
- disable pc speaker: /etc/modprobe.d/blacklist.conf `blacklist pcspkr`

## Lunarvim
- neovim in Portage too old (0.5.x)
- compile custom
- fails to :PackerSync, fixed with new version of Lunarvim
- requirements:
    - sys-apps/fd
    - x11-misc/xclip

## Missing Configs
- /etc/default/grub
- /usr/share/sddm/scripts/Xsetup

## Packages

### xfce
- xfce-extra/xfce4-screenshooter
- xfce-extra/xfce4-cpugraph-plugin
- xfce-extra/xfce4-notifyd
- x11-apps/setxkbmap

- media-sound/pavucontrol
- sys-apps/exa
- app-editors/vim
- media-gfx/imagemagick
- app-text/texlive
- dev-vcs/git
- app-shells/bash-completion

- app-portage/gentoolkit
- app-portage/genlop

## OCRmyPDF

- app-text/tesseract
- media-gfx/pngquant

- L10N="en-GB en de"

## Problems

- xfce-extra/xfce4-pulseaudio-plugin doesn't work
- xfce-extra/xfce4-netload-plugin doesn't work

## Attempts
- VM:
    - no desktop
    - OpenRC
    - manual kernel config
    - Grub2
    - didn't boot
- VM:
    - genkernel
    - works
- VM:
    - xfce
    - SSDM
    - systemd
    - genkernel, Grub2
- ThinkPad:
    - xfce
    - SSDM
    - genkernel, Grub2
    - systemd
    - DHCPCD, wpa_supplicant
    - wifi not on reboot (has to be called explicitly)
    - net_setup fine
    - NetworkManager, nm_appplet -> constant ettempting connection, unstable (probably biting with custom wpa_supplicant config)
- ThinkPad:
    - NetworkManager (no DHCPCD, wpa_supplicant directly)
    - works
- PC:
    - not arm architecture

