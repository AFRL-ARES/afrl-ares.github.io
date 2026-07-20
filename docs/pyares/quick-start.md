---
sidebar_position: 2
title: Quick Start
---

# Building Your First Device

In this guide, we will build a Virtual Hotplate. While not a physical device, it will be simulated to behave exactly like a real piece of hardware to ARES.

By the end of this tutorial, you will have a running Python service that ARES can connect to.

## 1. Installation

First, ensure you have the library installed:

```Bash
pip install PyAres
```

## 2. The Code

Download/Copy(if you dont have the repo cloned already) [hotplate.py](https://github.com/AFRL-ARES/PyAres/blob/Develop/PyAres/Demo/Devices/hotplate.py) and paste it to the file in a directory.

We have broken it down into two parts:

 1. **The Simulated Hardware:** A simple class representing the physical device.
 2. **The Ares Service:** The wrapper that exposes that device to ARES OS.

## 3. Running and Connecting

### Step 1: Run the Script

Open your terminal and run the python script wherever its located.

```Bash
python hotplate.py
```

You should see a message indicating the service has started and is listening (devices default to the port number 7100, but this can be changed in your service constructor).

### Step 2: Register in ARES

1. Open **ARES OS** <br></br>
    * Need help installing ARES? Check out the [ARES Launcher](https://github.com/AFRL-ARES/ARES-Launcher) for a streamlined install
2. In the bottom left, open your settings menu(the gear icon), and navigate to **Device > Remote**
3. Click the plus button on the right side of the screen
4. Give your device a name, and supply ARES the address it can expect to communicate with your device with (e.g. http://localhost:7100)
5. Click Save

### Step 3: Test Your New Device

Go to your Dashboard. The device should appear here displaying the current temperature the "hotplate" is set to. This device is also available for use when creating experiment templates.

Congratulations! You have just integrated a Python device into ARES without writing a single line of C#.
