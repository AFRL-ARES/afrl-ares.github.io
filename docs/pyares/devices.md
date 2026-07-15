---
sidebar_position: 6
title: 💻 Devices
---

# Creating Devices
Devices are the hands of your laboratory. In PyAres, a **Device** is a service that translates ARES commands (like "Set Temperature") into actual hardware instructions (like serial commands or USB signals).

## The Core Concept
A Device Service in PyAres has three main responsibilities:
1. **Execute Commands:** Perform actions when asked by ARES.
2. **Report State:** Tell ARES what the hardware is currently doing (for logging).
3. **Ensure Safety:** Provide a `safe_mode` that ARES can trigger in emergencies.
> ⚠️ IMPORTANT Variable Naming Rule: When defining a command, your Python callback function must use argument names that exactly match the keys defined in your input_schema.
> * **Incorrect:** Schema key is `"voltage"`, but function is `def set_volts(v):`
> * **Correct:** Schema key is `"voltage"`, and function is `def set_volts(voltage):`
> <br></br>
> PyAres maps the incoming data directly to your function arguments by name. If they do not match, the command will fail.

## Key Classes
### `AresDeviceService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `enter_safe_mode_logic`: A callable function that will be executed when the device is instructed to enter safe mode. This logic should put your device in a stable state, for instance telling a furnace to return to ambient temperature.
* `get_device_state_logic`: A callable function that handles gathering device state information for logging purposes. This function should return a **dictionary** containing the keys and values that define your devices state.
* `device_name` (str): The name of your device.
* `description` (str): A brief description of your device.
* `version` (str): The version associated with your device implementation.
* `use_localhost` (bool): An optional value that allows the user to specify whether to host the service on the local network. _Defaults to True._
* `port` (int): The port that your device service will serve on. _Defaults to port 7100._
 
This service is the main wrapper for your device, giving you the bridge to connect your hardware to ARES.

#### Methods
* `add_new_command(descriptor, callback)`: Registers a specific action (like `set_voltage`) and links it to a Python function.
* `add_setting(setting_name, setting_value=None, optional=True, constraints=[], limits=None, description=None)`: Adds a new device setting to be reported to ARES when your devices capabilities are requested.
* `start(wait_for_termination)`: Starts your device service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the backgrounds gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your device service, terminating the connection. 

### `DeviceCommandDescriptor` <br />

Defines the "Contract" for a command. You must define:
* **Name & Description:** What the ARES user sees.
* **Input Schema:** What arguments the command needs (e.g., a number for voltage)
* **Output Schema:** What data the command returns (e.g., a measured current)

## Example Implementation
```Python
from PyAres import AresDeviceService, AresDataType, DeviceSchemaEntry, DeviceCommandDescriptor, DeviceCommandResponse, StatusCode

# 1. Define your hardware logic
def set_speed(rpm: float):
    print(f"Setting motor speed to {rpm}")
    # Hardware communication goes here...
    
    # Standard practice is to return a DeviceCommandResponse
    return DeviceCommandResponse(None, status_code=StatusCode.COMMAND_SUCCESS)

def get_status():
    # Return a dictionary matching your state schema
    return { "rpm": 1200 }

def safe_mode():
    print("Stopping motor immediately!")

# 2. Initialize Service
service = AresDeviceService(
    safe_mode, 
    get_status, 
    "Rotary Mixer", 
    "High-speed mixer control", 
    "1.0.0",
    port=7101
)

# 3. Define the 'Set Speed' Command
# Input: One number (Speed)
input_schema = { 
    "rpm": DeviceSchemaEntry(AresDataType.NUMBER, "Speed in RPM", "RPM") 
}
cmd_descriptor = DeviceCommandDescriptor("Set Speed", "Sets mixer speed", input_schema, {})

# 4. Register the command
service.add_new_command(cmd_descriptor, set_speed)

# 5. Start
service.start()
```