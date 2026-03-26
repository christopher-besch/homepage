---
title: "Automatic Firmware Generation for Spaceflight Hardware based on Schematics"
description: "
Any satellite's Power Conditioning and Distribution Unit (PCDU) fulfills the same purpose, providing the subsystems with electrical power.
However, because each satellite has a unique set of subsystems, differing PCDUs must realize differing power distributions.
How do you efficiently develop firmware for such similar hardware?

One approach is to group components and their PCB layout into a snippet, e.g., an Analog to Digital Converter (ADC) with supportive components.
Each PCDU can reuse the same snippets arranged differently to create different power distributions.
While this drastically speeds up the hardware design process, previous works failed at translating this speedup to the firmware development process.

We propose the Group Netlist, a novel representation of the logical functions of hardware.
This machine-readable file format enables automatic firmware generation while remaining agnostic to both programming-language and schematics editor.
The electrical engineer annotates the schematics to produce not just the PCB layout but also the Group Netlist.

Contrary to initial expectations, we show that the Group Netlist has uses beyond firmware generation.
This includes but is not limited to harness specification and snippet based design analysis.
We provide the reference implementation kicad_firmware_generation as a ready-to-use product for different projects even outside space-exploration.
"
banner: "./banner.png"
date: "2026-02-16"
slug: "kicad_firmware_generation"
pdf: "./kicad_firmware_generation_v24.pdf"
tags: [dlr, kit, software_dev, hardware, kicad, spaceflight, python]
listed: true
---
