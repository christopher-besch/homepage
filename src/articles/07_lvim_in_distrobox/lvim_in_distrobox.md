---
type: article
title: "LunarVim in Distrobox"
description: "
You're missing that one program that isn't available in your Linux distro?
With Distrobox, the 'Linux Subsystem for Linux', you can do just that.
This article explains how to do that with the example of installing LunarVim on Red Hat.
"
banner: /social_banner/bash_cmds.png
thumb: ../../../static/social_banner/bash_cmds.png
slug: bash_cmds/mp3_tag
date: 2022-10-22T00:00:00+00:00
listed: true
version: 1.0.0
---

You're missing that one program that isn't available in your Linux distro?
With [Distrobox](https://distrobox.privatedns.org), the 'Linux Subsystem for Linux', you can do just that.
This article explains how to do that with the example of installing [LunarVim](https://www.lunarvim.org) on Red Hat.

# Install Lunarvim on Arch in Distrobox
- `mkdir -p ~/.distrobox/arch`
- `distrobox-create --name arch --image archlinux --home ~/.distrobox/arch`
- `distrobox enter arch`

- (requires https://gitub.com/christopher-besch/configs) `/home/$(whoami)/.custom_configs/install.sh server && source ~/.bashrc`
- `sudo pacman -S git make python-pip cargo neovim vim xclip` (use defaults)
- (check current version) `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash && source ~/.bashrc`
- `nvm install node`
- `bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/master/utils/installer/install.sh)` (all yes)
- add `export PATH=/home/$(whoami)/.distrobox/arch/.local/bin:$PATH` to `~/.bashrc`
- remove `[[ $- != *i* ]] && return` from `~/.bashrc`
- add to `~/lvim`
```bash
#!/bin/bash

source ~/.bashrc
lvim "$@"
```
- `lvim chmod +x ~/lvim`
- `distrobox-export --bin "/home/$(whoami)/.distrobox/arch/lvim" --export-path "/home/$(whoami)/.local/bin"`
- remember to install all programming languages you need in the distrobox too
