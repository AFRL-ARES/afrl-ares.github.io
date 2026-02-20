---
sidebar_position: 7
title: Adding an Analyzer
---

## Configuring Analyzers in ARES OS

Analyzers are essential components within ARES used to process real-time data and provide feedback for experiment optimization. This guide outlines how to register and verify a new analyzer within ARES OS. To learn more about building your own analysis logic, check out the PyAres documentation for [creating an analyzer](../pyares/analyzers.md).

### Adding a New Analyzer

Follow these steps to connect a new analyzer service to your environment:

1.  **Access Settings:** Click the **Settings** (gear icon) in the bottom-left sidebar of the ARES OS dashboard.
2.  **Navigate to Analyzers:** Select the **Analyzer** tab from the top navigation menu within the Settings view.
3.  **Open Registration Modal:** Click the **+** (plus) button in the top-right corner of the interface.
4.  **Input Configuration:**
    * **Analyzer Name:** Enter a unique identifier for the analyzer (e.g., `My Analyzer`).
    * **Address:** Provide the full URL where the analyzer service is hosted (e.g., `http://localhost:7083`).
5.  **Save:** Click the **Save** button to finalize the registration.

> **Verification:** Upon successful registration, a green notification will confirm the update. The analyzer should immediately appear in the list with a green **Active** badge.

---

### Analyzer Information Overview

Once an analyzer is registered, the settings page displays several key metadata fields retrieved from the service:

| Field | Description |
| :--- | :--- |
| **Address** | The network location ARES uses to communicate with the analyzer. |
| **Type** | The specific implementation type (e.g., Python Test Analyzer). |
| **Version** | The current version of the analyzer service. |
| **Description** | A summary of the analyzer’s functionality, often defined via PyAres. |
| **Status** | A real-time indicator showing if the analyzer is reachable and active. |

---

<video controls width="100%">
  <source src="/video/add_analyzer.mp4" type="video/mp4"/>
</video>