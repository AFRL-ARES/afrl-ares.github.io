---
sidebar_position: 10
title: Safety and Troubleshooting
---

# Safety and Troubleshooting

ARES is designed to help you run experiments safely and understand what went wrong when issues occur. This page describes software-level safety features and common troubleshooting workflows.

> Important: ARES does not replace physical safety systems. Always follow your lab’s safety procedures and use hardware emergency stops where required.

## 1. Emergency Stop

The ARES UI includes a **Global Emergency Stop** footer that is visible across pages.

* **Location:** At the bottom of the application window, labeled as a large red **"Emergency Stop"** button.
* **Behavior (software-level):** When pressed, ARES sends an "Enter Safe Mode" command to all connected devices and ends any running experiment or campaign.
* **When to use:**
  * If you observe hardware moving unexpectedly.
  * If there is a risk of collision or unsafe motion.
  * If you need to quickly halt all ARES-controlled operations.

This is a **software-level** stop. For your safety, you must still use hard-wired emergency stops and follow local safety protocols.

## 2. Execution Safety and Error Handling

During campaign execution, ARES provides several controls and safety-related behaviors:

* **Pause:** Temporarily halt the scheduler to allow manual intervention without ending the campaign.
* **Stop/Abort:** Immediately end the current campaign and trigger closeout logic.
* **User decision prompts:** When an error occurs, ARES can pause and prompt for a decision (retry, replan, enter safe mode, stop and closeout), surfaced in the Execution view.
* **Stop conditions:** Execution is governed by explicit stop conditions (number of experiments, analyzer result, planner objective). Misconfigured stop conditions can prevent campaigns from starting or stopping as expected.

Use the **Execution** page’s controls and preflight checklist to make sure campaigns will stop in the way you intend before starting them.

## 3. Common Errors and Where They Appear

ARES surfaces errors and warnings in several places:

* **Notifications:** Toast-style messages in the UI report connectivity problems, failed campaign starts, and other runtime issues.
* **Execution preflight:** The preflight checklist on the Execution page highlights missing campaign templates, stop conditions, planners, or analyzers, and reports eligibility errors.
* **Event History:** The Event History page, accessed via the bell icon in the sidebar footer, shows a chronological log of system events and errors that have been pushed to the user via notifications. This is often the best place to review error messages and warnings.
* **Execution history:** Errors encountered during campaigns are reflected in the campaign summaries and experiment/step details, and are useful for understanding where a particular run failed or behaved unexpectedly.
* **Script Playground:** Scripting issues (unknown identifiers, type mismatches, invalid expressions) appear as diagnostics and underlines in the script editor.

Typical issues include:

* Devices, planners, or analyzers not reachable at their configured addresses.
* Invalid or missing stop conditions for a campaign.
* Scripting errors in custom commands or playground scripts.
* Misconfigured filters when viewing data, causing "no data" states.

## 4. Troubleshooting Devices, Planners, and Analyzers

If devices or remote services are not behaving as expected:

1. **Check Settings:**
   * Open **Settings** and verify that devices, planners, and analyzers are registered with the correct names and addresses.
   * Confirm that status indicators show them as active.
2. **Verify connectivity:**
   * Make sure the host services (e.g., Python planners/analyzers) are running and reachable at the configured URLs.
3. **Review notifications:**
   * Look for errors related to connection failures or timeouts.

4. **Inspect device capabilities:**
   * In the **Settings** view, use the information tab on each device to see the capabilities it is advertising to ARES. This can help confirm that the device is configured as expected and supports the commands you intend to use.

Resolve connectivity issues before restarting campaigns; ARES relies on these services for autonomous planning and analysis.

## 5. Troubleshooting Campaign Execution

If a campaign will not start or behaves unexpectedly:

1. **Execution preflight:**
   * Open the **Execution** view and review the preflight checklist for missing or misconfigured items (template, stop condition, planner, analyzer, eligibility).
2. **Review stop condition:**
   * Confirm that the active stop condition matches how you intend the campaign to stop (number of experiments, analyzer result, planner objective).
3. **Inspect Execution History:**
   * Use **Execution History** to review past runs and see where commands or steps failed.

Adjust campaign templates, stop conditions, and component assignments based on what you learn from preflight and history.

## 6. Troubleshooting Scripts

Scripts can appear in several contexts (Script Playground, custom commands, campaign logic). If a script fails or shows diagnostics:

1. **Read editor diagnostics:**
   * Hover over underlined code in the Script Playground to see the reported issue (unknown identifier, type mismatch, etc.).
2. **Check variable names and scopes:**
   * Ensure variables are assigned before use and in the correct scope.
3. **Validate arithmetic and comparisons:**
   * Make sure expressions involving `+`, `-`, `*`, `/`, `%`, and comparisons operate on numeric or quantity values.
4. **Use the Summary tab:**
   * In the Script Playground, use **Summarize** to inspect function invocation order and identify where failures occur.

For more details on scripting syntax and the standard library, see the [ARES Scripting](./scripting.md) page.

## 7. When to Stop and Reset

If repeated attempts to start or run campaigns fail, or if devices behave unpredictably:

* Use the **Emergency Stop** to bring all devices to a safe state.
* After the Emergency Stop has halted any running campaigns, close the ARES UI.
* Investigate hardware, network, and host service health before resuming.

In the event of persistent errors, pause and inspect the full system (devices, host services, and configuration), and only resume once you have high confidence in a safe and stable state.
