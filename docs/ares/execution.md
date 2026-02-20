---
sidebar_position: 9
title: Executing a Campaign
---

# Campaign Execution: Running and Monitoring Experiments

## 1. Introduction
*Access: Automation -> Execution*

Once you have designed your experiment template and assigned your components in the **Campaign Designer**, the **Execution** view is where you launch and monitor your live campaign. ARES OS manages the iterative flow between the planner, the experiment script, and the analyzer in real-time.

## 2. Launching a Campaign
Follow these steps to start your campaign:

1.  **Select Campaign:** Use the dropdown menu at the top left to select your designed experiment (e.g., `Close the Loop`).
2.  **Campaign Preview:** Toggle the **Campaign Preview** switch to see a read-only view of your experiment steps and assigned services before launching.
3.  **Configure Execution Parameters:**
    * **Desired Number of Experiments:** Enter the total iterations for the campaign (e.g., `3`) and click **SET**.
    * **Re-Planning Rate:** Define how often the planner should update parameters (e.g., `1` for every experiment) and click **SET**.
    * **Desired Experiment Result:** If your analyzer provides a specific score or target, set your goal range here and click **SET**.
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

## 4. The Closed-Loop Flow
As the campaign progresses, you can observe the interaction between your registered services:
1.  **Planning:** The system contacts your **Planning Service** to retrieve the next set of parameters (e.g., a new `Setpoint` for the Tube Furnace).
2.  **Execution:** The experiment script runs on the hardware using these planned values.
3.  **Analysis:** Upon completion of the script, the **Analyzer** processes the results and provides feedback to the system, which then informs the next planning cycle.

## 5. Completing or Stopping a Campaign
* **Completion:** Once the **Stop Condition** (e.g., desired number of experiments) is met, a green notification will indicate `Campaign Completed`.
* **Manual Stop:** You can stop the campaign at any time using the **Square (Stop)** button in the control bar.
* **Emergency Stop:** The red **Emergency Stop** button in the bottom right is always available to immediately halt all hardware operations.

---

<video controls width="100%">
  <source src="/video/execution.mp4" type="video/mp4"/>
</video>