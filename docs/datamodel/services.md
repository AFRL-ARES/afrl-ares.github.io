---
sidebar_position: 8
title: Core gRPC Services
---

# Core gRPC Services

The ARES architecture is decoupled into a set of specialized microservices that interact via high-performance **gRPC (HTTP/2)** interfaces. These services manage automation workflows, connect to physical equipment, handle analytical evaluations, and orchestrate real-time event streaming.

---

## 1. Core Workflow Orchestration: `AresAutomation`

The `AresAutomation` service is the main orchestrator for the entire autonomous loop. It controls the lifecycle of a `CampaignTemplate` from startup to closeout, manages multi-user project spaces, handles live runtime execution streams, and saves historical summaries.

* **Campaign Management:** `GetAllCampaigns`, `GetSingleCampaign`, `AddCampaign`, `UpdateCampaign`, `RemoveCampaign`.
* **Execution Control:** `StartExecution`, `StopExecution`, `PauseExecution`, `ResumeExecution`.
* **Live Streams:** Opens persistent server-streaming connections to monitor execution parameters in real-time (`GetExecutionStatusStream`, `GetCampaignExecutionStateStream`).
* **Intervention:** `SubmitUserDecision` lets users handle non-trivial execution exceptions (e.g., triggering replanning or pausing for manual refills via an `ErrorHandling` enum).
* **Auditing:** `GetCampaignSummary` retrieves compiled execution data logs for post-experiment analytics.

---

## 2. Hardware Middleware: `AresDevices`

The `AresDevices` service manages the physical or simulated instrument layer. It keeps track of driver instances, relays device telemetry, and fires raw commands.

* **Inventory Tracking:** `ListAresDevices` returns a full inventory of available equipment along with their capability specifications (`DeviceInfo`).
* **Telemetry Streaming:** `GetDeviceStateStream` provides an async server-to-client pipeline of high-speed telemetry channels.
* **Instruction Dispatch:** `ExecuteCommand` sends an uncompiled `CommandTemplate` down to the assigned driver layer for immediate execution.
* **Logging Control:** `SetDeviceLoggerSettings` configures the persistent database recording filters (`INTERVAL` or `ON_CHANGE`).

---

## 3. Optimization and Closed-Loop Systems

### AI & Optimization Drivers: `AresPlannerManagementService`
Manages the configuration and routing rules of AI/ML planning algorithms.
* **Algorithmic Inventory:** `GetAllPlanners` returns all active planning capabilities.
* **Direct Seeding:** `SeedManualPlanner` injects explicit point arrays or file paths directly into the trial queue, bypassing active learning models when doing baseline calibration runs.

### Performance Analytics: `AresAnalysisService`
Triggers the physical data parsing routines after an experiment wraps up.
* **Evaluation:** `Analyze` takes the target inputs/settings and returns an evaluated performance `Analysis` outcome metric.
* **Validation:** `ValidateInputs` verifies that data shapes conform to expected analytical bounds before processing.

---

## 4. System Support & Utilities

### Safety Controls: `AresSafetyService`
The safety-critical channel within ARES.
* **Emergency Halt:** `RequestEmergencyStop` triggers a zero-latency, high-priority safety override across all active physical device drivers to shift equipment into designated hardware safe states.

### Language Server Engine: `AresScriptingService`
Powers the autocomplete and developer IDE backend features.
* **LSP Methods:** `GetCompletions`, `ValidateScript`, `GetScriptSummary`, `GetSignatureHelp`, and `GetSymbolMetadata`.

### Global Event Mesh: `AresNotificationRpc`
An asynchronous alerting engine that broadcasts system-wide notifications using a unified severity spectrum (`INFO`, `WARNING`, `ERROR`, `DANGER`, `SUCCESS`).
* **Subscription:** `Subscribe` opens a long-lived push channel to relay warnings or milestones directly to standard out logs or front-end dashboard panels.

### System Diagnostics: `AresServerInfo`
Tracks node health and resource states.
* **Heartbeat:** `GetServerStatusStream` broadcasts server states using a simple state enumeration:
  - `IDLE`: Open and awaiting a campaign assignment.
  - `BUSY`: Actively executing trial sequences or parsing data.
  - `ERROR`: A system fault occurred requiring user intervention.
  - `STOPPING` / `STOPPED`: Orderly service teardown states.

### Telemetry Archiving: `DeviceStateExportService`
Handles bulk data transportation.
* **Exporting:** `GetStateExport` gathers vast historical time-series sensor readings, compiles them based on a time-range filter, and serializes them into bulk formats (`COMBINED` binary sheets or `ZIPPED` collections) for deep statistical offline modeling.
