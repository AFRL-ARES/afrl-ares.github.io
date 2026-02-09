---
sidebar_position: 3
title: Planners and Analyzers
---

### The PyAres Library
Thanks to recent updates, the Educational ARES system now supports the same PyAres library compatability as the original ARES system. For more in-depth information on creating planners and analyzers, we recommend checking out the [PyAres documentation](https://afrl-ares.github.io/docs/pyares/intro).

### Planners
* Planners make intelligent decisions regarding experiment parameters.
* **Custom Planners:** You can create custom planners using the `PyAres` package (`pip install PyAres`).
* **Communication:** Your Python script must use a port that matches the "PrintPlanner" address in ARES (default port 8006).

### Analyzers
* Analyzers process experiment output, such as images.
* **Custom Analyzers:** Use the `PyAres` library to return scores (e.g., values between 1 and 10).
* **Communication:** The script must use the port defined in the ARES "PrintAnalyzer" settings (default port 8007).