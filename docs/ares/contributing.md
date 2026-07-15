---
sidebar_position: 12
title: Contributing Guidelines
---

# Contributing to ARES

Welcome to the ARES project! We're happy that you are interested in contributing. Developed at the Air Force Research Laboratory (AFRL), ARES relies on an open community of researchers and developers to accelerate the pace of scientific discovery through closed-loop autonomous experimentation.

Whether you are a scientist looking to integrate an experimental setup or a developer aiming to improve the core orchestration engine, your contributions are welcome.

---

## Contribution Pathways

Depending on what you are building, the process for sharing your work with the community looks a bit different.

### 1. Plugins (Device Drivers, Planners, Analyzers)

Because ARES uses a highly decoupled, "Plugin-First" architecture, custom hardware drivers, AI planners, and data analysis routines **do not need to be merged into the core ARES repositories**. You can develop and host these tools entirely on your own. 

If you have built a device driver, planner, or analyzer that you believe would be valuable to the wider ARES community, you don't need to submit a pull qequest. Instead, we want to feature it! **Please email a member of our team** (see [Contact & Support](#contact--support) below) to discuss adding your plugin to our official list of supported ARES tools.

### 2. Core Development (ARES OS, PyAres, Datamodel)

If you are fixing a bug, adding a core feature to the orchestration engine, updating the Python library, or modifying the datamodel, you will follow a standard open-source GitHub workflow. You will fork the relevant repository, test your changes locally, and submit a Pull Request (see the [Submitting Core Contributions](#submitting-core-contributions) section below).

---

## Opening Issues

If you find a bug, have a feature request, or need to discuss a major change before starting work, please open an issue in the relevant repository!

Before creating a new issue, please **search existing issues** to see if your topic has already been reported or requested. This helps avoid duplicates and keeps discussions centralized.

When opening an issue, please include the following depending on your context:

* **Bug Reports:** Provide detailed steps to reproduce the issue, the expected behavior versus the actual behavior, and details about your environment (OS, ARES version, relevant hardware, Python/.NET versions). Include error logs if applicable.
* **Feature Requests:** Give a clear description of the requested feature, the specific scientific or technical use case it solves (as allowed), and any proposed implementation details.
* **Architecture Discussions:** If you are planning a major refactor or a significant new plugin, open an issue *first* to discuss it with the maintainers. This ensures your work aligns with the project's roadmap and prevents wasted development effort.

---

## Getting Started

Depending on the repository you are contributing to, you will need slightly different local setups. See the repos readme and their coresponding documentation page on the documentation site.  
After following the local setup, check out the [Developer Guide](./developer-setup.md).

### Local Setup

1. **Fork the relevant repository** from the [AFRL-ARES GitHub Organization](https://github.com/AFRL-ARES).
2. **Clone your fork** locally:

   ```bash
   git clone [https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git](https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git)
   cd REPOSITORY-NAME
   ```

3. **Follow the repository-specific documentaion and README** for instructions on building and running the project locally.

---

## Submitting Core Contributions

We use a standard GitHub Pull Request (PR) workflow. 

1. **Create a Feature Branch:** Always branch off of `main` for your work. Use descriptive names like `feat/add-modbus-driver` or `fix/exeuction-ui-bug`. <br />

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Write Clean, Documented Code:** Ensure your code follows the style conventions of the respective language (e.g., PEP 8 for Python, standard C# naming conventions). 
3. **Commit your Changes:** Write clear, concise commit messages. 
4. **Push to your Fork:**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Open a Pull Request:** Open a PR against the `main` branch of the original AFRL-ARES repository. 

Think about and determine if your changes need to be officially in the documentation. If they need to, then see [Documentation Contribution](../intro.md#Contributtions)

### Pull Request Guidelines

* **Describe the Change:** Clearly explain what the PR does, it's neccessity, and how it was tested.
* **Link Issues:** If your PR resolves an open issue, link it (e.g., "Resolves #42").
* **Be Patient:** Our maintainers will review your PR as soon as possible. We may suggest some tweaks or ask for additional tests before merging.

---

## Licensing 

ARES is open-source and primarily licensed under the **MIT License**. By contributing to this project, you agree that your contributions will be licensed under the project's standard MIT License. Please check individual repositories if specific license terms apply.

---

## Clearance

**ARES Clearance:** Distribution A. Approved for public release: distribution unlimited. AFRL-2025-5329 <br />
**PyAres Clearance:** Distribution A. Approved for public release: distribution unlimited. AFRL-2025-5332.

---

## Contact & Support

If you have questions before you start building, we are happy to help!

* **Software Questions & Plugin Submissions:** Please reach out to ababeckis@dcscorp.com or nkleiner@dcscorp.com.
* **Collaborations:** For potential scientific or organizational collaborations, contact Dr. Benji Maruyama at benji.maruyama@afrl.af.mil.