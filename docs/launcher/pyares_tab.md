---
sidebar_position: 3
title: PyAres Tab
---

# PyAres Components Tab

The **PyAres** tab in the ARES Launcher lets you register and manage Python‑based components (planners, analyzers, and devices) that integrate with ARES via the PyAres library. From this tab you can:

- Define one or more PyAres “components”.
- Start them automatically with ARES.
- View live output from each component.
- Stop and restart individual components.
- Detect and clean up “orphan” PyAres processes when the launcher starts.

This page explains each part of the tab and how to use it correctly.

---

## Accessing the PyAres Tab

- Open the ARES Launcher.
- Go to the main window and switch to the **PyAres** tab (third tab next to **Overview** and **Configuration**).
- You’ll see:
  - A **list of components** on the left.
  - A **component editor + output viewer** on the right.
  - A **toolbar** at the bottom for adding/removing/saving components.

---

## PyAres Components List

On the left side, you’ll see a list of all configured PyAres components.

Each entry shows:

- A small **status dot**:
  - **Green** – component is currently running.
  - **Red** – component is not running.
- The component **Name**.
- Its **Description** (smaller text below the name).

Clicking an item selects it and loads its configuration and output in the right‑hand editor.

---

## Editing a Component

When you select a component, the right side shows its configuration fields:

### Basic fields

- **Name**
  - Human‑readable name for the component.
  - Must be unique; this is used internally for status, output, and control.

- **Description**
  - Optional explanatory text about what this component does.

### Paths and script fields

- **Working directory**
  - Directory where the component will run.
  - Often the root of your PyAres project (where your script(s) live).
  - Use the **Browse** button to pick this folder.

- **Python interpreter**
  - Full path to the `python` executable for the environment you want to use.
  - For standard venv:
    - Windows: `...\env\Scripts\python.exe`
    - macOS/Linux: `...\env/bin/python`
  - For Conda:
    - Windows: `...\miniconda3\envs\myenv\python.exe`
    - macOS/Linux: `...\miniconda3/envs/myenv/bin/python`
  - Use the **Browse** button to pick the interpreter directly; this is the safest way to ensure you’re using the correct environment.

- **Entry point (script/module)**
  - The script or module that should be executed.
  - Common patterns:
    - A script file name (e.g. `run_component.py`).
    - A module name (e.g. `my_package.my_component`) depending on how your environment is set up.
  - Use the **Browse** button to pick a script file within the working directory. The field is populated with the filename.

- **Arguments**
  - Optional command‑line arguments passed to the Python process.
  - Enter them as a plain string (e.g. `--port 9001 --mode lab`).

### Lifecycle options

Below the output area, you’ll see three checkboxes and control buttons:

- **Enabled**
  - If unchecked, this component is ignored by the launcher.
  - Use this to temporarily disable a component without deleting its configuration.

- **Start with ARES**
  - If checked, the launcher will automatically start this component whenever ARES is started from the launcher.
  - If unchecked, the component won’t be started automatically; you can still manage it manually (e.g. restart or stop, once it’s running).

- **Auto restart on exit**
  - If checked, the launcher will automatically restart the component when it exits unexpectedly **while ARES is running**.
  - Intentional stops (via the **Stop** button or when stopping ARES and all PyAres components) do **not** trigger auto restart.
  - This is useful for long‑running services that you don’t want to manually babysit.

### Control Buttons

- **Start**
  - Immediately starts the selected component:
    - Has no effect if the process is already running
  - The status dot will switch **green**, and the component is considered online.

- **Stop**
  - Immediately stops the selected component:
    - Cancels the Python process started by the launcher.
    - If the launcher has attached to an already‑running orphan process for that component, it will attempt to kill that process as well.
  - The status dot will switch to **red**, and the component is considered offline.
  - Auto restart does not fire for this intentional stop.

- **Restart**
  - Stops any existing instance of the component and starts a fresh one using the current configuration.
  - The status dot will switch to **green** when the new process is running.
  - Uses the latest saved configuration (paths, arguments, auto‑restart options).

---

## Output Viewer

The **Output** section shows live stdout/stderr from the selected component:

- Python processes are started in **unbuffered** mode (`-u`), so standard `print()` calls appear in real time.
- Both standard output and error streams are merged and appended to this area.
- The viewer:
  - Is **read‑only**.
  - Has a fixed height with its own scrollbar so large logs don’t stretch the layout.
  - Resets to empty whenever you switch components or restart a component.

This acts as a built‑in console so you can see what your PyAres scripts are doing without opening a separate terminal.

---

## Managing Components (New / Add / Remove / Save)

At the bottom of the tab:

- **New**
  - Creates a brand‑new component with empty fields and sensible defaults (enabled, start with ARES).
  - Use this when you want to configure a completely new PyAres service from scratch.

- **Add**
  - Clones the currently selected component’s configuration into a new entry.
  - Useful for creating similar components that differ only in a few fields (e.g., port or specific args).

- **Remove**
  - Deletes the selected component from the configuration list.
  - This does *not* kill a running process by itself; the Stop/Restart logic and orphan handling still apply to existing processes.

- **Save**
  - Persists all components in the list to the launcher configuration file.
  - Also reloads the view and reapplies the latest status data so icons stay accurate.

Remember to click **Save** after you make configuration changes; otherwise, changes will only apply for the current session.

---

## Interaction with ARES Start/Stop

The PyAres manager is tied into the main **Start ARES** and **Stop ARES** commands:

- When you **Start ARES** from the launcher:
  - All components with:
    - `Enabled = true`
    - `Start with ARES = true`
  - are started automatically.
  - Their status dots turn green if they start successfully.

- When you **Stop ARES** from the launcher:
  - All PyAres components managed by the launcher are stopped.
  - Auto restart is disabled for that stop sequence, so components do not immediately restart after ARES is shut down.

This ensures the Python services respect the lifecycle of ARES while still allowing per‑component control.

---

## Orphan PyAres Processes (Ghost Services)

Because PyAres components are separate processes, they can sometimes outlive the launcher itself (e.g., if the launcher is closed while services are still running). To help manage these:

1. The launcher maintains a small runtime JSON file with the name, PID, working directory, and entry point of each PyAres component process it starts or attaches to.
2. On startup and during conflict resolution, the launcher:
   - Checks for any running PyAres processes recorded in that runtime file.
   - If any are found, it shows a prompt:
     - “We found N existing PyAres service(s) running.”
     - Options:
       - **Stop All PyAres Services** – kills all recorded PyAres processes and clears the runtime state.
       - **Keep Services Running** – re‑attaches to the running processes and updates the PyAres tab so you can control them again.

This helps avoid “ghost services” that:
- Keep ports busy after ARES has been stopped.
- Cause conflicts when you try to start new PyAres services or ARES itself.

If you choose to keep them running, they will reappear in the PyAres tab with green status dots, and you can then stop or restart them using the normal controls.

---

## Best Practices

- **Always use the correct Python interpreter**
  - Point the **Python interpreter** field at the exact environment you intend (venv or Conda).
  - This avoids path/dependency conflicts and makes behavior predictable.

- **Use “Start with ARES” for core services**
  - For services that are part of your lab’s core workflow (e.g., device controllers or planners), enable **Start with ARES** and **Auto restart on exit**.
  - This ensures they are always up when ARES is running.

- **Use Stop/Restart instead of killing processes manually**
  - Stopping and restarting components from the PyAres tab keeps the runtime JSON and status in sync, and avoids orphan processes whenever possible.
  - Manual OS‑level kills (Task Manager, `kill`, etc.) are still possible but may create orphans until the launcher detects and reconciles them.

- **Watch the output viewer**
  - Treat the output console as your primary debug surface for PyAres code.
  - Any `print()` or error messages will appear there, making it easier to diagnose configuration or environment issues.

---

## Summary

The PyAres tab turns the launcher into a control center for Python‑based components:

- Define components with paths, interpreters, and arguments.
- Start them automatically with ARES.
- Monitor their live output.
- Stop and restart individual services.
- Detect and clean up or re‑attach orphan processes across launcher runs.

Used correctly, this gives you a consistent, cross‑platform way to manage your PyAres ecosystem alongside ARES itself.