---
title: "Automatic Firmware Generation for Spaceflight Hardware based on Schematics"
description: "
The interaction between hardware design and firmware implementation requires strict consistency in embedded systems.
Firmware must exactly match the schematic-level component configuration and connectivity.
In current workflows, this consistency is largely ensured through manual inspection and extensive testing.
In this work, we introduce a schematics-aware approach to automate firmware generation.
We propose the Group Netlist, a design- and PCB tool-agnostic abstraction of hardware.
Using a reference implementation, we demonstrate our proposal for the open-source PCB design suite KiCad.
As added benefit our approach serves for hardware verification purposes that we demonstrate through a fault-injection analysis.
Considering relevant cases, our tool detects 75% of otherwise undetected injected faults and requires negligible overhead (less than 0.2% codebase addition and on average a 4.8% runtime increase).
Lastly, we verify our tooling by successfully using it in the development workflow of an embedded satellite module.
"
banner: "./banner.jpg"
date: "2026-08-19"
slug: "automating_firmware_generation_from_schematics"
pdf: "./kicad_firmware_generation_paper_v17p.pdf"
tags: [dlr, kit, software_dev, hardware, kicad, spaceflight, python, paper]
listed: true
---
