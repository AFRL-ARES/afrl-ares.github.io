---
sidebar_position: 1
title: Introduction
---

# Welcome to ARES OS 2.0
**ARES OS (Autonomous Research System)** is a cross-platform operating system designed to automate the scientific method. It serves as the center piece for self-driving laboratories, closing the loop between **Execution** (Robots/Hardware), **Analysis** (Sensors/AI), and **Planning** (Decision Algorithms).

## Why ARES?
Traditional lab automation is often rigid, scripted specifically for one machine or one experiment. ARES is designed to be:
* **Modular:** Swap out a planner or a device without rewriting your entire experiment.
* **Cross-Platform:** Runs natively on Windows, Linux, and macOS.
* **Python Friendly:** Core components run in high-performance **C#**, but you can integrate hardware and logic using **Python** (via PyAres).

## Core Concepts
ARES organizes your research into three main component types:
1. **Devices:** Physical hardware interfaces (Lasers, Pumps, Furnaces) or virtual simulators.
2. **Analyzers:** Software that processes data (Images, Logs) to determine the result of an experiment.
3. **Planners:** Algorithms that look at previous results and decide the parameters for the next experiment.

These components come together in a **Campaign**, a defined workflow that runs autonomously until your research goals are met.

## Getting Started 

### For Researchers
1. Head over to the [the install guide](./install.md) to get your ARES system up and running.
2. Checkout the [quick start guide](./quickstart.md) to learn how to run your own experiments.

### For Developers
Coming Soon!
<!-- If you want to extend ARES with new hardware support or custom algorithms, check out the developer guide.
* Learn the ARES Architecture
* Build a native C# Plugin
* Understand the gRPC Data Model -->

## Quick Links
[Download the ARES Launcher](https://github.com/AFRL-ARES/ARES-Launcher) <br></br>
[The Official ARES Python Library](https://github.com/AFRL-ARES/PyAres) <br></br>
[The ARES Datamodel](https://github.com/AFRL-ARES/ARES-datamodel) <br></br>
[Report a Bug](https://github.com/AFRL-ARES/ARES/issues)
