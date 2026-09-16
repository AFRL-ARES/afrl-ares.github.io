---
sidebar_position: 9
title: Installation
---

## Method 1: Python Package (Recommended)

PyAres can be installed using pip:

```bash
pip install PyAres
```

## Method 2: Editable Install (For Developers)

If you are developing with PyAres or contributing to the library, you can install it in
editable mode. This lets changes you make to the source code take effect immediately
without rebuilding and reinstalling a wheel each time.

### 1. Clone the repository

Clone the PyAres repository and change into the project directory:

```bash
git clone https://github.com/AFRL-ARES/PyAres.git
cd PyAres
```

### 2. (Recommended) Create and activate a virtual environment

Create a Python virtual environment and activate it using your preferred tool
(`venv`, `conda`, etc.). For example, with the built-in `venv` module:

```bash
python -m venv .venv
source .venv/bin/activate    # On Windows PowerShell: .\.venv\Scripts\Activate.ps1
```

### 3. Set the `PYARES_PACKAGE_VERSION` environment variable

PyAres uses an environment variable to provide the package version at build time.
Before installing in editable mode, set `PYARES_PACKAGE_VERSION` to any version
string you want to use during development (for example `0.0.0-dev`):

```bash
# Unix-like shells
export PYARES_PACKAGE_VERSION=0.0.0-dev

# Windows PowerShell
$env:PYARES_PACKAGE_VERSION = "0.0.0-dev"
```

If this variable is not set, the build will fail because the version cannot be
determined.

### 4. Install PyAres in editable mode

From the root of the PyAres repository, run:

```bash
pip install -e .
```

This installs PyAres in editable mode, along with its dependencies (including
`ares-datamodel`). After this, you can import and use PyAres in your environment
while iterating on the local source code.

