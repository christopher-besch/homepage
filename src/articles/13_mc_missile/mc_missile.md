---
type: article
title: "Guided Missiles in Minecraft"
description: "
I'm having a stab at designing an enitity seeking missile in Minecraft with the mc_missile mod.

Or: How I blew up my brother.
"
banner: /social_banner/riscv_rt.png
thumb: ../../../static/social_banner/riscv_rt.png
title_banner: ../../images/photography/alpha_victor.jpg
title_banner_horizontal_position: 20%
title_banner_vertical_position: 80%
slug: mc_missile
date: 2025-05-31T00:00:00+00:00
listed: true
version: 1.0.0
---

Cue [Soothing Minecraft — Relaxing Farm Morning](https://youtu.be/xLo-BrCh7JQ).
I'm tending the fields, watching the river flow.
My brother walks by, saying hi.
What's missing?
$$
\frac{a}{b}
$$

A brother-seeking missile with an explosive warhead enough to crack his cute Netherite armor, of course!
This is my journey of developing such a thing with the [mc_missile](https://github.com/christopher-besch/mc_missile) Minecraft mod.
Follow this article and you too will have a [fire-and-forget](https://en.wikipedia.org/wiki/Fire-and-forget), [top-attack](https://en.wikipedia.org/wiki/Top-attack), [Infrared-homing](https://en.wikipedia.org/wiki/Infrared_homing) missile at your disposal.

# The Starting Point
The server we're playing on runs the [mc_missile](https://github.com/christopher-besch/mc_missile) Minecraft mod.
It allows all players to program guided missiles and fire them from a [crossbow](https://minecraft.wiki/w/Crossbow) or [dispenser](https://minecraft.wiki/w/Dispenser).

Excerpt from the documentation on flight dynamics:

The missile is an entity like all
Like every other entity 

The missile has a position
$$
p = \begin{pmatrix} p_1 \\ p_2 \\ p_3 \end{pmatrix} \in \mathbb{R}^3
$$
(with the height $$p_2$$), velocity
$$
v = \begin{pmatrix} v_1 \\ v_2 \\ v_3 \end{pmatrix} \in \mathbb{R}^3
$$
, pitch
$$
\theta \in [-90, 90]
$$
and yaw
$$
\psi \in [-180, 180]
$$
.
These [angles](https://minecraft.wiki/w/Rotation) are in degrees and there's no roll.

These are updated every tick (20 times a second).
This update is separated into three stages:
1. apply guidance rotation input:
    The guidance code produces a change in rotation that is applied.
    There's a lot of random noise applied here.
    $$
    \theta \rightarrow \theta + \theta_in + R \\
    \psi \rightarrow \psi + \theta_in + R \\
    $$
    $$R$$ is normally distributed noise with a variance that depends on the air frame used by the missile.
2. apply acceleration:
    first the 
    $$
    r = 
    $$
    The velocity is updated based on the current rotation and thrust.
    TODO: formula
3. apply velocity:
    The position is updated based on the velocity.
    TODO: formula
4. apply drag:

After this update the current missile state is sent to the guidance server, which has a little less than 50ms to send the next rotation change for the next tick.

In the first tick, the missile doesn't have guidance input yet and thus flies straight ahead with the velocity and rotation of the shooter.
No variance is applied here.



# Flying a Straight Line

# Compensation for Gravity

# Velocity-Aware

# Some Tweaks

## Top Attack
https://en.wikipedia.org/wiki/Top-attack

## Entity Seeking

## Launch Direction

# Other Ideas

## Proportional Navigation

My brother is actually really cool.
Thanks for testing my missiles!
