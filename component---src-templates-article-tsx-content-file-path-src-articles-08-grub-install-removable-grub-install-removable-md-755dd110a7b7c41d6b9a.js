"use strict";(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[743],{1411:function(e,t,n){n.r(t),n.d(t,{Head:function(){return I},default:function(){return k}});var a=n(1151),l=n(7294);function o(e){const t=Object.assign({p:"p",em:"em",code:"code",pre:"pre",h2:"h2",a:"a",span:"span"},(0,a.ah)(),e.components);return l.createElement(l.Fragment,null,l.createElement(t.p,null,"On my quest of ridding my family from Windows I was faced with a particularly interesting Debian 12 installation.\nWhat's so ",l.createElement(t.em,null,"interesting")," about this one?"),"\n",l.createElement(t.p,null,"Apart from the dog slow HDD the Debian installer chugs along just fine—until...",l.createElement(t.code,null,"grub-install dummy"),".\nIt doesn't fail, it just hangs."),"\n",l.createElement(t.p,null,"Maybe get some cake and check on it afterwards...\nNo, still hanging there.\nBattery-disconnect it is—click."),"\n",l.createElement(t.p,null,"Reboot, hit up the live-USB's shell and see what the hell happened.\nLet's chroot into the broken install:"),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"# from: https://unix.stackexchange.com/questions/541489/grub-fails-to-install-during-debian-10-installer-re-uefi-supermicro-motherboa\nmkdir /target\nmount /dev/sdX2 /target\nmount /dev/sdX1 /target/boot/efi\nmount -o rbind /dev /target/dev \nmount -t proc proc /target/proc \nmount -t sysfs sys /target/sys \nmount -t efivarfs efivarfs /target/sys/firmware/efi/efivars \nchroot /target/ \n")),"\n",l.createElement(t.p,null,"Everything looks fine so let's fix that GRUB2 installation."),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"grub-install --verbose /dev/sdX\n")),"\n",l.createElement(t.p,null,"And...drum roll...it hangs—at trying to ",l.createElement(t.code,null,"modprobe efivars"),".\nHuh, why's that?"),"\n",l.createElement(t.p,null,"Let's try something:"),"\n",l.createElement(t.pre,null,l.createElement(t.code,null,"grub-install --verbose --no-nvram /dev/sdX\n")),"\n",l.createElement(t.p,null,"And...it works—in that it finishes without errors.\nBut now the laptop fails to find the new Debian installation and only let's me boot back into the live-USB."),"\n",l.createElement(t.p,null,"With the ",l.createElement(t.code,null,"--no-nvram")," option we at least get through the GRUB2 installation.\nIt appears the cheapo laptop's UEFI is bugged causing Linux trouble with editing the motherboard's NVRAM.\nCool, why is that bad?"),"\n",l.createElement(t.p,null,l.createElement(t.code,null,"grub-install")," wants to make the UEFI aware of the new bootloader.\nIt does so by storing the bootloader's location in non-volatile RAM of the motherboard.\nThen your shiny-new bootloader appears in the EUFI boot options and you can boot."),"\n",l.createElement(t.p,null,"That doesn't work here, so what now?"),"\n",l.createElement(t.h2,{id:"grub-install---removable-to-the-rescue",style:{position:"relative"}},l.createElement(t.a,{href:"#grub-install---removable-to-the-rescue","aria-label":"grub install   removable to the rescue permalink",className:"anchor before"},l.createElement(t.span,{dangerouslySetInnerHTML:{__html:'<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>'}})),l.createElement(t.code,null,"grub-install --removable")," to the Rescue"),"\n",l.createElement(t.p,null,"Thing is, not all installation can rely on the NVRAM—for example a live-USB.\nWhen plugging in a live-USB the UEFI needs to be able to boot from it even though it has never seen it before.\nThat's what the fallback bootloader path (",l.createElement(t.code,null,"EFI/boot/bootx64.efi"),") is for.\nThe UEFI doesn't just look in it's NVRAM for bootloaders but also checks that path on all attached drives."),"\n",l.createElement(t.p,null,"So let's do that instead:"),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"grub-install --removable /dev/sdX\ngrub-update\n")),"\n",l.createElement(t.p,null,"And after a reboot we're greeted with the GRUB2 shell.\nWhoho!\nProgress!\nThe GRUB2 shell is nice, but we need more.\nApparently GRUB2 is missing something so let's again check with the live-USB.\nReboot, chroot and run:"),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"apt-get install grub-efi-amd64\n")),"\n",l.createElement(t.p,null,"So the installation was interrupted—makes sense I did disconnect the battery.\nLet's fix that:"),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"# from: https://askubuntu.com/questions/425502/how-do-i-continue-configuration-if-apt-get-was-interrupted\napt-get clean\napt-get -f install\ndpkg-reconfigure -a\n")),"\n",l.createElement(t.p,null,"Now GRUB2 installs correctly and appears to remember my wish to use ",l.createElement(t.code,null,"--removable"),".\nReboot and we actually boot into the new Debian installation.\nWe just can't login yet because there's something missing still."),"\n",l.createElement(t.h2,{id:"finishing-the-installation",style:{position:"relative"}},l.createElement(t.a,{href:"#finishing-the-installation","aria-label":"finishing the installation permalink",className:"anchor before"},l.createElement(t.span,{dangerouslySetInnerHTML:{__html:'<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>'}})),"Finishing the Installation"),"\n",l.createElement(t.p,null,'As we interrupted the Debian installer there\'s one step left to do, the "Finish the installation" step.\nIt appears the user is created by this step so skipping it leaves us without a user to login with.\nFix that with:'),"\n",l.createElement(t.pre,null,l.createElement(t.code,{className:"language-bash"},"useradd my_user\nuseradd sudo my_user\nuseradd netdev my_user\n")),"\n",l.createElement(t.p,null,"I also had to ",l.createElement(t.a,{href:"https://askubuntu.com/questions/71159/network-manager-says-device-not-managed"},"set the network to managed")," and remove the live-USB package repository from ",l.createElement(t.code,null,"/etc/apt/sources.list"),"."),"\n",l.createElement(t.p,null,'If I had to do this again, I\'d use the expert install mode and simply skip the automated GRUB2 installation step.\nThat should allow me to run the original "Finish the installation" step before installing GRUB2 manually.'),"\n",l.createElement(t.p,null,"PS: The cheapo laptop was an Acer Aspire es 17 (aspire es1-732)."))}var r=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,a.ah)(),e.components);return t?l.createElement(t,e,l.createElement(o,e)):o(e)},s=n(5708),i=n(3253),c=n(3033),h=n(2101),u=n(4160),d=n(6355),m=n(9623),p=n(2043),g=n(4933),b=n(7481),v=n(9500),f=n(2041),E=n(4001);const w={AutoPlayVideo:d.Z,HalfImage:m.Z,Spacer:p.Z,Quote:g.Z,Iframe:b.Z,CompareView:v.Z,pre:f.Z,Link:u.rU},y=e=>{var t,n,o,r,d,m;let{data:p,children:g}=e;const b=null===(t=p.mdx)||void 0===t||null===(n=t.frontmatter)||void 0===n?void 0:n.version,v=null===(o=p.mdx)||void 0===o||null===(r=o.frontmatter)||void 0===r?void 0:r.title,f=/^0\./.test(b)?"Draft v"+b:void 0,E=null===(d=p.mdx)||void 0===d||null===(m=d.frontmatter)||void 0===m?void 0:m.date;return l.createElement(s.Z,{heading:v,sub_heading:f},l.createElement("div",{className:i.P},l.createElement("span",{className:i.v},"Written by Christopher Besch, published on "),E),l.createElement("div",{className:c.cx},l.createElement(a.Zo,{components:w},g)),l.createElement(u.rU,{className:h.Ge+" "+h.p4,to:"/articles"},"More Articles"))};function k(e){return l.createElement(y,e,l.createElement(r,e))}const I=e=>{var t,n,a,o,r,s;let{data:i}=e;const c=null===(t=i.mdx)||void 0===t||null===(n=t.frontmatter)||void 0===n?void 0:n.title,h=null===(a=i.mdx)||void 0===a||null===(o=a.frontmatter)||void 0===o?void 0:o.description,u=null===(r=i.mdx)||void 0===r||null===(s=r.frontmatter)||void 0===s?void 0:s.banner,d=u&&"undefined"!=u?u:void 0;return l.createElement(E.Z,{heading:c,description:h,banner:d})}}}]);
//# sourceMappingURL=component---src-templates-article-tsx-content-file-path-src-articles-08-grub-install-removable-grub-install-removable-md-755dd110a7b7c41d6b9a.js.map