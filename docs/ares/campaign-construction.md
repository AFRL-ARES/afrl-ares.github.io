---
sidebar_position: 5
title: Building a Campaign
---

# Campaign Designer: Building Experiments

## 1. Introduction
_Access: Automation -> Campaign Designer_

The **Campaign Designer** is the workspace for creating **Experiment Templates**.

In ARES, you do not hard-code a 100-iteration loop. Instead, you design a single experiment defining the instructions for collecting one data point. ARES OS then automates the repetition of this template to form a **Campaign**.

## 2. Core Concepts: The Hierarchy
To understand the designers, you must understand the ARES workflow:
1. **The Template:** The blueprint you build here. It defines the logic for _one single iteration_ (e.g. "Move to X, Measure Y"). 
2. **The Experiment:** A single execution of that Template.
3. **The Campaign:** The collection of all Experiments run in sequence.
    * The duration of the Campaign (how many times the Template is repeated) is determined by the **Stop Condition**, which is set later during Execution.

## 3. Anatomy of a Template
A complete Template consists of three configurable layers:

### A. Planning Parameters (The Inputs)
These are the variables that change from experiment to experiment.
* **Role:** They act as placeholders in your script.
* **Source:** During a Campaign, the **Planner** injects values into these parameters before every new experiment begins.
* _Example:_ `heater_temp`, `flowrate`, `laser_power`

### B. The Scripts
ARES divides the Template into three distinct execution blocks.

#### 1. Startup Script
**Executes:** ONCE per Campaign (at the very beginning). <br />
**Purpose:** System Initialization. <br />
**Use Cases:** Homing, pre-heating, opening a gas valve, etc.

#### 2. Experiment Script
**Executes:** ONCE per Experiment, repeated as need by ARES. <br />
**Purpose:** The Core Scientific Logic <br />
* **The Flow:**
    1. ARES retrieves new values for your **Planning Parameters** from the Planner (if applicable).
    2. This script runs using those specific values.
    3. Data is captured and sent to the Analyzer.

#### 3. Closeout Script
**Executes:** ONCE per Campaign (at the very end). <br />
**Purpose:** Safe Shutdown. <br />
**What triggers the closeout script?**
* The Stop Condition is met, and the campaign ends normally.
* The Campaign encounters an error. Even if your experiment fails, ARES will attempt to run your closeout script.
* The Campaign is stopped forcefully by the user.
**Use Cases:** Turn off heaters, set flow rates to zero, etc.

### C. Component Assignment
You must link the logic modules that will drive your Campaign loop.
* **The Planner:** The "Navigator." It decided the parameter values for the next experiment based on previous results.
* **The Analyzer:** The "Interpreter." It processes raw data from the current experiment and passes a score back to ARES.

## 4. Building the Script
* **Logic Flow:** Scripts are executed sequentially from top to bottom.
* **Validation:** The designer prevents saving if required components (Analyzers/Planners) are referenced in the script but not assigned in the component tab.
