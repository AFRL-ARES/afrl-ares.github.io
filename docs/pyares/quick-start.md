---
sidebar_position: 2
title: Quick Start
---

# Creating your First Services

In this guide, we will walk through running a planner, analyzer and device via PyAres. Our device will not be a physical device, rather it will be simulated to behave like a real piece of hardware to ARES.

By the end of this tutorial, you will have a running Python service for each major component that ARES can connect to.

## 1. Installation

For each individual PyAres service, we **highly recommend** using virtual environments to manage your dependencies. It is not uncommon for various services to have vastly different dependencies, and sometimes even rely on different versions of the PyAres library. For a smooth experience, follow the steps for [creating virtual environments](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) to keep your dependencies neatly separated.

First, ensure you have the library installed:

```Bash
pip install PyAres
```

## 2. The Code

### Planner

Download the [PyAres Ax Planner](https://github.com/AFRL-ARES/pyares-ax-planners) onto your local machine.

This planner is a wrapper around Meta's AX API, and provides a Bayesian Optimization planner for use with ARES OS. This planner offers a long list of useful features that you can learn more about in the repository README file. You can also find further setup instructions in the README as well.

For a deeper dive into how planners work in PyAres, see the [Planners](./planners.md) documentation.

### Analyzer

Download the [PyAres Ax Analyzer](https://github.com/AFRL-ARES/PyAres/blob/Develop/PyAres/Demo/Analyzers/ax_analyzer_test.py) onto your local machine.

This analyzer is designed to simulate a problem space with hidden ideal conditions, that being a temperature of 165 and a concentration of 3.2. The analyzer will take in whatever temperature and concentration the planner chose and calculate a yield value as an objective output. This yield value is a direct representation of the quality of the choices the planner makes, creating a simulated problem space for a planner to explore.

The Ax analyzer example uses the older single-result pattern (`AnalysisResponse(result=...)`), which is still supported. For new analyzers, we recommend using the multi-objective `AnalysisResponse(objectives=[Objective(...)])` pattern described in the [Analyzers](./analyzers.md) docs.

### Device

Download the [Hotplate Demo Device](https://github.com/AFRL-ARES/PyAres/blob/Develop/PyAres/Demo/Devices/hotplate.py) onto your local machine.

We have broken it down into two parts:

 1. **The Simulated Hardware:** A simple class representing the physical device.

 ```Python
 # --- PART 1: The Simulated Hardware ---
class VirtualHotplate:
    def __init__(self):
        self.target_temp = 25.0 # Start at room temp
    
    def set_temperature(self, temp: float):
        """Simulates setting the heater."""
        print(f"[Hardware] Heating to {temp}°C...")
        response = DeviceCommandResponse(None, status_code=StatusCode.COMMAND_SUCCESS)
        self.target_temp = temp
        return response

    def get_temperature(self):
        """Simulates reading the sensor."""
        response = DeviceCommandResponse({ "current_temp": self.target_temp }, status_code=StatusCode.COMMAND_SUCCESS)
        # In a real device, you'd read a serial port here.
        print("[Hardware] Retrieving the current temperature...")
        return response

    def get_state(self):
        """Required: Tells ARES the current status for logging."""
        return { "current_temp": self.target_temp }

    def safe_mode(self):
        """Required: A safety fallback (e.g., turn off heat)."""
        print("[Hardware] SAFE MODE TRIGGERED: Heater off.")
        self.target_temp = 0.0
 ```
 2. **The Ares Service:** The wrapper that exposes that device to ARES OS.

 ```Python
# --- PART 2: The Ares Service Wrapper ---
if __name__ == "__main__":
    # 1. Initialize the hardware
    my_hotplate = VirtualHotplate()

    # 2. Define the Service Info
    service = AresDeviceService(
        my_hotplate.safe_mode,
        my_hotplate.get_state,
        "My Virtual Hotplate",      # Device Name
        "A simulated lab hotplate", # Description
        "1.0.0"                     # Version
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
    # This schema tells ARES to expect a struct back
    output_schema = {
        "output": DeviceSchemaEntry(
            AresDataType.STRUCT,
            "Current temperature output",
            struct_schema={
                "current_temp": DeviceSchemaEntry(
                    AresDataType.NUMBER,
                    "Current Temperature",
                    "Celsius"
                )
            }
        )
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

For a more complete description of device services, command schemas, and return types, see the [Devices](./devices.md) documentation.

## 3. Running and Connecting

The core concept behind the PyAres library is creating services that wrap around the critical components of your autonomous lab. These services run entirely independent of the core ARES software, and thanks to the gRPC and protobuf communications that define the datamodel, are capable of remote communications over networks should your use case require it. Connecting these services to ARES is a two-step process: first you must start the service, then you must tell ARES how to find it.

### Step 1: Starting Your Services

#### Planner

Once you have followed the setup instructions in the README of the [PyAres AX Planner Repo](https://github.com/AFRL-ARES/pyares-ax-planners), you can start your planner service by running:

```Bash
python start_pyares_ax_planner.py
```

If done successfully you should see your planner service start on port 1337 (or whatever port is configured in that example).

#### Analyzer

With your analyzer cloned to your local machine and your virtual environment set up, starting your analyzer is simple.

```Bash
python ax_analyzer_test.py
```

By default your analyzer will start on port 8200 (unless you have changed the port in the example script).

#### Device

Open a terminal and navigate to wherever you've cloned your device, then run:

```Bash
python hotplate.py
```

You should see a message indicating the service has started and is listening (devices default to the port number 7100, but this can be changed in your service constructor).

### Step 2: Register in ARES

The process for adding these services is very similar in ARES. Below are the steps for connecting to your device example, but you can mimic this process for the planner and analyzer via their respective tabs in the settings menu.

1. Open **ARES OS**  
    * Need help installing ARES? Check out the [ARES Launcher](../launcher/intro.md) for a streamlined install
2. In the bottom left, open your settings menu (the gear icon), and navigate to **Device > Remote**
3. Click the plus button on the right side of the screen
4. Give your device a name, and supply ARES the address it can expect to communicate with your device with (e.g. http://localhost:7100)
5. Click Save

### Step 3: Test Your New Services
When adding your services, ARES will display whether or not the connection to those services is active. If you see a green "Active" on the service in the settings menu, you have successfully connected to your PyAres service. You should be able to see some basic information like the address of the service, the reported name, and a description and version as reported by the service itself.

Congratulations. At this point you have successfully connected one of each core pieces of the ARES software, and you're almost ready to begin running closed-loop campaigns. If you haven't already, check out the [ARES Quick Start Guide](../ares/quickstart.md) to learn more about using our software. Happy experimenting.
