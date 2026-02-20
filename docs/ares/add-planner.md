---
sidebar_position: 6
title: Adding a Planner
---

## Configuring Planners in ARES OS

Planners are core components of autonomy in ARES used to coordinate device tasks and experiment logic. This guide outlines how to register and verify a new planner within ARES OS. Looking to learn more about creating a planner of your own? Check out the PyAres documentation for [creating a planner](../pyares/planners.md).

### Adding a New Planner

Follow these steps to connect a new planner service to your environment:

1.  **Access Settings:** Click the **Settings** (gear icon) in the bottom-left sidebar of the ARES OS dashboard.
2.  **Navigate to Planners:** Select the **Planner** tab from the top navigation menu within the Settings view.
3.  **Open Registration Modal:** Click the **+** (plus) button in the top-right corner of the interface.
4.  **Input Configuration:**
    * **Planner Name:** Enter a unique identifier for the planner (e.g., `My Planner`).
    * **Address:** Provide the full URL where the planner service is hosted (e.g., `http://localhost:7082`).
5.  **Save:** Click the **Save** button to finalize the registration.

> **Verification:** Upon successful registration, a green notification will confirm the update. The planner should immediately appear in the list with an "Active" status indicator.

---

### Planner Information Overview

Once a planner is registered, the settings page displays several key metadata fields retrieved from the service:

| Field | Description |
| :--- | :--- |
| **Address** | The network location ARES uses to communicate with the planner. |
| **Type** | The specific implementation type (e.g., Python Test Planner). |
| **Version** | The current version of the planner service. |
| **Description** | A summary of the planner’s functionality, often defined via PyAres. |
| **Status** | A real-time indicator showing if the planner is reachable and active. |

---

<video controls width="100%">
  <source src="/video/adding_planner.mp4" type="video/mp4"/>
</video>