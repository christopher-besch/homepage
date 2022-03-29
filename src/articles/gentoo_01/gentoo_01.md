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

Gentoo is a Linux distribution that offers as many options as possible while its Portage package manager leverages most of the heavy lifting.
In my arguably still very inexperienced opinion the most difficult aspect is the choosing such freedom entails.
What init system causes the least amount of pain with the software you intend to run, what desktop suits your personal style and what display manager goes best with that?

I installed Gentoo countless times with different decisions along the way.
While my dysfunctional combinations butchered some of those installations beyond repair with, others became my daily driver for weeks and months.
In the end I might not have become an expert but I surely did learn a lot during this endeavour.
So this opinionated article documents said endeavour, all choices I made, any problems I encountered and their subsequent solutions.

If you decide to try Gentoo for yourself, I'd recommend doing so in a virtual machine instead of directly on your main PC.
VMs allow you to save snapshots before each step in the installation.
So when you screw something up—and trust me you will—you can simply go back.
Please don't write me any angry emails when you accidentally deleted your family photos lacking a backup.
<!-- TODO: add image -->

```toc
exclude: Table of Contents
```

## Choices Along the Way
The [Gentoo Handbook (AMD64)](https://wiki.gentoo.org/wiki/Handbook:AMD64) is such a great tutorial that there is basically nothing left for me to add.
Instead I'll go through the decisions one has to take to end up with a system to my liking.

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

- systemd
- xfce
- wifi
- kitty
- bash, git, gdb
- lunarvim
- discord
- firefox
- audio/mic, noisetorch
- distcc
- power, fan control?
- bluetooth
- os prober
- virtual machine

## Steps
- disable pc speaker: /etc/modprobe.d/blacklist.conf `blacklist pcspkr`

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

## Lunarvim
- neovim in Portage too old (0.5.x)
- compile custom
- fails to :PackerSync, fixed with new version of Lunarvim

## Configs
- /etc/default/grub
- /etc/portage/make.conf
- /usr/share/sddm/scripts/Xsetup

## Tips
- don't forget `timedatectl set-net true`

## Packages
- app-shells/bash-completion
- xfce-extra/xfce4-screenshooter
- xfce-extra/xfce4-netload-plugin
- xfce-extra/xfce4-cpugraph-plugin
- xfce-extra/xfce4-notifyd
- media-sound/pavucontrol
- sys-apps/exa
- sys-apps/fd
- x11-apps/setxkbmap
- x11-misc/xclip
- app-editors/vim
- dev-vcs/git
- media-gfx/imagemagick
- app-admin/keepass
- net-im/discord-bin
- app-text/tree
- app-text/pdftk
- app-text/texlive
- media-gfx/gimp
- app-text/pdfgrep
- app-portage/gentoolkit

## OCRmyPDF

- app-text/tesseract
- media-gfx/pngquant

- L10N="en-GB en de"

## Problems

- xfce-extra/xfce4-pulseaudio-plugin doesn't work

