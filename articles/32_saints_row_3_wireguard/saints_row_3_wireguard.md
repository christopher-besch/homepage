---
title: "Wireguard for Saints Row: The Third"
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
The game supports local LAN co-op but we live far apart.
Clearly the natural reaction is to try out getting it to work regardless using a VPN.
Spoiler: We didn't get it work but we did learn a lot.

We started with wireguard.

Surprisingly, creating a new LAN game doesn't send out anything.
Instead, scanning for them does.
You can reproduce those messages with:
```
echo "0000ffff0005000c00000000" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
echo "0000ffff0005000900000000" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
# Repeat those two three more times.
```
Do notice that these commands don't work on the same device because SRTT binds port 4200 already.
I run them on a separate device in the same subnet.

These datagrams appear to always be the same regardless of what device or what configuration scans for game lobbies.
- game PC: 192.168.188.30
- dev PC: 192.168.188.49

The response to such a scan is:
TODO: image

It sends the same datagram twice.
It writes out `selchris` with two bytes per character.
That's the username on the game PC.

Multi-send probably because UDP datagrams are not reliable like TCP packets.

```
echo "0000ffff014b000c00000000730065006c006300680072006900730000001ebca8c04594b0000606100102000000000000004594b00006061001000000001ebca8c06810ff00000000000000000000d80203" | xxd -r -p | socat -u - UDP-DATAGRAM:255.255.255.255:4200,broadcast,bind=0.0.0.0:4200
```

Okay so letting the game search for games and then sending that with socat actually makes the game show up a LAN game!
TODO: image

However, the game doesn't appear to send out anything after clicking to connect to the lobby.
And then the game times out because it doesn't hear back from socat.
But I don't know what how respond.
After all the game doesn't send out anything new after connecting.

I tried investigating the entire matchmaking process and installed the game on another PC, a Windows PC.
Unfortunately, the game on Windows fails at sending out UDP datagrams entirely.
There must be a bug or misconfiguration on the Windows side.
So this is where I leave this endeavour.

I've realized that some VPNs operate at the link layer while others at the network layer.
And I've caught the datagrams "Saints Row: The Third" sends when scanning and exposing a multiplayer LAN game.
The actual connection process remains illusive.

### ./saints_row_3_lan_coop_laptop_host.pcapng
- laptop hosts game, IP: 192.168.188.49/24
- desktop finds and joins game, IP: 192.168.188.30/24
- `udp && (ip.dst == 255.255.255.255 || ip.dst == 192.168.188.49 || ip.src == 192.168.188.49)`
- There are only three different UDP broadcasts: the two scan datagrams and one scan response datagram

Apparently the dest ip doesn't have to be a broadcast.
As long as the datagram receives the game IP it works.

```py
#!/usr/bin/env python3

from scapy.all import *
import socket

# Adjust these to your network:
LOCAL_PHYSICAL_IP = "192.168.188.49"
LOCAL_TUNNEL_IP = "10.13.13.2"
REMOTE_TUNNEL_IPS = ["10.13.13.3", "10.13.13.4", "10.13.13.5"]
GAME_SPORT = 4200
GAME_DPORT = 4200

# This is a SOCK_RAW because we want to receive the game's broadcast and send a UDP datagram through the tunnel on the same port.
# Without SOCK_RAW we'd need to bind to that port on both the local network and the tunnel.
# That wouldn't work because the game already binds to them.
# SOCK_RAW requires root (or alternative capabilities).
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
    print(f"Patched  broadcast: {patched_udp_payload.hex()}")

    # Send patched datagram to all remote hosts through the tunnel.
    tunnel_datagram = UDP(dport=GAME_DPORT, sport=GAME_SPORT) / patched_udp_payload
    for remote_tunnel_ip in REMOTE_TUNNEL_IPS:
        sock.sendto(bytes(tunnel_datagram), (remote_tunnel_ip, GAME_SPORT))
```

# The current problem is that apparently the desktop's udp broadcast relay's "fake broadcasts" don't get received by the application on the desktop.
# Meanwhile the laptop's udp broadcast relay does manage to reach the application with its "fake braodcasts".
# A big difference is the destination MAC of the loopback frame: I'ts all zeros on the laptop but all ones on the desktop.
# Other differeneces:
# - UDP checksum
# - source IP
# - IP checksum
# Crucially, the UDP payload is the same.

# Another problem is that sometimes the datagrams don't get through the tunnel.
# The datagrams do end up on the peer1 device but don't get through to peer4.
# When peer4 opens an http connection to peer1, that works and afterwards the UDP datagrams get through, too.
# Maybe this is a firewall?
# This appears not to be an issue when just before 

# When something has bound to 4200 locally the game apparently doesn't send out anything at all.
# That would explain why it didn't work on Selina's Windows laptop.

# After the successful lobby finding the game doesn't address the broadcast's source ip, which we've faked, but the "real" IP.
# That means that the game encodes the game's IP in its datagram.
# Yes, it does, see the png.
# This also means that the game only works when the PCs are connected to a single network.
# Or, when the game guesses the right subnet.
