---
type: article
title: "grub-install --removable for buggy UEFI"
description: "
Install Debian on a device with a broken NVRAM.
"
banner: /social_banner/debian_grub.png
thumb: ../../../static/social_banner/debian_grub.png
slug: grub_install_removable
date: 2024-11-08T00:00:00+00:00
listed: true
version: 1.0.0
---

On my quest of ridding my family from Windows I was faced with a particularly interesting Debian 12 installation.
What's so *interesting* about this one?

Apart from the dog slow HDD the Debian installer chugs along just fine—until...`grub-install dummy`.
It doesn't fail, it just hangs.

Maybe get some cake and check on it afterwards...
No, still hanging there.
Battery-disconnect it is—click.

Reboot, hit up the live-USB's shell and see what the hell happened.
Let's chroot into the broken install:
```bash
# from: https://unix.stackexchange.com/questions/541489/grub-fails-to-install-during-debian-10-installer-re-uefi-supermicro-motherboa
mkdir /target
mount /dev/sdX2 /target
mount /dev/sdX1 /target/boot/efi
mount -o rbind /dev /target/dev 
mount -t proc proc /target/proc 
mount -t sysfs sys /target/sys 
mount -t efivarfs efivarfs /target/sys/firmware/efi/efivars 
chroot /target/ 
```

Everything looks fine so let's fix that GRUB2 installation.
```bash
grub-install --verbose /dev/sdX
```
And...drum roll...it hangs—at trying to `modprobe efivars`.
Huh, why's that?

Let's try something:
```
grub-install --verbose --no-nvram /dev/sdX
```
And...it works—in that it finishes without errors.
But now the laptop fails to find the new Debian installation and only let's me boot back into the live-USB.

With the `--no-nvram` option we at least get through the GRUB2 installation.
It appears the cheapo laptop's UEFI is bugged causing Linux trouble with editing the motherboard's NVRAM.
Cool, why is that bad?

`grub-install` wants to make the UEFI aware of the new bootloader.
It does so by storing the bootloader's location in non-volatile RAM of the motherboard.
Then your shiny-new bootloader appears in the EUFI boot options and you can boot.

That doesn't work here, so what now?

## `grub-install --removable` to the Rescue

Thing is, not all installation can rely on the NVRAM—for example a live-USB.
When plugging in a live-USB the UEFI needs to be able to boot from it even though it has never seen it before.
That's what the fallback bootloader path (`EFI/boot/bootx64.efi`) is for.
The UEFI doesn't just look in it's NVRAM for bootloaders but also checks that path on all attached drives.

So let's do that instead:
```bash
grub-install --removable /dev/sdX
grub-update
```
And after a reboot we're greeted with the GRUB2 shell.
Whoho!
Progress!
The GRUB2 shell is nice, but we need more.
Apparently GRUB2 is missing something so let's again check with the live-USB.
Reboot, chroot and run:
```bash
apt-get install grub-efi-amd64
```
So the installation was interrupted—makes sense I did disconnect the battery.
Let's fix that:
```bash
# from: https://askubuntu.com/questions/425502/how-do-i-continue-configuration-if-apt-get-was-interrupted
apt-get clean
apt-get -f install
dpkg-reconfigure -a
```
Now GRUB2 installs correctly and appears to remember my wish to use `--removable`.
Reboot and we actually boot into the new Debian installation.
We just can't login yet because there's something missing still.

## Finishing the Installation
As we interrupted the Debian installer there's one step left to do, the "Finish the installation" step.
It appears the user is created by this step so skipping it leaves us without a user to login with.
Fix that with:
```bash
useradd my_user
useradd sudo my_user
useradd netdev my_user
```

I also had to [set the network to managed](https://askubuntu.com/questions/71159/network-manager-says-device-not-managed) and remove the live-USB package repository from `/etc/apt/sources.list`.

If I had to do this again, I'd use the expert install mode and simply skip the automated GRUB2 installation step.
That should allow me to run the original "Finish the installation" step before installing GRUB2 manually.

PS: The cheapo laptop was an Acer Aspire es 17 (aspire es1-732).
