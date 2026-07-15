---
sidebar_position: 8
title: Building a Campaign
---

# Campaign Designer: Building Experiments

## 1. Introduction

*Access: Automation -> Campaign Designer*

The **Campaign Designer** is the workspace for creating **Experiment Templates**. In ARES, you design a single experiment defining the instructions for collecting one data point, and ARES OS automates the repetition of this template to form a **Campaign**.

### Campaign Creation Overview

- **Experiment Templates**: Users craft complex research campaigns by defining **Experiment Templates.**
- **Template Components**: Each template specifies:
  - **Planning Parameters**: The values you're asking your planner to provide for your experiments.
  - **Startup Script**: A set of steps executed once at the beginning of an experiment before running the first iteration of your experiment template.
  - **Experiment Script**: The core logic of your campaign. A set of defined steps ARES executes with every iteration of your experiment.
  - **Closeout Script**: The closeout logic of your campaign. Ensures all hardware is set to an optimal state before finishing a campaign. This logic is also used in the event a campaign fails to complete.
  - **Analysis Assignment**: Analyzers define their specific input needs, and ARES allows you to define what values from your campaign will match these expected values.
  - **Planner Assignment**: The assignment of your planning parameters to specific planning services.

## 2. Creating a New Campaign

1. Click the **+** button in the top right of the Campaigns list.
2. Click the **Edit** (pencil icon) next to the default name to rename your campaign (e.g., "Close the Loop").
3. Click **Save**.

## 3. Defining Planning Parameters

The **Parameter Designer** tab defines the variables that the Planner will control.

1. Click **Create New Parameter**.
2. **Parameter Name:** Give it a unique ID (e.g., `Temperature`).
3. **Data Type:** Select the type (e.g., `Number`).
4. **Metadata:** Set the Unit (e.g., `Degree Celsius`), Minimum, and Maximum values.
5. **Has Initial Value:** Enable this if the first experiment requires a specific starting point.
6. **Has Achieved Output:** Toggle this if this parameter is a "goal" value that might not match what you actually achieve. For example, a furnace is told to heat to 150 degrees, but only actually achieves a temperature of 148 degrees.

## 4. Designing the Experiment Template

The **Experiment Template** tab is where you build the sequential logic for a single iteration.

1. Click **Add Step** to create a logical block.
2. Inside a step, click **Add Command**.
3. **Select Device:** Choose the hardware (e.g., `Tube Furnace`).
4. **Select Command:** Choose the action (e.g., `SetSetpoint`).
5. **Mapping to Parameters:** To use a dynamic value from your Planner, toggle the **Planned** switch.  
  Select the corresponding parameter from the dropdown (e.g., `Temperature`).
6. **Capturing Output:** To send data to the Analyzer, add a command like `GetCurrentTemperature` and ensure **Provides Output** is enabled.

## 5. Closing the Loop: Component Assignment

Once the script is built, you must link the external services that will drive the automation.

### A. Planning Tab

ARES distinguishes between **Planning Services** and **Planners**:

- **Planning Service:** A hosted service (e.g., a Python microservice) that can offer one or more planning algorithms.
- **Planner:** A specific algorithm or logic type provided by that service (e.g., `Gradual` or `Random`).

To assign a planner:

1. **Select Service:** Choose your registered Planning Service (e.g., `My Planner (1.0.0)`).
2. **Select Planner:** Choose the specific logic type you wish to use for this campaign (e.g., `Gradual Planner`).
3. ARES will automatically display the description and parameters managed by that specific selection.

### B. Analyzer Inputs Tab

1. **Select Analyzer:** Choose your registered Analyzer (e.g., `My Analyzer`).
2. **Map Inputs:** For each input required by the analyzer, select the corresponding **Experiment Output** from your script (e.g., mapping the Analyzer's "temperature" requirement to the `Setpoint` output of your furnace).

## 6. Saving and Validation

- **Sequential Logic:** Scripts are executed from top to bottom.
- **Validation:** The **Save** button in the bottom right will persist your changes. If you reference a parameter in your script that hasn't been defined or mapped, the system will alert you.

<video controls width="100%">
  <source src="/video/campaign-construction.mp4" type="video/mp4"/>
</video>