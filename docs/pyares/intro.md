---
sidebar_position: 1
title: Welcome to PyAres
---

# Welcome to PyAres 
**PyAres** is the official Python library for **ARES OS**, designed to bridge the gap between labratory automation and accessible scientific research.

PyAres enables developers and researchers to create **Planners**, **Analyzers**, and **Devices** using Python, fully integrating them into the ARES ecosystem without requiring knowledge of C# or modifications to the ARES Core.

# Project Philosophy
The core philosophy behind PyAres is accessibility. While the ARES Core is built on high-performance C#, we recognize that Python is the language of choice for the wider scientific community.

PyAres decouples the engineering complexity from the scientific logic. It allows researchers to leverage the vast ecosystem of Python scientific libraries (NumPy, PyTorch, OpenCV, etc.) to drive experiments, while ARES handles the heavy lifting of orchestration and system stability.

# Architecture
PyAres functions as a microservice framework. Communications between your Python scripts and the ARES core are handled via **gRPC** and **Protobuf**.

*  **Language Agnostic:** Because of this architecture, ARES treats PyAres components like any other ARES component. A Python-based device is indistinguishable from the native C# device to ARES OS.
* **Distributed Capable:** PyAres services do not need to run on the same machine as the ARES core. You can host computationally heavy services (e.g. machine vision models) on a dedicated GPU machine wile ARES runs on the main control PC.

# Core Components
✨ You can build three types of services/extensions/components using PyAres:

**1. Planners** <br></br>
Planners define the decision-making logic for "Self-Driving" loops.
* **Input:** Current experiment parameters, constraints and past experiment data including analysis results.
* **Output:** The next set of experimental conditions.
* **Use Case:** Iterative optimization, Bayesian optimization, or simple step-wise logic.

**2. Analyzers** <br></br>
Analyzers process raw data to return structured results.
* **Input:** Raw data (images, sensor logs, data streams).
* **Output:** A success/failure state, a score, and potentially calculated metrics.
* **Use Case:** Analyzer a photo of a 3D print to detect failures or calculating growth rates from sensor data.

**3. Devices** <br></br>
Devices provide the interface between ARES and physical hardware.
* **Input:** Commands from ARES(e.g. `set_temperature`, `set_flowrate`)
* **Output:** State data and command confirmations
* **Use Case:** Integrating a custom sensor, a serial device, or a specialized camera using Python drivers.

# Integration Workflow
PyAres uses a manual registration model for services to ensure reliability in complex network environments. Below we'll describe the process for a "Device" service. But the proicess is very similar for the other services listed [core services](#Core-Components)
1. **Launch Service** Start your PyAres script (e.g., `python my_device.py`). It will listen on a specific address (e.g. `http://localhost:7800`).
2. **Register in ARES**
    * Navigate to the **Settings** menu in ARES OS.
    * In the Device tab, select "Remote".
    * Press the small "plus" button on the right side of your screen.
    * Input the name and Address (IP and Port) of your running Python service.
3. **Persistence**: ARES saves this configuration to its database. On subsequent startups, ARES will automatically attempt to reconnect to the registered address and handshake with your Python service to retrieve its capabilities.

Once registered, you can now connect and control new hardware, making your implementations ARES ready as a PyAres Device.

# Getting Started
To install the library, see [installation](./install.md)

Check the sidebar for detailed guides on build your first Planner, Analyzer or Device.
