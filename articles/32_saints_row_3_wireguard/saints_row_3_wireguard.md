---
title: "WireGuard for Saints Row: The Third"
description: "
TODO
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 40
hero_vertical_position: 70
slug: saintrs_row_3_wireguard
date: "2026-06-27"
tags: [gaming, networking]
listed: true
---

A good friend of mine and I wanted to play a game, [Saints Row: The Third](https://www.gog.com/de/game/saints_row_the_third_the_full_package).
The game supports LAN co-op but we live far apart.
And the online co-op doesn't work on the GOG version because it requires Steam servers.
That's not an option for us because we want to play the game DRM-free.<br />
Clearly the natural reaction is to try local LAN co-op on a VPN and I chose WireGuard.
This didn't *just* work;
let me explain why:

# The WireGuard Despair
LAN co-op games typically work in two stages:
1. hosting/joining a lobby (also called matchmaking) and
2. playing the actual game.

During the second part, during the actual gameplay, the hosts exchange the current state of the game, i.e., what player is where, what do they do, ...
The game implements this using UDP unicast datagrams.
This is the typical way UDP is used on the Internet.
Here every datagram has a source IP and a destination IP and reaches only the host with that destination IP.<br />
The first part of the game, hosting and joining a lobby cannot rely on unicasts because each host doesn't know the IP of the other host.
Other games allow directly entering the IP of the PC hosting the lobby.
Saints Row: The Third annoyingly does not.
Instead, it uses UDP broadcasts.
These are UDP datagrams sent not to a single IP but to `255.255.255.255`, the broadcast address.
They are implemented using Ethernet broadcasts, which send the datagram to all hosts on the same subnet.
That bit is crucial: *same subnet*.
This doesn't work on the Internet, because there is more than one subnet on the Internet; it's what makes the Internet the Inter-net.
Flooding the entire Internet with UDP broadcasts would not be handleable so there's no such broadcast concept on the Internet.<br />
Okay, why does this cause a problem with our game?
My friend and I are connected to the same WireGuard VPN.
As it turns out, there are different types of VPN: layer 2 (link-layer) and layer 3 (network-layer) VPNs.
A layer 3 VPN works by tunneling IP datagrams.
Importantly, this doesn't include the Ethernet header:
Layer 3 VPNs have no understanding of Ethernet, which `ip address show` reveals in [figure 1](#fig:peer1).
There is no MAC address associated with the `peer1` link, only an IP address, `10.13.13.2`.
<HalfImage id="fig:peer1" num={1} caption="Investigating a WireGuard connection with <code>ip address show</code>." full={true} src="./peer1.png" />

A layer 2 VPN is different (and also much rarer).
Such a VPN tunnels entire Ethernet frames through the VPN.
(On Linux a layer 2 VPN uses `tap` devices and layer 3 VPNS `tun` devices.)
WireGuard isn't capable of this.
OpenVPN with it's bridge mode, however, is.
Though, a layer 2 VPN like OpenVPN in bridge mode is much more complicated to set up.<br />
So, with WireGuard games with LAN co-op without a *direct IP* option don't work.

# Investigating the Matchmaking Process
OpenVPN bridged mode was too complex for us to setup so instead, I started investigating the matchmaking process using Wireshark.
Surprisingly, hosting lobby doesn't send out anything at all.
Instead, scanning for lobbies does as [figure 2](#fig:udp_scan) shows.
<HalfImage id="fig:udp_scan" num={2} caption="Scanning for game lobbies using UDP broadcasts." full={true} src="./udp_scan.png" />

There are two different broadcasts sent out, each four times.
These broadcasts are the same no mater what device hosts the game.
You can reproduce these broadcasts with socat:
```
echo "0000ffff0005000c00000000" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
echo "0000ffff0005000900000000" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
# Repeat both three more times.
```
Do notice that these commands don't work on the same device because the game already binds to port 4200.
Because of that I run them on a separate device on my LAN.<br />
Fun fact: when some other application already binds to port 4200, Saints Row: The Third's matchmaking simply doesn't work without any errors.
What great software engineering...<br />

Now I can set the game to host a game lobby, send the canned UDP broadcast and see what happens, see [figure 3](#fig:response_to_scan).
<HalfImage id="fig:response_to_scan" num={3} caption="The game's response to the canned UDP broadcast (lobby scan)." full={true} src="./response_to_scan.png" />

As you can see, the ASCII decoding of the datagram reads `s e l c h r i s `, which represents the lobby's hostname, `selchris` but using shorts rather than chars.
Different to the lobby scan datagram, the scan response datagram, therefore, differs from one host to the next.
The game, again, sends out the same datagram multiple times.
Now I can reproduce this datagram as well with socat:
```
echo "0000ffff014b000c00000000730065006c006300680072006900730000001ebca8c04594b0000606100102000000000000004594b00006061001000000001ebca8c06810ff00000000000000000000d80203" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
```

With that I can turn our setup around and let the game search for lobbies.
This sends out the UDP broadcasts and I respond with socat, sending our canned lobby scan response.
And...it works!
The game lists my fake game lobby, see [figure 4](#fig:game_list).
<HalfImage id="fig:game_list" num={4} caption="The lobby scan showing my faked lobby." full={true} src="./selchris_in_game_list.png" />

However, the scanning host doesn't appear to send out anything after clicking to connect to the lobby.
Later I got another PC I could run the game on and setup a proper LAN co-op game and traced it with Wireshark.
It turns out that you simply have to do the scanning-responding cycle multiple times.
Once both hosts know the other sides IP, they switch to UDP unicasts, after all they don't want to annoy anyone else on the network more than necessary.
And using UDP unicasts the rest of the LAN co-op experience is implemented.
<HalfImage id="fig:proper_lan_setup" num={5} caption="Wireshark showing the switch to UDP unicast after the broadcasts during matchmaking." full={true} src="./proper_lan_setup.png" />

# Binding to Ports the `sudo` Way
With this knowledge I set out to implement a UDP broadcast relay.
The idea is simple:
Have another process listen for UDP broadcast datagrams and forward them through the WireGuard tunnel.
I initially thought I had to implement another process on each end that receives the datagram through WireGuard and turns it back into a UDP broadcast.
But as it turns out the game doesn't require the above messages to be broadcasts at all.
As long as the game receives them on the right port, it's fine.<br />
So implemented a single Python script proxying UDP broadcasts into the WireGuard tunnel.
I use the BSD socket interface, which Python exposes through its `socket` package.
It works on Linux, Windows and more.
You'll find my script in the end of the article.

Before that, though, I want to write about another challenge I had to overcome:
with my socat experiments I had two hosts: one running the game and the other injecting the UDP broadcasts.
I want to have both the Python script and the game running on the same host.
I need to
1. receive the UDP broadcasts on port 4200.
    As I've already stated, the game already binds to port 4200 on the LAN IP.
    It needs to send and receive UDP broadcasts after all.
    With the typical socket type `SOCK_DGRAM` I'd also have to bind to port 4200 on the host's LAN IP (in my case `192.168.188.49`).
    Under normal circumstances this is not allowed so I cannot use `SOCK_DGRAM` here.
2. Secondly, I need to send UDP datagrams through the tunnel.
    With `SOCK_DGRAM` I'd have to bind to port 4200 on the IP of the host's side of the tunnel (in my case `10.13.13.2`).
    While this would work during the matchmaking phase, once the actual gameplay starts, the game uses unicast UDP to talk to the other instance across the tunnel.
    And the game uses port 4200 for unicast datagrams.
    Because of that, the games will bind itself to port 4200 on the tunnel IP.
    Having two processes bound to the same port on the same IP address isn't allowed so I can't use `SOCK_DGRAM` here either.
`SOCK_RAW` comes to the rescue.
This socket type combined with the `SOCK_DGRAM` protocol allows receiving any UDP datagrams on all interfaces regardless of their port.
And the best part: you don't have to bind at all.
This power is of course very dangerous as you can sniff on other processes' traffic.
Therefore, you need `CAP_NET_RAW` or root / administrator privileges.
Additionally, a `SOCK_RAW` socket may send and receive on all interfaces and from any IP address.
Hence, I can use the same socket for both receiving broadcasts and proxying their payload into the tunnel.
Also, do notice that I need to send raw IP datagrams.
I cannot use the kernel's IP and UDP implementation but need to use something else.
scapy is a Python library for just that.
I use it to build an IP datagram to my liking before sending it into the tunnel.
Lastly, I send the same packet to all hosts on the other side of the tunnel.
My script simply uses a list of IP addresses.

# Mangling the Payload
With that simple UDP proxy script running on both hosts the game successfully finds the game lobby and attempts to connect.
This is where the UDP unicast datagrams begin.
And I thought the game would use the source IP addresses used in the prior broadcasts to select the destination IP addresses for the unicasts.
That turns out to be wrong!
Checking with Wireshark, the lobby joining host tries to connect to the other host through its LAN IP.
That's the original IP address of the scan response broadcast.
How could the game know that after we've proxied the datagram and, thus, changed the source IP to the tunnel's IP?
A closer look at the scan response broadcast, see [figure 6](#fig:close_scan_return), gives the answer.
<HalfImage id="fig:close_scan_return" num={6} caption="A closer inspection of the scan response. Notice how the highlighted parts repeat." full={true} src="./scan_return_datagram.png" />
The UDP payload contains the LAN IP!
Twice!
In little endian, which reversed from the network byte order (big endian).
That explains why all the bytes are the other way around in the payload compared to the IP header.
That little snitch!<br />
Okay, so `SOCK_RAW` with `sudo` wasn't enough for our game, we also need to mangle the payload's response.
The simplest approach to this is to simply replace the LAN IP with the tunnel's IP everywhere in the payload.

Remember that this is a UDP broadcast, sent on all connected subnets.
The same host has a different IP address for each connected subnet.
Therefore, even in the expected, supported use-case without Wireguard, the IP address in the scan result is only right for one subnet.
All other subnets receive an IP address they probably cannot connect to.
And this isn't such a rare situation:
Every time you provide a hotspot with your device, you have two IP address because you connect to two subnets:
The one towards the Internet and the one towards all devices hanging on your hotspot.
In such a situation you just need to hope that the game picks the right IP address.
What great software engineering...

# The Script you've been Waiting for
1. Copy this script into `udp_broadcast_relay.py`.
2. Adjust the IP addresses.
3. Run `chmod +x udp_broadcast_relay.py`.
4. Run `sudo ./udp_broadcast_relay.py`.
5. Open the game and host/join a LAN lobby.
6. Enjoy!

```py
#!/usr/bin/env python3

from scapy.all import *
import socket

# TODO: Adjust these to your network:
# This might not work if you're connected to multiple subnets.
LOCAL_PHYSICAL_IP = "192.168.188.49"
LOCAL_TUNNEL_IP = "10.13.13.2"
REMOTE_TUNNEL_IPS = ["10.13.13.3", "10.13.13.4", "10.13.13.5"]
GAME_SPORT = 4200
GAME_DPORT = 4200

# SOCK_RAW requires CAP_NET_RAW or root.
sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_UDP)

while True:
    # Receive original datagram.
    data, addr = sock.recvfrom(65535)
    packet = IP(data)
    if  packet.src != LOCAL_PHYSICAL_IP or \
        packet.dst != "255.255.255.255" or \
        packet[UDP].sport != GAME_SPORT or \
        packet[UDP].dport != GAME_DPORT:
        continue

    udp_payload = bytes(packet[UDP].payload)
    print(f"Received broadcast: {udp_payload.hex()}")

    # Replace the local IP with the tunnel IP inside the payload.
    local_physical_ip_reversed_network_byte_order = socket.inet_aton(LOCAL_PHYSICAL_IP)[::-1]
    local_tunnel_ip_reversed_network_byte_order = socket.inet_aton(LOCAL_TUNNEL_IP)[::-1]
    patched_udp_payload = udp_payload.replace(
        local_physical_ip_reversed_network_byte_order,
        local_tunnel_ip_reversed_network_byte_order
    )
    print(f" Patched broadcast: {patched_udp_payload.hex()}")

    # Send patched datagram to all remote hosts through the tunnel.
    tunnel_datagram = UDP(dport=GAME_DPORT, sport=GAME_SPORT) / patched_udp_payload
    for remote_tunnel_ip in REMOTE_TUNNEL_IPS:
        sock.sendto(bytes(tunnel_datagram), (remote_tunnel_ip, GAME_SPORT))
```

{/*
I tried investigating the entire matchmaking process and installed the game on another PC, a Windows PC.
Unfortunately, the game on Windows fails at sending out UDP datagrams entirely.
There must be a bug or misconfiguration on the Windows side.
So this is where I leave this endeavour.

### ./saints_row_3_lan_coop_laptop_host.pcapng
- laptop hosts game, IP: 192.168.188.49/24
- desktop finds and joins game, IP: 192.168.188.30/24
- `udp && (ip.dst == 255.255.255.255 || ip.dst == 192.168.188.49 || ip.src == 192.168.188.49)`
- There are only three different UDP broadcasts: the two scan datagrams and one scan response datagram

TODO
The current problem is that apparently the desktop's udp broadcast relay's "fake broadcasts" don't get received by the application on the desktop.
Meanwhile the laptop's udp broadcast relay does manage to reach the application with its "fake braodcasts".
A big difference is the destination MAC of the loopback frame: I'ts all zeros on the laptop but all ones on the desktop.
Other differeneces:
- UDP checksum
- source IP
- IP checksum
Crucially, the UDP payload is the same.

Another problem is that sometimes the datagrams don't get through the tunnel.
The datagrams do end up on the peer1 device but don't get through to peer4.
When peer4 opens an http connection to peer1, that works and afterwards the UDP datagrams get through, too.
Maybe this is a firewall?
This appears not to be an issue when just before 

When something has bound to 4200 locally the game apparently doesn't send out anything at all.
That would explain why it didn't work on Selina's Windows laptop.
*/}
