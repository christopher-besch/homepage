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

<!-- <Quote text="Gentoo is a GNU/Linux distro where everything is compiled from source. However it's not much better than other distros. Whoever installed it must be extremely autistic." author="youtu.be/S8s9uzPIqQ4" /> -->

## Who is This Article For?

I think it is easier to start with stating what this article is not.
First it is not a detailed tutorial for installing anything.
Secondly it isn't a rule book with any deviation resulting in the end of the world.

This article explains my endeavour through Gentoo and gives opinionated advice.
I very often and quickly change my opinions so take these with a grain of salt.
I'm also not an expert, I'm only expressing my arguably limited experiences with such weird devices.

## An Overview of Gentoo

If you [bing](https://youtu.be/JSyqXGSYiPw) Gentoo, you'll find that it's a Linux distribution where everything is compiled from source.
I don't particularly like that description, even though it is mostly true.
Gentoo first and foremost is a metadistribution that allows you, the user, the freedom of forming your dream operating system without leaving your completely alone.
The actual compilation step is usually the least painful one and barely notices as programs take longer to install than you're used to.

In my humble opinion the most difficult aspect is the choosing such freedom entails.
What init system causes the least amount of pain with the software you intend to run, what desktop suits your personal style and what display manager goes best with that?
I installed Gentoo countless times with different decisions along the way.
While my dysfunctional combinations butchered some of those installations beyond repair with, others became my daily driver for weeks and months.
And in the end I might not have become an expert but I surely did learn a lot during my endeavour.
So this article aims to convince you to try Gentoo as a learning experience and to aid with the problems I encountered.

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
- audio/mic
- distcc
- power, fan control?
- bluetooth
- os prober

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

## Lunarvim
- neovim in Portage too old (0.5.x)
- compile custom
- fails to :PackerSync, fixed with new version of Lunarvim

## Configs

- /etc/default/grub
- /etc/portage/make.conf
- /usr/share/sddm/scripts/Xsetup

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
- x11-misc/xclip-0.13
- app-editors/vim
- dev-vcs/git
- media-gfx/imagemagick
- app-admin/keepass

## Problems

- xfce-extra/xfce4-pulseaudio-plugin doesn't work

