---
sidebar_position: 3
title: Quick Start
---

# Quick Start Guide
Welcome to ARES! This guide will walk you through launching the system and running your first automated research campaign. If you haven't yet installed your ARES system, please check out [the Launcher Guide](../launcher/intro.md) before continuing with this documentation. 

## Adding Your First Device
The first step towards running your very own campaigns is adding devices to your ARES system. No hardware ready to connect? No problem, ARES offers simulated versions of most of its devices that let you build completely simulated experiments.

### Add a Mass Flow Controller
Adding devices is made simple in ARES. Follow these steps or checkout the video below to add your own Alicat MFC!

1. **Navigate to Settings**: Click the **Settings (gear)** icon at the bottom of the left sidebar.
2. **Select Device Type**: In the **Device** tab, select your hardware category (e.g. **Alicat MFCs**, **Tube Furnace**, etc.) from the list.
3. **Create New Device**: Click the **[+]** button on the right side of the screen.
4. **Configure Parameters**:
    * **Name**: Give your device a unique identifier (e.g., SimCatThree)
    * **Connection**: Choose the appropriate **COM Port** or **ID**.
    * **Mode**: Toggle **Simulated** if you are testing without physical hardware.
5. **Save**: Click the **checkmark** button. A "Successfully added" notification will confirm the device is ready.

You've successfully added an Alicat Mass Flow Controller to your system! It will now be accessible in both the dashboard as well as experiment scripts.

<video controls width="100%">
  <source src="/video/AddingAlicatMFC.mp4" type="video/mp4"/>
</video>

### Creating your First Experiment Template
Now that you have your first device added to your ARES system, you can setup an experiment template. If you would rather add a planner and analyzer first, keep following this quick start guide below.

In ARES, the **Experiment Template** is the blueprint for your research, defining exactly what commands the system sends to your hardware.

1. **Open the Designer**: Navigate to **Automation > Campaign Designer**.
2. **Create a Template**: Click the **[+]** icon at the top right of the page. Give your template a unique name.
3. **Select Template Tab**: Switch to the **Experiment Template** tab.
4. **Create Steps**: Steps are simply structures to organize your experiment logic, all commands live within a step. Click the **Add Step** button and give it a name.
5. **Add Commands:**
    * Within a step, click **Add Command**
    * Select your **Device** and the specific **Command** (e.g., NewSetpoint).
    * Input your parameters (e.g., 0.5) and click **Create**.
6. **Save**: Click the **Save** button in the bottom-right corner. 

### Executing your First Campaign
A **Campaign** is created when you take an Experiment Template and run it for a specific number of iterations.

1. **Go to Execution:** Select **Automation > Execution** from the sidebar.
2. **Select Template:** Choose your pre-designed template from the dropdown menu.
3. **Define the Stop Condition**: Enter the **Desired number of experiments** (the number of times ARES will iterate through your template)
4. **Initialize Campaign**: Click **Set** to prepare your run.
5. **Run**: Click the **Play Button** at the top right to begin the campaign.
6. **Live Monitor**: Once you click play, the page will automatically toggle to the **Experiment Status** to watch each iteration move from "Running" to "Succeeded" in real-time.

<video controls width="100%">
  <source src="/video/basic_experiment.mp4" type="video/mp4"/>
</video>

## Ready for Autonomy?
You've achieved automation, but it's time to take things to the next level. ARES is capable of full **autonomous experimentation** through its support for planning and analysis modules:

* **Planners**: The "decision makers" of the lab. They range from simple random generators to complex machine learning models.
* **Analyzers**: These process experiment data and provide a "score" to inform the planner's next choice.

If you're ready to close the loop, check out the documentation for the [PyAres library](../pyares/intro.md) to get started building your own planners and analyzers.

