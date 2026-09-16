---
sidebar_position: 11
title: Data Analysis and History
---

# Data Analysis and History

This page describes how ARES provides experiment history and data for analysis, and how the **Execution History**, **Data Viewer**, and **Device States** pages work together.

## 1. Overview of Analysis Surfaces

ARES provides three primary surfaces for understanding past experiments:

* **Execution History:** A structured view of completed campaigns, their experiments, and commands.
* **Data Viewer (Data Explorer):** A tabbed page for generating and exporting tabular datasets for campaigns and device state.
* **Device States:** A dedicated entry point focused on device-centric state logs, with the same capabilities exposed in the Device State tab of Data Viewer.

Together, these tools let you move from a high-level timeline of what happened to detailed tables you can use for analysis and reporting.

## 2. Execution History

_Access: Automation -> "Execution History"_

Execution History is a quick view into completed campaigns.

* **Campaign list:** Shows campaign names and completion times in a filterable table.
* **Campaign summary:** Selecting a campaign displays key metadata such as start and finish times, number of experiments, tags, and notes captured at execution time.
* **Experiment tree:** A hierarchical tree breaks down each campaign into experiments, steps, and commands, including command results, timings, and analyzer overview information.

Use Execution History when you need to answer questions like:

* "How many experiments ran and when did they finish?"
* "What commands were executed inside a particular step?"
* "Which analyzer was used, and what result did it report?"

## 3. Campaign Data Explorer

_Access: Sidebar -> "Data Viewer" -> Campaign Data tab_

The Campaign Data tab focuses on table-based experiment data for completed campaigns.

* **Campaign selection:** Choose a completed campaign execution from a filterable list that shows names, completion times, experiment counts, tags, and notes.
* **Table generation:** After applying a selection, ARES generates one or more tables representing experiment data for that campaign.
* **Tags and notes:** Campaign tags and notes are shown alongside the tables so you can keep context attached to the data.
* **Export:** Export the currently selected table as CSV or all tables for a campaign as a ZIP archive for downstream analysis.

Use the Campaign Data tab when you are ready to move from structural information (Execution History) to concrete datasets you can load into analysis tools.

## 4. Device State Explorer

_Access: Sidebar -> Data Viewer -> Device State tab_

The Device State Explorer focuses on device-centric logs rather than experiment-centric tables.

* **Device selection:** Choose one or more devices that have logged state, with search and filtering over device names and IDs.
* **Filters:** Apply time-window filters (start and end), a minimum sample interval, and optional campaign or experiment filters to constrain the state data.
* **Display modes:** Choose between separate per-device tables, a wide table that aligns multiple device values per timestamp, or a long table that lists individual state values.
* **Export:** Export the current view as CSV or multiple tables as a ZIP file, depending on the selected display mode.

Use Device State Explorer when you need to answer questions like:

* "How did the heater temperature behave over the last 24 hours?"
* "What device states were recorded during a specific campaign or experiment?"

## 5. Typical Analysis Workflow

ARES is designed so you can move smoothly from execution to analysis:

1. **Run a campaign** in the Execution view, capturing notes and tags as needed.
2. **Review structure** in Execution History to understand experiments, steps, commands, and analyzer behavior.
3. **Generate campaign tables** in Data Viewer (Campaign Data tab) for quantitative analysis of experiment outputs.
4. **Inspect device logs** in Device State Explorer to correlate device behavior with campaign results.

This workflow helps you go from "What happened?" to "What data was produced?" and finally to "How did the devices behave while it was happening?" using the tools already built into ARES.
