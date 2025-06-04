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
(with the elevation $$p_2$$), velocity
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

Minecraft updates this states every tick (20 times a second).
Such an update for the tick $t \in \mathbb{N}_0$ is separated into three stages:
1.  Receive the control input:
    The missile's only input method is an unrealisticly beefy [control moment gyroscope](https://en.wikipedia.org/wiki/Control_moment_gyroscope).
    So the player's guidance code produces a requested change in pitch $\theta_{in}$ and yaw $\psi_{in}$.
    It has no direct control over the missiles position, velocity, or thrust — only the rotation.

2.  Update the missile's state:
    The gyroscope is powerful but not overly powerful.
    When the control input is too large (larger than $M_r$ defined by the airframe), it is scaled down linearly:
    $$
    \begin{aligned}
    l & = \sqrt{\theta_{in}^2 + \psi_{in}^2} \\
    \begin{pmatrix} \theta_{in} \\ \psi_{in} \end{pmatrix} &\rightarrow 
    \max{\left\{\frac{M_r}{l}, 1\right\}} \begin{pmatrix} \theta_{in} \\ \psi_{in} \end{pmatrix}.
    \end{aligned}
    $$
    With this, Minecraft applies the adjusted control input plus some random noise.
    $$
    \begin{aligned}
    \theta &\rightarrow \theta + \theta_{in} + N_r \\
    \psi &\rightarrow \psi + \psi_{in} + N_r \\
    \end{aligned}
    $$
    $$N_r$$ is normally distributed noise dependent on the air frame used by the missile.

    Now the acceleration $a \in \mathbb{R}^3$ can be calculated from the rotation vector $r \in \mathbb{R}^3$ and the current thrust $T(t) \in \mathbb{R}$.
    $$
    \begin{aligned}
    r & =
    \begin{pmatrix}
        \sin(-\psi) \cos(\theta) \\
        -\sin(\theta) \\
        \cos(-\psi) \cos(\theta)
    \end{pmatrix} \\
    a & = \left(T(t) + N_T \right) \cdot r
    \end{aligned}
    $$
    $$N_T$$ is normally distributed noise and like the thrust function $T$ defined by the rocket motor.

    Lastly, the velocity and position are updated with the airframe defined drag $d$.
    $$
    \begin{aligned}
    v &\rightarrow (1 - d) \cdot (v + a) \\
    p &\rightarrow p + v
    \end{aligned}
    $$

3.  Send the missile's state to the player's guidance code.
    All these values contain some variance, too — depending on the missile's [inertial measurement unit](https://en.wikipedia.org/wiki/Inertial_measurement_unit).
    The guidance server has a little less than 50ms to send the next rotation change for the next tick.

In the first tick, the missile doesn't have guidance input yet and thus flies straight ahead with the velocity and rotation of the shooter.
No variance is applied here.

So what happens when we write the simplest guidance code we can think of: doing nothing.
We all like oxidized weapons so let's use Rust for this:
```rust
let mut control_input = ControlInput {
    pitch_turn: 0.0,
    yaw_turn: 0.0,
    // --snip--
};
```

TODO:

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
