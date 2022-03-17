# Gentoo Challenge

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
