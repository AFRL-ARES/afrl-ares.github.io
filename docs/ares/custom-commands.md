---
sidebar_position: 12
title: Custom Commands
---

# Custom Commands

The Custom Commands feature lets you define reusable, script-backed commands that can be shared across campaigns instead of repeating the same sequence of low-level device commands.

Custom commands are managed from the **Custom Commands** page under the Automation section of the ARES UI.

## 1. Accessing the Custom Commands Page

_Access: Automation -> "Custom Commands"_

The Custom Commands page has two main parts:

* A **Custom Commands list** that summarizes all saved commands.
* A **Custom Command Designer** used to create and edit individual command definitions.

## 2. Custom Commands List

The list view provides an overview of existing custom commands.

* **Columns:** Each row shows the command name, description, a summary of its input parameters, and a summary of its output value.
* **Actions:** Use the toolbar to refresh the list or start a new command definition. For each row you can open the designer to edit the command or delete it if it is no longer needed.

Use the list when you want to quickly see which reusable commands already exist and jump into editing or cleaning up definitions.

## 3. Custom Command Designer

_Access: Automation -> "Custom Commands" -> select a command or choose New_

The Custom Command Designer is where you define the behavior and interface of a custom command.

### 3.1 Metadata

At the top of the designer, configure the basic metadata:

* **Name:** A human-readable name for the command, such as "Measure Temperature".
* **Description:** A short summary of what the command does, shown in the list view and other UIs that surface the command.

Choose names and descriptions that make the command’s intent clear.

### 3.2 Input Parameters

The **Input Parameters** panel defines the inputs your custom command expects.

* **Adding parameters:** Use the add button to create a new parameter. Parameters are given an initial name that you can rename.
* **Renaming parameters:** Edit the parameter name to match its role (for example `setpoint` or `target_temperature`).
* **Schema definition:** For each parameter, define its value schema using the schema designer. You can specify the data type and any relevant constraints to match how the command will be used.

Parameters appear in the generated function signature and are available inside the script body.

### 3.3 Output Schema

The **Output Value Schema** panel defines the shape of the value returned by the custom command.

* Choose a data type for the output (such as a unit value, number, or structured value).
* Use the schema designer to capture any additional structure or constraints the output should follow.

Design the output schema so that callers can rely on a consistent shape for results.

### 3.4 Script Body

The **Script Body** panel is where you author the command’s logic.

* The generated function signature shows how the command name and parameters appear in the script.
* The script editor provides language features such as completions, diagnostics, semantic tokens, and hover information to help you write and maintain the command.
* The script should read parameters from the function signature, interact with devices or data as needed, and return a value that matches the output schema.

Treat the script body as the implementation of the command, keeping it focused and reusable.

### 3.5 Diagnostics

The **Command Diagnostics** panel surfaces issues detected in your custom command definition.

* Diagnostics include errors, warnings, informational messages, and hints.
* Each diagnostic shows a severity, a location, and a message that describes the problem.
* Review diagnostics before saving to ensure the command is valid and behaves as expected.

Use diagnostics to catch issues early, such as mismatched schemas or script problems.

## 4. Saving and Managing Commands

When you are done editing a command:

* Click **Save** to persist the definition. Saved commands appear in the Custom Commands list with updated metadata and summaries.
* You can reopen a saved command from the list to refine its parameters, output schema, or script.
* If a command is no longer needed, use the delete action in the list to remove it.

Custom commands are versioned by their identifiers and can be iteratively improved over time.

## 5. Using Custom Commands

Once defined, custom commands are available for use wherever the ARES UI exposes support for custom command invocation. They are designed to encapsulate common logic so that campaigns can call a named command instead of repeating the same low-level sequence of device actions.

Refer to the Campaign Designer documentation for details on how custom commands are surfaced within experiment templates.

For details on the scripting language syntax, control flow, and standard library functions used inside custom command scripts, see the [ARES Scripting](./scripting.md) page.
