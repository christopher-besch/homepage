---
type: article
title: "LunarVim in Distrobox"
description: "
You're missing that one program that isn't available in your Linux distro?
With Distrobox, the 'Linux Subsystem for Linux,' you can install it anyways.
This article explains how to do that with the example of installing LunarVim on Red Hat.
"
banner: /social_banner/lvim.png
thumb: ../../../static/social_banner/lvim.png
slug: lvim_in_distrobox
date: 2022-10-25T00:00:00+00:00
listed: true
version: 1.0.0
---

You're missing that one program that isn't available in your Linux distro?
With [Distrobox](https://distrobox.privatedns.org), the 'Linux Subsystem for Linux,' you can install it anyways.
This article explains how to do that with the example of installing [LunarVim](https://www.lunarvim.org) on Red Hat.

LunarVim's dependencies aren't part of Red Hat's official repositories.
But with Docker you can run any program in containers, similar to a virtual machine.
These containers can be based on any distribution, regardless of your host's distro.
So you can use Docker to create for example an Arch container and install LunarVim in it.
To allow LunarVim to access your host's files, you have to mount your host's root directory.
To make these mounts, starting the container and launching its programs from your host easier, Distrobox has been created.

### Installing Requirements on Host
Distrobox requires Docker or Podman (a fork of Docker that runs containers rootlessly).
Both Distrobox and Podman are part of [the Extra Packages for Enterprise Linux (EPEL)](https://docs.fedoraproject.org/en-US/epel), an official repository you can add to Red Hat.
Follow the instructions on the official page linked above to install the repo.
Now you can install what you need:
```bash
yum install podman-docker
yum install distrobox
```

### Creating the Container
First you have to create an Arch container using Distrobox.
Because LunarVim installs many files in the home directory, you should create such a directory specifically for your Arch container.
Otherwise your host's home directory would get bloated.
```bash
mkdir -p ~/.distrobox/arch`
distrobox-create --name arch --image archlinux --home ~/.distrobox/arch
```

Now you can attach your terminal to the container's stdin and stdout:
```bash
distrobox enter arch
```

### Inside the Container
Now you're inside your container's shell.
In this article, all commands that start with a `$` are to be run in your container, not your host.
If you like, you can install all your dotfiles at this point.
```bash
# requires https://gitub.com/christopher-besch/configs in your host's ~/.custom_configs
$ /home/$(whoami)/.custom_configs/install.sh server && source ~/.bashrc
```

Let's use `pacman`, the Arch package manager, to install what Red Hat's `yum` can't provide:
```bash
# if you're asked what repos to use, the defaults are fine
$ sudo pacman -S git make python-pip cargo neovim vim xclip
```
LunarVim requires `node`;
this is best done with `nvm`.
You should check the current version of the installation script in [the official nvm install docs](https://github.com/nvm-sh/nvm#install--update-script) and change the `curl` command accordingly:
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash && source ~/.bashrc
$ nvm install node
```

Once that is done, you can finally install LunarVim.
```bash
# answer yes to all questions
$ bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/master/utils/installer/install.sh)
```

Now a little bit of work has to be done on your containers `~/.bashrc` (located at `~/.distrobox/arch/.bashrc` on your host):
1. Add `export PATH=/home/$(whoami)/.distrobox/arch/.local/bin:$PATH` and
2. remove the line `[[ $- != *i* ]] && return`.
   Otherwise `nvm`'s installation paths don't get loaded when starting LunarVim from your host.

In order for those paths to get loaded, we have to `source` the just edited `~/.bashrc` every time LunarVim starts.
This can be done with a little wrapper script you should put into `~/lvim` in your container.
```bash
#!/bin/bash

source ~/.bashrc
lvim "$@"
```
Mark this file executable
```bash
$ lvim chmod +x ~/lvim
```
and export it to be usable from your host using Distrobox (still from within your container).
```bash
$ distrobox-export --bin "/home/$(whoami)/.distrobox/arch/lvim" --export-path "/home/$(whoami)/.local/bin"
```
This creates the file `~/.local/bin/lvim` on your host.
When you run it from your host, Distrobox starts the container (if not already done so) and launches LunarVim with the `PATH` variable and all mounts properly configured.

### Finalizing
You need to `export PATH=/home/$HOME/.local/bin:$PATH` in your host's `~/.bashrc` but then you can run `lvim` from your host and use LunarVim just as if it were natively installed.
Since all the language servers used by LunarVim are installed in the container, all programming languages you use need to be installed in both your host and your container.

