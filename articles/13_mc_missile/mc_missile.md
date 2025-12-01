---
title: "Guided Missiles in Minecraft"
description: "
I'm having a stab at designing an enitity seeking missile in Minecraft with the mc_missile mod.

Or: How I blew up my brother.
"
banner: ./banner.png
hero: ./hero.jpg
hero_horizontal_position: 80
hero_vertical_position: 100
slug: mc_missile
date: "2025-06-06"
listed: true
---

<HalfVideo src="top_stromel_kill.mp4" width={1920} height={1080} />

Cue [Soothing Minecraft — Relaxing Farm Morning](https://youtu.be/xLo-BrCh7JQ).
I'm tending the fields, watching the river flow.
My brother walks by, saying hi.
What's missing?

A brother-seeking missile with an explosive warhead enough to crack his cute Netherite armor, of course!
This is my journey of developing such a thing with the [mc_missile](https://codeberg.org/christopher-besch/mc_missile) Minecraft mod.
Follow this article and you too will have a [fire-and-forget](https://en.wikipedia.org/wiki/Fire-and-forget), [top-attack](https://en.wikipedia.org/wiki/Top-attack), [Infrared-homing](https://en.wikipedia.org/wiki/Infrared_homing) missile at your disposal.

<Spacer />

# The Starting Point
The server we're playing on runs the [mc_missile](https://codeberg.org/christopher-besch/mc_missile) Minecraft mod.
It allows all players to program guided missiles and fire them from a [crossbow](https://minecraft.wiki/w/Crossbow) or [dispenser](https://minecraft.wiki/w/Dispenser).

A missile is built from components, each with a price tag and effects on the missile.
For us only the *rocket motor*, *air frame* and *seeker head* matter.

Like the player (including my brother) the missile is an [entity](https://minecraft.wiki/w/Entity) in Minecraft.
The missile has
