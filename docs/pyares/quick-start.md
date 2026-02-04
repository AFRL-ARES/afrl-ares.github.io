---
sidebar_position: 2
title: Quick Start
---

# Building Your First Device
In this guide, we will build a Virtual Hotplate. While not a physical device, it will be simulated to behave exactly like a real piece of hardware to ARES.

By the end of this tutorial, you will have a running Python service that ARES can connect to.

# 1. Installation
First, ensure you have the library installed:

```Bash
pip install PyAres
```

# 2. The Code
Create a new file named `hotplate.py` and paste in the following code.

We have broken this down into two parts:
 1. **The Simulated Hardware:** A simple class representing the physical device.
 2. **The Ares Service:** The wrapper that exposes that device to ARES OS.

```Python
import time
from PyAres import AresDeviceService, AresDataType, DeviceSchemaEntry, DeviceCommandDescriptor

# --- PART 1: The Simulated Hardware ---
class VirtualHotplate:
    def __init__(self):
        self.target_temp = 25.0 # Start at room temp
    
    def set_temperature(self, temp: float):
        """Simulates setting the heater."""
        print(f"[Hardware] Heating to {temp}°C...")
        self.target_temp = temp
        return {} # Return empty dict if no data needs to be sent back

    def get_temperature(self):
        """Simulates reading the sensor."""
        # In a real device, you'd read a serial port here.
        return { "current_temp": self.target_temp }

    def get_state(self):
        """Required: Tells ARES the current status for logging."""
        return { "current_temp": self.target_temp }

    def safe_mode(self):
        """Required: A safety fallback (e.g., turn off heat)."""
        print("[Hardware] SAFE MODE TRIGGERED: Heater off.")
        self.target_temp = 0.0

# --- PART 2: The Ares Service Wrapper ---
if __name__ == "__main__":
    # 1. Initialize the hardware
    my_hotplate = VirtualHotplate()

    # 2. Define the Service Info
    service = AresDeviceService(
        my_hotplate.safe_mode,
        my_hotplate.get_state,
        "My Virtual Hotplate",    # Device Name
        "A simulated lab hotplate", # Description
        "1.0.0"                   # Version
    )

    # 3. Define Command: Set Temperature
    # This schema tells ARES to draw a Number Input box in the UI
    input_schema = { 
        "temp": DeviceSchemaEntry(AresDataType.NUMBER, "Target Temperature", "Celsius") 
    }
    set_cmd = DeviceCommandDescriptor(
        "Set Temp", 
        "Sets the hotplate target temperature", 
        input_schema, 
        {} # No output expected
    )
    service.add_new_command(set_cmd, my_hotplate.set_temperature)

    # 4. Define Command: Get Temperature
    # This schema tells ARES to expect a number back
    output_schema = {
        "current_temp": DeviceSchemaEntry(AresDataType.NUMBER, "Current Temperature", "Celsius")
    }
    get_cmd = DeviceCommandDescriptor(
        "Get Temp", 
        "Reads the current temperature", 
        {}, # No input needed
        output_schema
    )
    service.add_new_command(get_cmd, my_hotplate.get_temperature)

    # 5. Start the Service
    # This will block and listen for ARES connections
    print("Virtual Hotplate Service Running...")
    service.start()
```

# 3. Running and Connecting
### Step 1: Run the Script
Open your terminal and run your script.
```Bash
python hotplate.py
```
You should see a message indicating the service has started and is listening (devices default to the port number 7100, but this can be changed in your service constructor).

### Step 2: Register in ARES
1. Open **ARES OS** <br></br>
    * Need help installing ARES? Check out the [ARES Launcher](https://github.com/AFRL-ARES/ARES-Launcher) for a streamlined install
2. In the bottom left, open your settings menu with the gear icon, and navigate to **Devices > Remote Devices**
3. Click the plus button on the right side of the screen
4. Give your device a name, and supply ARES the address it can expect to communicate with your device with (e.g. http://localhost:7100)
5. Click Save

### Step 3: Test Your New Device
Go to your Dashboard. The device should appear here displaying the current temperature the "hotplate" is set to. This device is also available for use when creating experiment templates.

Congratulations! You have just integrated a Python device into ARES without writing a single line of C#.
 