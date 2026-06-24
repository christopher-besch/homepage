---
title: "Netlink: Linux' Network Configuration and Filtering"
description: "
"
banner: "./banner.png"
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
Take for example setting up a firewall on Linux.
There isn't just *the one* Linux firewall;
there are many userspace programs instead, e.g. firewalld or UFW.
So as I worked more and more with networking on Linux, I always wondered:

1. Is networking implemented in the kernel?
    E.g., does the kernel implement TCP and HTTP?
    Or does userspace do that?
    {/* Kernel networking is huge, implementing a lot. */}
    {/* But the kernel does allow userspace to do things, too. */}
    {/* That isn't used much. */}
2. What tools tightly integrate with the kernel and represent Linux' *natural* way of doing networking?
    In other words: what behaviour doesn't differ from one distribution to the next.
    {/* iproute2, nft are very tightly integrated; NetworkManger and UFW less so. */}
3. Do the userspace programs only configure the kernel or do they run in the background, actively parsing traffic.
    {/* Some have daemons (i.e., NetworkManager) to dynamically configure the kernel based on changes in the network. */}
4. Does the kernel have it's own way of persisting configuration across reboots?
    Alternatively, do userspace programs configure the kernel again every time they start?
    {/* The kernel networking doesn't persist anything. */}
5. May the user combine different tools; i.e., use `ip` tool with a system running NetworkManager.
    {/* When you want to manually configure something (e.g., a static IP for a NIC), what do you need to look out for? */}
    {/* What programs may reset your custom config? */}
    {/* NetworkManager and iproute2 are fine; firewalld and nftables aren't. */}

This article will answer all those questions for modern Linux (as of v6.12).

# The Kernel Networking Stack: a Beast
TODO
- kernel networking stack with AF_PACKET, ...
    Linux is very capable of being used as for networking equipment, like routers or switches.
    Your home PC running Linux could replace your off-the-shelf router.

The kernel is the main place for networking implementations to be found.
IP, TCP and UDP, for example, are part of the kernel.
But you could also open an Ethernet socket and implement IP, TCP and UDP in userspace.
Python's [scapy](https://scapy.net) is a tool to play around with that.
The kernel what most applications use for this.

- `SOCK_RAW` with `AF_PACKET` allow sending custom Ethernet frames.
- `SOCK_RAW` with `AF_INET` allow sending custom IP datagram.
- `SOCK_DGRAM` with `AF_PACKET` allow sending Ethernet payloads.
- `SOCK_DGRAM` with `AF_INET` allow sending IP payloads.

These require `CAP_NET_RAW`.

### https://bootlin.com/doc/training/networking/networking-slides.pdf
- AF_xxx address family, PF_xxx protocol family (are equivalent on Linux)

```
/* interface name assignment types (sysfs name_assign_type attribute) */
#define NET_NAME_UNKNOWN	0	/* unknown origin (not exposed to userspace) */
#define NET_NAME_ENUM		1	/* enumerated by kernel */
#define NET_NAME_PREDICTABLE	2	/* predictably named by the kernel */
#define NET_NAME_USER		3	/* provided by user-space */
#define NET_NAME_RENAMED	4	/* renamed by user-space */
```
Check with `cat /sys/class/net/wlp1s0/name_assign_type`.

When people say *"On Linux X is done by Y"*, they sometimes refer to the Linux kernel doing *X* through *Y*.
Often times, however, they refer to a general paradigm many Linux distributions do, but not all.
For example, *"On Linux playing Windows games is done through Proton"* is a common statement.
But, of course, the Linux kernel doesn't enforce this at all.
You can play some games through Wine or build an alternative to Proton on Linux.

# Netlink
TODO
explain configuring vs filtering; show diagram
https://www.rfc-editor.org/info/rfc3549/
- netfilter.org project (alternatives: eBPF, P4, TC)

# Configuration Tools
TODO
- ip: part of iproute2
    iproute2 uses netlink API
    https://wiki.archlinux.org/title/Network_configuration
    ip commands are not persistent.
    One must use scripts or systemd units to call ip on boot.

    used for setup routing on my own, without "router" in between
- bridge: part of iproute2
- tc: part of iproute2
    Takes care of traffic scheduling
- dcb: part of iproute2
- ifconfig (replaced by ip) part of net-tools
- arp: manipulate the kernel's IPv4 network neighbour cache.
    Thin wrapper around kernel; no daemon; neighbour cache
    Could also do `cat /proc/net/arp`.
    There also is arpd.
    ARP is implemented in a kernel module.
- arpd: A userspace daemon doing more advances ARP actions and feeds the ARP database (IP-MAC pairs) to the kernel for usage.
- netstat (replaced by ss)
- ss: investiage network ports
- avahi-daemon: daemon implementing mDNS, Apple Zeroconf, ...
    It find services being provided on the network, i.e., printers.
    https://wiki.archlinux.org/title/Network_configuration#Local_network_hostname_resolution
    It takes your hostname and enables devices on the LAN to find you.
    The alternative would be to setup a DNS server and make it the default for the LAN via DHCP.

    `avahi-daemon` takes the machine's hostname and exposes it to other machines on the LAN <Cite id="arch_network" />.
- wpa_supplicant
- NetworkManager: has integrated DHCP client
    Also, somehow manages wifi.
    https://networkmanager.dev/docs/libnm/latest/
    https://networkmanager.dev/docs/libnm/latest/ref-overview.html
    Provides `libnm`.
    https://github.com/SubZ69/nmlinkd
    GNOME and other desktop managers talk to NetworkManager D-Bus (or `libnm`, I guess)
    https://kernel-internals.org/net/netlink/
    uses netlink to configure kernel
    https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/networking_guide/sec-configuring_ip_networking_with_ip_commands
    iproute2 may be used in parallel with NetworkManager.
    NetworkManager detects what iproute2 did.
- systemd-networkd: has integrated DHCP client
- systemd-resolved
- dhclient: DHCP client, not really maintained
- dhcpcd: DHCP client, more lightweight
- nmcli
- udev: userspace daemon (systemd-udevd)
    notified by kernel
    performs action, e.g., mount device, notifies NetworkManager-daemon for NIC
- ethtool: can be compiled with ioctl or netlink support
    used for hardware timestamping
- devlink
- brctl (replaced by bridge) part of net-tools
- udhcp
- netstat
- ifup, ifdown:
    Part of ifupdown package.
    Config file: `/etc/network/interfaces`
- netplan: network config for cloud systems
    Creates config for systemd-networkd or NetworkManager.
- FRRouting implements OSPF, RIP and other routing protocols; populates the kernels routing table
    The kernel forget routes when links go down.
    NetworkManager reinstates them they come back up.
    That's something FRRouting does specifically.
    https://docs.frrouting.org/en/latest/kernel.html
    ioctl, sysctl, proc filesystem, netlink

- KIT subnet 127.17.0.0/17
- docker subnet 127.17.0.0/16
- work around: `--net host`

# Filtering Tools
TODO
- nftables: load rules into the kernel for filtering and forwarding packets
    nftables uses netlink API
    Command is `nft`.
    Has backwards compatibility layer for iptables, ip6tables, arptables, ...
    `libmnl` and `libnftnl` are userspace libraries for nftables.
    `nft` uses these libraries.

    https://wiki.nftables.org/wiki-nftables/index.php/Portal:DeveloperDocs/nftables_internals#libnftables
    `nft` is just a thin wrapper around `libnftables`.

    https://netfilter.org/projects/nftables/index.html
    https://wiki.nftables.org/wiki-nftables/index.php/Ruleset_debug/VM_code_analysis
    `nft` compiles rules to VM bytecode and pushes that bytecode to the kernel via Netlink.
    The kernel then somehow runs that bytecode and uses it to filer, somewhow.
    Is this eBPF?
- iptables (replaced by nftables)
- ip6tables (replaced by nftables)
- arptables (replaced by nftables)
- firewalld, firewall-cmd:
    provides D-Bus
    https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/configuring_firewalls_and_packet_filters/getting-started-with-nftables
    Recommended to not use together with nftables.
    https://firewalld.org/documentation/architecture.html
    Uses NetworkManager to be notified about network device renamings.

    It is recommended to not use systemd-firewalld together with nftables <Cite id="redhat_firewalld" />.
    systemd-firewalld implements higher-level filtering concepts, like network zones.
    It's implemented as a daemon, for example, because it allows configuring NAT for dynamically connected network links.
- ufw:
    https://wiki.archlinux.org/title/Uncomplicated_Firewall
    calls iptables or nftables

# Deprecated Tools

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

- https://www.debian.org/doc/manuals/debian-reference/ch05.en.html
- https://linux.wiki/docs/commands/networking/ip
- https://bootlin.com/doc/training/networking/networking-slides.pdf
- https://www.kernel.org/doc/html/latest/networking/dsa/index.html
- https://baturin.org/docs/iproute2/
*/}
