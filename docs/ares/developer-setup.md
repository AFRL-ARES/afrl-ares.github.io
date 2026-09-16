---
sidebar_position: 13
title: Developer Guide
---

# Developer Guide

<!-- If you want to extend ARES with new hardware support or custom algorithms
* Learn the ARES Architecture
* Build a native C# Plugin
* Understand the gRPC Data Model -->

## The ARES Ecosystem

ARES is highly modular. Before contributing, it is helpful to know which part of the ecosystem you are working with:

* **[ARES OS](https://github.com/AFRL-ARES/ARES):** The core orchestration engine. Written in C#/.NET with a Blazor frontend, it handles the registration of devices, planners, and analyzers as well as workflow execution.
* **[ARES Launcher](https://github.com/AFRL-ARES/ARES-Launcher):** The desktop management hub that simplifies installation, version management, and database management.
* **[PyAres](https://github.com/AFRL-ARES/PyAres):** Our official Python library, designed to make scientific integration as seamless as possible for researchers.
* **[Educational ARES](https://github.com/AFRL-ARES/Educational-ARES):** A specialized, low-cost version of ARES for educational environments, built around autonomous 3D printing (e.g., Prusa MK4S).
* **[ARES-Datamodel](https://github.com/AFRL-ARES/ARES-datamodel):** The source of truth for communication. It contains the Protobuf and gRPC definitions that power our language-agnostic plugin architecture.

## Development Philosophy

ARES is built with a **"Plugin-First"** philosophy. 

* **Keep it Modular:** New hardware integrations, planners, or analysis tools should be developed as plugins rather than tightly coupled into ARES OS.
* **gRPC & Protobuf:** We leverage gRPC for high-performance, scalable communication. If your contribution requires changes to how plugins communicate with the core OS, those changes *must* start in the `ARES-datamodel` repository. 
* **Language-Agnostic Design:** Remember that ARES connects C#/.NET environments with Python data science stacks. Maintain clean, standardized API contracts.

## Architecture

* **ARES UI (Web Client)**: The user interface for defining campaigns, monitoring progress, and interacting with devices via a standard web browser.
* **ARES Service (Back-End)**: The core component that hosts business logic, manages the component lifecycle of devices, planners, and analyzers, and executes campaign orchestration.

### Remote Services and Demo Projects

ARES’s plugin-first design encourages running devices, planners, and analyzers as **remote services**:

* Devices can be exposed via remote adapters (for example, demo projects such as `DemoRemoteDevice` in the ARES OS repository).
* Planners and analyzers are commonly implemented as Python services using PyAres and connected to ARES OS via URLs (see `DemoRemotePlanner` and `DemoRemoteAnalyzer` projects).
* The `plugins` folder in the ARES OS solution is used to host plugin-related assets and integrations.

These remote services allow you to extend ARES without modifying the core orchestration engine, keeping integrations modular and language-agnostic.

## Prerequisites/Dependencies

* **For ARES OS & Plugins:** .NET 10 SDK and an IDE like Visual Studio, JetBrains Rider, or VS Code.
* **For PyAres:** Python 3.10+ and your preferred Python environment manager.
* **For Datamodel Changes:** Ensure you have the Protocol Buffer Compiler (`protoc`) installed if you are generating custom gRPC classes manually.
* **Git:** For version control.
 
## Setup to develop for ARES OS and PyAres

This is most likely the case for a developer making changes to the main ARES OS and keeping its Python support up to date via PyAres.  
This section will set up your development environment so you can build, test, and contribute.

1. First and foremost, see the [Contribution Guide](./contributing.md) for processes and development style.
2. Create and set up your Python virtual environment for ARES work: `python -m venv <virtual environment directory name>`  (for example, `python -m venv .venv`).
   * Activate your Python virtual environment by running the appropriate activate script based on your terminal. Using the `.venv` example in a command prompt, you would call `.venv\Scripts\activate.bat`.
3. Follow [ARES OS Installation for developers](./install.md#method-2-manual-build-for-developers) to set up the main ARES software.
4. Follow [PyAres Installation for developers](../pyares/install.md) to set up PyAres development.
5. Follow [Datamodel Installation for developers](../datamodel/install.md#method-2-manual-for-developers) to work with the ARES datamodel.

## Common Development Tasks

Here are some common development tasks and where to start for each:

| Task | Where to Work | Related Docs |
| :--- | :--- | :--- |
| Change core orchestration behavior in ARES OS | `Ares.Core`, `AresService`, `UI` projects in the ARES OS solution | This Developer Guide, [Building a Campaign](./campaign-construction.md), [Executing a Campaign](./execution.md) |
| Add a new Python analyzer or planner | PyAres repository and corresponding remote service (e.g., demo projects) | [PyAres docs](../pyares/intro.md), [Adding an Analyzer](./add-analyzer.md), [Adding a Planner](./add-planner.md) |
| Extend the gRPC and datamodel layer | `ARES-datamodel` repository | [Datamodel Installation for developers](../datamodel/install.md#method-2-manual-for-developers) |
| Build or update remote device integrations | Demo remote device projects and adapters in the ARES OS repository | [Developer Guide](./developer-setup.md), device-specific docs |
| Create or refine script-backed behavior (custom commands, campaign scripts) | Script bodies in the ARES OS UI and related projects | [Custom Commands](./custom-commands.md), [ARES Scripting](./scripting.md) |
