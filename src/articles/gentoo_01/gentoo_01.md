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

<Quote text="Gentoo is a GNU/Linux distro where everything is compiled from source. However it's not much better than other distros. Whoever installed it must be extremely autistic." author="youtu.be/S8s9uzPIqQ4" />

# Notes

- where am I coming from?
- what is Gentoo, why Gentoo(advantages, disadvantages)
- challenges, solutions -> disclaimer!, not static
- configs (fstab, make.conf)
- explain Xkbmpa, bash...

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
