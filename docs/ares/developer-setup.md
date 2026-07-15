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

## Prerequisites/Dependencies

* **For ARES OS & Plugins:** .NET 10 SDK and an IDE like Visual Studio, JetBrains Rider, or VS Code.
* **For PyAres:** Python 3.10+ and your preferred Python environment manager.
* **For Datamodel Changes:** Ensure you have the Protocol Buffer Compiler (`protoc`) installed if you are generating custom gRPC classes manually.
* **Git:** For version control.
 
## Setup to develop for ARES OS and PyAres

This is most likely the case of a developer, making changes to the main ARES OS and making sure its supported through PyAres to keep the python support up to date.  
This section will set up your dev environment to be able to develop and contribute if needed.

1. First and formost, see the [Contribution Guide](./contributing.md) for processes and dev style.
2. Create and setup your python virtual environment for ares work. `python -m venv <virtual environment directory name>`  ex. `python -m venv .venv`
    b. activate your python virtual environement by running the activate script based on what terminal you're in, using the same example in a command prompt. you'd call `.venv\Scripts\activate.bat`
3. Follow [ARES OS Installation for developers](./install.md#method-2-manual-build-for-developers) to setup main ares software.
4. Follow [PyAres Installation for developers](../pyares/install.md) to setup PyAres development
5. Follow [datamodel Installation for develioers](../datamodel/install.md#method-2-manual-for-developers)
