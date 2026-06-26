---
title: "Netlink: Linux' Network Configuration and Filtering"
description: "
TODO
"
banner: "./stack.webp"
hero: "./hero.jpg"
hero_horizontal_position: 40
hero_vertical_position: 70
slug: linux_networking
date: "2026-06-24"
tags: [linux]
listed: true
---

My first PC was a Windows XP machine; a lovingly red netbook.
One of the first informatics things I did with it was networking.
I wanted to game with friends, after all.
Therefore, I did a lot of tinkering with, well, networking on Windows.
Today I've been administrating and daily driving Linux machines for half my life.
And Linux networking always felt somewhat different to the Windows counterpart:<br />
Windows does the entire networking.
Maybe you install a program doing something fancy like VPN but apart from that, the *operating system* Windows does all of it.
There typically isn't a choice on what vendor's tool to use for a networking job, you just use *the* Windows tool for it.

Now on Linux this is different because while *Windows* refers both to the operating system and its kernel, *Linux* technically does not;
Linux is only a kernel, not an entire operating system.
There are so many userspace programs doing a lot of the heavy lifting.
And here you have options, bundled together by the different distributions.
Even so, I'll be using *Linux* to reference an entire operating system.
Furthermore, I'll be referring to the Linux kernel simply as *kernel* from now on.<br />
This naming situation leads to the following communication phenomenon:
When people say *"On Linux X is done by Y,"* they sometimes refer to the Linux kernel doing *X* through *Y*.
Often times, however, they refer to a general paradigm many Linux distributions do, but not all.<br />
For example, one might say *"On Linux playing Windows games is done through Proton."*
But, of course, the Linux kernel doesn't enforce this at all.
You can play some games through Wine or build an alternative to Proton on Linux.
That would still run on the same Linux kernel.<br />
On Linux what does networking?
More precisely: I always wondered

1. if the kernel implements network protocols itself?
    I.e., does the kernel implement UDP and TCP or does userspace do that?
2. What tools tightly integrate with the kernel and represent Linux' *natural* way of doing networking?
    In other words: what behaviour doesn't differ from one distribution to the next.
3. Do the userspace programs only configure the kernel or do they run in the background, actively parsing traffic.
4. Does the kernel have it's own way of persisting configuration across reboots?
    Alternatively, do userspace programs configure the kernel again every time they start?
5. May the user combine different tools; i.e., use `ip` tool on a system running NetworkManager.

<HalfImage id="fig:cern" num={1} caption="Networking equipment at CERN." full="true" src="./IMG_0978.jpg" />

# The Kernel Networking Stack: a Beast
To answer the first question: 
The Kernel's networking stack is immense.
Once it is configured for the current network environment, almost all userspace applications can perform all their networking needs using the kernel.
The kernel implements Ethernet, WiFi, IP, UDP, TCP, packet filtering, NAT-ing and much, much more.
The Linux kernel is also very capable for use in dedicated networking equipment; it isn't limited to personal computers <Cite id="openwrt" />.
These applications *only* need userspace processes to reconfigure the kernel to address changing network configurations <Cite id="bootlin_networking" />.

May a userspace program *skip* the kernel and implement TCP and other protocols itself?
Yes, with the `CAP_NET_RAW` capability a process may use a `SOCK_RAW` `AF_PACKET` socket.
These permit sending raw Ethernet frames to the network interface controller <Cite id="packet" />.
Based on that one may implement their own network stack and even custom protocols.
[socat](https://www.man7.org/linux/man-pages/man1/socat.1.html) and Python's [scapy](https://scapy.net) is a tool to play around with that, for example.
But, of course, the kernel's network implementation is what most applications use.

One thing the kernel doesn't do itself is resolving domains to IP addresses via DNS.
Instead, there are userspace daemons like systemd-resolved <Cite id="arch_resolved" /> for this job.
Even the kernel itself upcalls into userspace for its own domain resolution needs <Cite id="kernel_dns" />.

Below I've prepared [figure 2](#fig:overview) on Linux' userspace networking stack.
Don't worry, I'll go over the entire diagram in detail.
Do notice that the Linux userspace networking stack is quite well divisible into *configuration* and *filtering*.
Configuration concerns itself with, e.g., setting up links and routes.
Filtering, on the other hand, handles, e.g., firewalling and NAT-ing.
<HalfImage id="fig:overview" num={2} caption="Linux' userspace networking stack. The kernel internals and less relevant dependencies are omitted." full="true" src="./stack.webp" />

# Configuration Tools
Beginning with [figure 2](#fig:overview)'s left half, there is a zoo of network configuration tools.
The iproute2 tools are one of the major players here.
They contain the `ip`, `bridge`, `arp`, `tc` and `ss` terminal programs, among other.<br />
Say, for example, you want to connect two PCs with a single Ethernet cable and connect via SSH from one PC to the other.
In such a setup you typically don't have a DHCP server automatically configuring this network.
That's what a dedicated off-the-shelf router would do, which is why connecting two PCs to a consumer route *just works*.
To fill this gap you could host a DHCP server yourself or use the iproute2 tools.
The iproute2 tools allow you to assign static IPs to both PCs network links and configure IP routes; doing parts manually that DHCP would have done.<br />
Notice the word *static*;
The iproute2 tools don't have a daemon able to react to network changes.
All these tools do is configure the kernel's networking stack for the *current* network situation.
Furthermore, these tools don't have any internal state, they only configure the kernel.
Therefore, any configuration you enter using the iproute2 tools doesn't persist across reboots.
If you want to persist your configuration, you could simply write a shell script running your commands.
Then for example a systemd unit could run your script at boot, setting up your network to your liking <Cite id="arch_network" />.
Baturin's user guide <Cite id="iproute2_user_guide" /> is a highly useful reference for iproute2.<br />
I do recommend playing around with them.
Once I ran `ip route show` (see [figure 3](#fig:docker) I solved a long standing mystery of why docker sometimes required `--net host` for contains to reach the internet.
It turns out that one of the corporate WiFi networks I often work in, has a conflicting subnet with Docker's.
<HalfImage id="fig:docker" num={3} caption="Docker subnet collision: 172.17.0.0/16 overlaps with 172.17.0.0/17." full="true" src="./docker_subnet_collision.png" />

But what about dynamic network changes?
What if you unplug an Ethernet cable and connect to some other network?
Then you'd have to manually run the iproute2 tools again.
Boot scripts cannot help here.<br />
The solution for such dynamic networking environments are network managers like NetworkManager or systemd-networkd.
A network manager runs a userspace daemon in the background dynamically changing the kernel's network configuration to the changing network environment.
Additionally, network managers provide a higher-level features like network profiles <Cite id="arch_network" />.

<HalfImage id="fig:gnome" num={4} caption="GNOME Quick Settings." src="./gnome.png" />
While you configure systemd-networkd through configuration files <Cite id="arch_systemd_networkd" />, NetworkManager exposes a D-Bus API, which libnm connects to <Cite id="libnm" />.
libnm, in turn, is how desktop managers like GNOME show the current network state.
When you expand the GNOME quick settings (see [figure 4](#fig:gnome)) <Cite id="gnome_quick_settings" />, for example, you're interacting with libnm <Cite id="gnome_shell" />.

These desktop managers are very closely intertwined with NetworkManager.
If you want to use some other network manager, like systemd-networkd, you need to mimic NetworkManager's D-Bus API<Cite id="nmlinkd" />.<br />
On the terminal there is `nmcli`, which also uses libnm <Cite id="nmcli_libnm" />.

So taking my example from before, connecting a linux PC to an off-the-shelf router typically automatically establishes a link.
NetworkManager does that using its integrated DHCP client.
The NetworkManager daemon depends on udev to receive a notification on network device discovery <Cite id="networkmanager" />.
Then it dynamically changes the kernel's network configuration according to the new device.
For wireless networks it might use wpa_supplicant for authentication <Cite id="arch_network" />.<br />
udev is another userspace daemon listening for device events from the kernel <Cite id="udev" />.
udev also performs systemd's predictable network interface naming.
This naming is predictable in contrast to the kernel's own naming scheme, (e.g, `eth0`, `eth1`, ...), which may change from one boot to the next <Cite id="predictable_if_naming" />.

Importantly, iproute2 through libnetlink, systemd-networkd through sd-netlink and NetworkManager directly interact with the kernel via Netlink <Cite id="libnetlink" /> <Cite id="network_manager_netlink" /> <Cite id="sd_netlink" />.
Netlink how most network tools communicate with the Kernel <Cite id="netlink" />
The iproute2 tools may even be used in parallel with NetworkManager.
NetworkManager detects what iproute2 did <Cite id="red_hat_ip" />.

As an aside, there is another layer on top of network managers:
netplan parses yaml files and creates NetworkManager or systemd-networkd configuration files <Cite id="netplan" />.<br />
There are other userspace daemons on Linux that do network-related work.
avahi-daemon, for example, implements mDNS and Apple Zeroconf to advertise and find hostnames and services being provided on the network, i.e., printers <Cite id="arch_network" />.<br />
Furthermore, arpd, for example is a userspace daemon with a more complicated ARP implementation than the kernel's.
But arpd only populates the kernels ARP database with IP-MAC pairs, leaving the kernel to use it for sending out frames <Cite id="arpd" />.<br />
As a last example, for dedicated routers running Linux, there is software like FRRouting.
FRRouting implements large-scale routing protocols like OSPF or RIP.
Its daemons populate the kernel's routing tables dynamically.
The kernel simply forgets routes when links go down.
That's where userspace daemons provide dynamic configuration changes.
FRRouting also uses Netlink directly <Cite id="frrouting_kernel_interface" />.

Lastly, before iproute2 there was net-tools, which, among others, provided the now deprecated `brctl`, `ifconfig` and `netstat` terminal applications <Cite id="iproute2_user_guide" />.

# Filtering Tools
The network configuration tools all individually, directly communicate with the kernel via Netlink.
On the filtering side ([figure 2](#fig:overview)'s right side), however, there's more monolithic userspace system: nftables by the netfiler.org project.
The nftables software consists of a kernel component, three libraries (libmnl, libnftnl and libnftables) and the `nft` terminal program.
The kernel component implements a virtual machine, which executes bytecode to perform the per-packet filtering activity <Cite id="nftables" />.
(Be aware that this is a different virtual machine than what eBPF runs on.)<br />
A large part of nftables complexity resides in the libnftnl userspace library.
libnftnl compiles firewall rules into the bytecode and passes it using libmnl through Netlink to the kernel, where it runs.
This explains why there is no alternative to the monolithic nftables userspace system:
The nftables' kernel component is tightly integrated with libnftnl.
Therefore, all methods of interacting with the modern Linux firewall, nftables, better use libnftnl.
There is no comparable library on the network configuration side.<br />
The user may use nftables' terminal application `nft` to configure a static firewall.
This already includes NAT-ing but isn't capable of persisting rules across reboots or reacting to dynamic network changes <Cite id="libnftables" />.

Interestingly, `nft` is only a thin wrapper around libnftables, permitting programmatically configuring the firewall.
firewalld uses libnftables to implement higher-level filtering concepts, like network zones <Cite id="firewalld" />.
firewalld is a daemon, running in the background to react to network changes.
It uses NetworkManager to be notified about network device renamings <Cite id="firewalld_architecture" /> and then applies changes vai libnftables.

UFW is another firewall manager.
Different to firewalld UFW doesn't have a daemon but runs after every boot and when the user decides to.
This makes it unsuitable for changing network environments.
Furthermore, UFW uses the now deprecated iptables, which nftables replaced <Cite id="netfilter" />.
For UFW to still work on modern Linux nftables there is iptables-nft, which uses libnftnl to implement the old iptables (and ip6tables, arptables, ...) terminal interface <Cite id="arch_ufw" />.

Lastly, while one may combine different configuration tools, one shouldn't use, e.g., both nftables together with firewalld <Cite id="redhat_firewalld" />.

# Conclusion
TODO
- Networking is one of the main things distributions, differ.
- The hardware does ...
- The kernel does ...
- Userspace daemons do ...
    A typical theme is that the kernel actively implements the frame-by-frame networking activity.
    However anything larger, like changing routes, bringing network links up or down; those are things userspace applications do.
    And for doing that dynamically these programs need a userspace daemon running all the time.
- Userspace tools do ...
- Desktop managers do ...
{/* Kernel networking is huge, implementing a lot. */}
{/* But the kernel does allow userspace to do things, too. */}
{/* That isn't used much. */}
{/* iproute2, nft are very tightly integrated; NetworkManger and UFW less so. */}
{/* Some have daemons (i.e., NetworkManager) to dynamically configure the kernel based on changes in the network. */}
{/* The kernel networking doesn't persist anything. */}
{/* When you want to manually configure something (e.g., a static IP for a NIC), what do you need to look out for? */}
{/* What programs may reset your custom config? */}
{/* NetworkManager and iproute2 are fine; firewalld and nftables aren't. */}

There is a pattern here:
The kernel implements the live handling of packets, implements the physical, link, network and transport protocols for a static network.
Dynamic changes are done by userspace processes.
And here users have choices on how to administrate their network.

<References bibliography="./linux_networking.bib" />

{/*
## Questions
- The FritzBox allows devices to forward ports on their own.
    How does that work?
    UPnP IGD or PCP
- How to make custom network config permanent
    Write script with iproute2 commands.
- How to ensure network device names are predictable?
    `NET_NAME_ENUM` isn't stable, right?
- What does Linux do with mangled packets?
    Does it, e.g., forward packets with a source IP that couldn't possibly come from the NIC it arrived on?
- How does deep packet inspection work?
    If the kernel does all the filtering, how to inspect HTML?
- How are iproute2 and nftables related?
- What are network zones?
- What is a network link for Linux?

- https://linux.wiki/docs/commands/networking/ip
- https://bootlin.com/doc/training/networking/networking-slides.pdf
- https://www.kernel.org/doc/html/latest/networking/dsa/index.html
- ifup, ifdown:
    Part of ifupdown package.
    Config file: `/etc/network/interfaces`
- https://www.debian.org/doc/manuals/debian-reference/ch05.en.html

Check with `cat /sys/class/net/wlp1s0/name_assign_type`.
Back to networking, take for example setting up a firewall on Linux.
When people talk about nftables being the Linux firewall
There isn't just *the one* Linux firewall;
there are many userspace programs, instead, e.g., firewalld or UFW.
So as I worked more and more with networking on Linux, I always wondered:
- `SOCK_RAW` with `AF_PACKET` allow sending custom Ethernet frames.
- `SOCK_RAW` with `AF_INET` allow sending custom IP datagram.
- `SOCK_DGRAM` with `AF_PACKET` allow sending Ethernet payloads.
- `SOCK_DGRAM` with `AF_INET` allow sending IP payloads.
- AF_xxx address family, PF_xxx protocol family (are equivalent on Linux)
*/}
