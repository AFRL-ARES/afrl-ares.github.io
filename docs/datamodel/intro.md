---
sidebar_position: 1
title: Introduction
---

# ARES Datamodel Overview

The **ARES Datamodel** is the foundational schema layer that defines how components within ARES communicate, store state, and define experimental workflows. It is built entirely on **Protocol Buffers (v3)**, enabling language-agnostic serialization, high-performance gRPC services, and a robust type system optimized for autonomous science.

By standardizing all scientific entities (such as physical measurements, instrument commands, experimental plans, and data validation rules), the datamodel decouples hardware drivers and scheduling logic from the algorithmic engines that perform machine learning and analysis.

---

## Architectural Philosophy

The ARES Datamodel is designed around several core principles:

1. **Strict Separation of Concerns:**
   - **Templates:** Non-volatile, abstract definitions of workflows (`CampaignTemplate`, `ExperimentTemplate`).
   - **Execution Status/Summaries:** Volatile or historical records of what *is happening* or *has happened* (`CampaignExecutionStatus`, `CampaignExecutionSummary`).
   - **Drivers & Adapters:** Abstract configurations that standardize how ARES communicates with external hardware or software services.

2. **Self-Describing Data System (`AresStruct`):**
   Rather than relying on static compiled messages for every new lab instrument, ARES implements a dynamic, self-describing type system. An `AresStruct` functions as a strongly-typed JSON-like dictionary, complete with schemas (`AresStructSchema`) capable of specifying ranges, choices, descriptions, and physical units.

3. **Closed-Loop Core Abstractions:**
   The datamodel fully formalizes the primary entities of the automated scientific loop:
   - **Devices:** Interfaces that execute automated hardware commands.
   - **Analyzers:** Services that process experimental outputs to generate scalar results.
   - **Planners:** Algorithms that accept historical bounds and choose optimal inputs for subsequent trials.

---

## Datamodel Organization

The documentation is organized into logical chapters mapping to the different segments of the Protocol Buffer definitions:

* **[Core Type System](./types.md):** Dynamic values, quantities with dimensional units, tabular datasets, and schemas.
* **[Templates & Campaigns](./templates.md):** The composition of campaigns, experiments, parallel steps, and parameter sourcing.
* **[Devices & Commands](./devices.md):** Driver configurations, serial connections, command descriptors, and real-time telemetry/polling.
* [Planning & Analysis](./planning-analysis.md): Closed-loop gRPC interfaces, transaction records, and manual planner seeding.
* [Execution & Summaries](./execution.md): Real-time execution status streams, state machines, and historical trial summaries.
* [Visualization](./visualizing.md): Dashboard configurations, plot paths, chart styling, and layout grids.
* [Scripting & LSP support](./scripting.md): The language server datamodel for `AresScript`, covering code completion, hover diagnostics, and symbol trees.
* **[Core gRPC Services](./services.md):** High-level overview of the microservice architecture underpinning ARES.

---

## Source Repository

The primary schema definitions can be found in the official repository:
[ARES Datamodel GitHub Repository](https://github.com/AFRL-ARES/ARES-datamodel)
