---
sidebar_position: 9
title: Executing a Campaign
---

# Campaign Execution: Running and Monitoring Experiments

## 1. Introduction
*Access: Automation -> Execution*

Once you have designed your experiment template and assigned your components in the **Campaign Designer**, the **Execution** view is where you launch and monitor your live campaign. ARES OS manages the iterative flow between the planner, the experiment script, and the analyzer in real-time.

For guidance on building and configuring campaign templates, see [Campaign Designer: Building Experiments](./campaign-construction.md).

## 2. Launching a Campaign
Follow these steps to start your campaign:

1.  **Select Campaign:** Use the dropdown menu at the top left to select your designed experiment (e.g., `Close the Loop`).
2.  **Campaign Preview:** Toggle the **Campaign Preview** switch to see a read-only view of your experiment steps and assigned services before launching.
3.  **Configure Execution Parameters:**
    * **Desired Number of Experiments:** Enter the total iterations for the campaign (e.g., `3`) and click **SET**. This configures a **Num Experiments** stop condition.
    * **Re-Planning Rate:** Define how many experiments ARES runs before asking the planner for new parameters (e.g., `1` for every experiment) and click **SET**. This is the **replication rate** for planning.
    * **Desired Experiment Result:** If your analyzer provides a specific score or target, set your goal range here and click **SET**. This configures an **Analyzer Result** stop condition.
4.  **Start Campaign:** Click the **Play** button in the top-right control bar to begin execution.


## 3. Real-Time Monitoring
During execution, the dashboard provides a live breakdown of each experiment iteration:

### Execution Status
* **Active Campaign:** A green notification confirms when ARES has successfully started the campaign.
* **Experiment Status Toggle:** Shows whether the current experiment is actively running or idle.
* **Live Console:** ARES displays each iteration (e.g., `Experiment 1`, `Experiment 2`) with a log of individual commands.

### Command Feedback
For every step in your experiment, the console tracks
* **Status:** Indicates if a command has `Succeeded`, is `Running`, or is `Undefined` (awaiting execution).

## 4. Stop Conditions

Before a campaign can start, ARES needs to know **how the run should stop**. The Execution view supports three stop condition modes:

1. **Number of Experiments**
   * Stops after a specified number of experiments have completed.
   * Configured via the **Desired Number of Experiments** input. When active, the stop summary will indicate a Num Experiments stop condition.

2. **Analyzer Result Goal**
   * Stops when an analyzer objective reaches a target value within a specified leeway.
   * Configured via the **Desired Experiment Result** inputs (target value and leeway). When active, the stop summary will describe the analyzer-based goal (e.g., a result within the specified range).

3. **Planner Objective Achieved**
   * Stops when the planner reports that the campaign objective has been achieved.
   * Configured by enabling the planner-led stop condition from the Execution view. When active, the stop summary will indicate that the planner is responsible for signaling completion.

Only one mode is active at a time. When you press **Play**, ARES applies the currently selected stop condition and uses it to determine when the campaign is considered complete.

## 5. Run Details: Notes and Tags

The **Run Details** area in the Execution view lets you attach additional context to a campaign before it starts:

* **Experiment notes:** A free-form notes field captured when the campaign starts. Use this to record the intent of the run, configuration details, or anything you want to remember when reviewing results later.
* **Experiment tags:** A set of named tags you can select from the available list or create on the fly. Selected tags are recorded with the campaign when it starts and surfaced in the run summary to help identify and group runs.

Notes and tags are locked while a campaign is actively running. Adjust them while the campaign is idle, then start the run so ARES can capture them alongside the execution metadata.

## 6. Planning Cadence and Replication

ARES distinguishes between **how often it calls the planner** and **how many planned points it requests**:

* **Re-Planning Rate (Replication Rate):** Controls how many experiments run before the planner is asked for new parameters. A value of `1` means the planner is consulted every experiment; higher values reuse a planned set of parameters across multiple experiments.
* **Planning Batch Size (when exposed):** Controls how many planned points ARES requests in a single call to the planner. Larger batch sizes can be useful for planners that propose multiple candidates at once.

Together, these settings determine the cadence of planning in your campaign. For simple runs, a Re-Planning Rate of `1` keeps planning tightly coupled to each experiment. For throughput-oriented runs, you can use a higher replication rate or larger batch size to reduce planner calls.

## 7. The Closed-Loop Flow
As the campaign progresses, you can observe the interaction between your registered services:
1.  **Planning:** The system contacts your **Planning Service** to retrieve the next set of parameters (e.g., a new `Setpoint` for the Tube Furnace).
2.  **Execution:** The experiment script runs on the hardware using these planned values.
3.  **Analysis:** Upon completion of the script, the **Analyzer** processes the results and provides feedback to the system, which then informs the next planning cycle.

## 8. Live Metrics and Telemetry

During a live run, ARES surfaces closed-loop telemetry so you can see how planning, analysis, and device behavior evolve over time:

* **Planner Data chart:** Plots planned parameter values over experiment index. Values are normalized to a 0–100 scale for charting, with the raw numeric values shown in tooltips. Each series corresponds to a planned parameter.
* **Analyzer Data chart:** Plots analyzer objective values over experiment index. Like planner metrics, the chart uses a normalized scale for visualization while tooltips show the raw objective scores.
* **Device Monitoring charts:** Optional, user-configured charts that start empty and become available once you add a device visualization in the Device Monitoring area. Each chart is tied to a selected device and visualization configuration, and displays live device data based on that configuration during execution.

These charts help you quickly assess whether the planner is exploring the parameter space as expected, whether the analyzer’s objective scores are moving toward your desired targets, and how key device signals are behaving during the campaign.

## 9. Completing or Stopping a Campaign
* **Completion:** Once the **Stop Condition** (e.g., desired number of experiments) is met, a green notification will indicate `Campaign Completed`.
* **Manual Stop:** You can stop the campaign at any time using the **Square (Stop)** button in the control bar.
* **Emergency Stop:** The red **Emergency Stop** button in the bottom right is always available to immediately halt all hardware operations.

## 10. Preflight Checks Before Starting a Campaign

Before ARES starts a campaign, the Execution view runs a **preflight check** to confirm that all required pieces are ready. The checklist includes:

* **Campaign template:** A campaign must be selected from the dropdown.
* **Stop condition:** A stop condition must be configured and active (Num Experiments, Analyzer Result, or Planner Objective).
* **Planner readiness:** If your experiment template includes planner-backed parameters, at least one planner must be assigned and reachable.
* **Analyzer readiness:** If an analyzer is assigned, it must be reachable and provide its metadata.
* **Execution eligibility:** ARES evaluates whether the current configuration and connected services allow execution to start. If eligibility fails, an error message is shown explaining why the campaign could not be started.

If any of these checks fail, ARES will refuse to start the campaign and surface a notification describing what needs attention. Use the preflight checklist in the Execution view to correct missing assignments or connectivity issues before retrying.

---

<video controls width="100%">
  <source src="/video/execution.mp4" type="video/mp4"/>
</video>
