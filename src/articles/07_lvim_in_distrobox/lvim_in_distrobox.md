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

LunarVim's dependencies aren't part of Red Hat's official repositories.
With Docker you can run programs in containers on your host's operating system, similar to a virtual machine.
These containers can be based on any distribution, regardless of your host's distro.
So you can use Docker to create for example an Arch container, install LunarVim and mount your host's root directory.
To make this easier, Distrobox has been created.

You first have to create an Arch container using Distrobox.
Because LunarVim installs many files in the home directory, you should create such a directory specifically for your Arch container.
```bash
mkdir -p ~/.distrobox/arch`
distrobox-create --name arch --image archlinux --home ~/.distrobox/arch
```

Now you can attach your terminal to the containers stdin and stdout:
```bash
distrobox enter arch
```

If you like, you can install all your dotfiles at this point.
```bash
# requires https://gitub.com/christopher-besch/configs in ~/.custom_configs
/home/$(whoami)/.custom_configs/install.sh server && source ~/.bashrc
```

Let's use `pacman`, the Arch package manager, to install what Red Hat's `yum` can't provide
```bash
# if you're asked what repos to use, the defaults are fine
sudo pacman -S git make python-pip cargo neovim vim xclip
```
LunarVim requires `node`;
this is best done with `nvm`:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash && source ~/.bashrc
nvm install node
```
You should check the current version of the installation script in [the official nvm install docs](https://github.com/nvm-sh/nvm#install--update-script).

Once that is done, you can actually install LunarVim.
```
# answer yes to all questions
bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/master/utils/installer/install.sh)
```

Now a little bit of work has to be done on your containers `~/.bashrc` (located at `~/.distrobox/arch/.bashrc` on your host).
1. Add `export PATH=/home/$(whoami)/.distrobox/arch/.local/bin:$PATH` and
2. remove the line `[[ $- != *i* ]] && return`.
   Otherwise `nvm`'s installation paths don't get loaded when starting LunarVim from your host.

So that those paths get properly loaded, we have to `source` the `~/.bashrc` we just edited.
This can be done with a little wrapper script you should put into `~/lvim` in your container.
```bash
#!/bin/bash

source ~/.bashrc
lvim "$@"
```
Mark this file executable
```bash
lvim chmod +x ~/lvim
```
and export it to be usable from your host.
```bash
distrobox-export --bin "/home/$(whoami)/.distrobox/arch/lvim" --export-path "/home/$(whoami)/.local/bin"
```

You need to `export PATH=/home/$HOME/.local/bin:$PATH` in your host's `~/.bashrc` but then you can run `lvim` from your host and use LunarVim just as you'd expect to.
Since all the language servers used by LunarVim are installed in the container, all programming languages you use need to be installed in both your host and your container.

