---
sidebar_position: 1
title: Introduction
---

# Welcome to ARES OS 2.0

**ARES OS (Autonomous Research System)** is a cross-platform operating system designed to automate the scientific method. It serves as the center piece for self-driving laboratories, closing the loop between **Execution** (Robots/Hardware), **Analysis** (Sensors/AI), and **Planning** (Decision Algorithms).

## Why ARES?

Traditional lab automation is often rigid, scripted specifically for one machine or one experiment. ARES is designed to be:

- **Modular:** Swap out a planner or a device without rewriting your entire experiment.
- **Cross-Platform:** Runs natively on Windows, Linux, and macOS.
 -- **C#** Native: Core components run in high-performance.
 -- **Python Friendly:** you can integrate hardware and logic using **Python** (via PyAres).

## Core Concepts

ARES organizes your research into three main component types:

1. **Devices:** Physical hardware interfaces (Lasers, Pumps, Furnaces) or virtual simulators.
2. **Analyzers:** Software that processes data (Images, Logs) to determine the result of an experiment.
3. **Planners:** Algorithms that look at previous results and decide the parameters for the next experiment.

These types can be added, removed and edited easily via dedicated settings menus within the ARES software.  
These components come together in a **Campaign**, a defined workflow that runs autonomously until your research goals are met.  

If you're interested in our 3-D printer software. Please visit the [Educational ARES Repo](https://github.com/AFRL-ARES/Educational-ARES).

## Core Design

- **Unified Dashboard**: A single web interface for defining campaigns, monitoring execution progress and more.
- **Direct Device Control**: Users can directly control and monitor the status of all added devices from the ARES Dashboard.

## Getting Started

### For Researchers

1. Head over to the [the install guide](./install.md) to get your ARES system up and running.
2. Checkout the [quick start guide](./quickstart.md) to learn how to run your own experiments.

### For Developers

See the [Developer Guide](./developer-setup.md) to get setup as a developer and start making contributions.

## Quick Links

[Download the ARES Launcher](https://github.com/AFRL-ARES/ARES-Launcher) <br></br>
[The Official ARES Python Library](https://github.com/AFRL-ARES/PyAres) <br></br>
[The ARES Datamodel](https://github.com/AFRL-ARES/ARES-datamodel) <br></br>
[Educational ARES Repo](https://github.com/AFRL-ARES/Educational-ARES) <br></br>
[Report a Bug](https://github.com/AFRL-ARES/ARES/issues)
