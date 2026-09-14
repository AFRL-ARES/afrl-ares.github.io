---
sidebar_position: 6
title: Devices
---

# Creating Devices
Devices are the hands of your laboratory. In PyAres, a **Device** is a service that translates ARES commands (like "Set Temperature") into actual hardware instructions (like serial commands or USB signals).

## The Core Concept
A Device Service in PyAres has three main responsibilities:
1. **Execute Commands:** Perform actions when asked by ARES.
2. **Report State:** Tell ARES what the hardware is currently doing (for logging).
3. **Ensure Safety:** Provide a `safe_mode` that ARES can trigger in emergencies.

> ⚠️ IMPORTANT Variable Naming Rule: When defining a command, your Python callback function must use argument names that exactly match the keys defined in your `input_schema`.
> * **Incorrect:** Schema key is `"voltage"`, but function is `def set_volts(v):`
> * **Correct:** Schema key is `"voltage"`, and function is `def set_volts(voltage):`
> 
> PyAres maps the incoming data directly to your function arguments by name (using `method(**provided_param_dict)`). If they do not match, or if the number of arguments in your function does not match the number of schema entries, the command will fail.

## Key Classes
### `AresDeviceService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `enter_safe_mode_logic`: A callable function that will be executed when the device is instructed to enter safe mode. This logic should put your device in a stable state, for instance telling a furnace to return to ambient temperature.
* `get_device_state_logic`: A callable function that handles gathering device state information for logging purposes. This function should return a **dictionary** containing the keys and values that define your device's state. This function may be synchronous or async (awaitable).
* `device_name` (str): The name of your device.
* `description` (str): A brief description of your device.
* `version` (str): The version associated with your device implementation.
* `timeout` (int): Timeout in seconds for service calls as reported to ARES. Defaults to 30.
* `use_localhost` (bool): An optional value that allows the user to specify whether to host the service on the local network or remote (if remote, it will listen to all addresses). _Defaults to True._
* `port` (int): The port that your device service will serve on. _Defaults to port 7100._
* `max_message_size` (int): Maximum message size for gRPC in megabytes. Defaults to -1, which uses the library default.
 
This service is the main wrapper for your device, giving you the bridge to connect your hardware to ARES.

#### Methods
* `add_new_command(descriptor, callback)`: Registers a specific action (like `set_voltage`) and links it to a Python function.
    * The `descriptor` is a `DeviceCommandDescriptor` that defines the input and output schema for the command.
    * The `callback` is a Python function whose parameter names must **exactly** match the keys in the descriptor's `input_schema` and whose parameter count should match the number of input schema entries. PyAres will call it as `callback(**arguments)`.
    * The preferred return type is a `DeviceCommandResponse`. Returning raw values or dictionaries is still supported for backward compatibility but is deprecated and will emit a warning.
* `add_setting(setting_name, setting_value=None, optional=True, constraints=[], limits=None, description=None)`: Adds a new device setting to be reported to ARES when your device's capabilities are requested. The setting type is inferred from `setting_value`; `constraints` can be used to limit allowed values (for numbers or strings), and `limits` (a `Limits` object) can define minimum and maximum numeric values.
* `start(wait_for_termination)`: Starts your device service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the background gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (for example via a GUI loop or `while` loop).
* `stop()`: Stops your device service, terminating the connection.

### Command Contracts and Responses

#### `DeviceSchemaEntry`
Describes an input or output parameter for a device command.

Key fields:
* `type` (AresDataType): The data type for this parameter (for example, NUMBER, STRING, BOOLEAN).
* `description` (str): Human-readable description of the parameter.
* `unit` (str): Optional unit string (for example, `"RPM"`, `"C"`).
* `optional` (bool): Whether this parameter is optional.
* `constraints` (list[int|float|str]): Optional list of allowed values.
* `quantity_schema`: Optional metadata for quantity-style types.
* `struct_schema` (Dict[str, DeviceSchemaEntry]): Optional nested schema for struct-like parameters.
* `list_element_schema` (DeviceSchemaEntry): Optional schema describing the elements of list-type parameters.
* `min_number_value` / `max_number_value` (float): Optional numeric bounds.

#### `DeviceCommandDescriptor`
Defines the "contract" for a command. You must define:
* **Name & Description:** What the ARES user sees.
* **Input Schema:** A dictionary mapping parameter names to `DeviceSchemaEntry` objects (for example, a number for voltage).
* **Output Schema:** A dictionary mapping output names to `DeviceSchemaEntry` objects (for example, a measured current).

#### `StatusCode` and `DeviceCommandResponse`

`DeviceCommandResponse` is the preferred way for your command callbacks to report results back to ARES:

* `DeviceCommandResponse(response, error_string="", status_code=StatusCode.STATUS_UNSPECIFIED)`
    * `response`: Either a single value or a dictionary of key/value pairs representing the command result.
    * `error_string` (str): Optional text describing what went wrong if the command failed.
    * `status_code` (StatusCode): An enum that describes the outcome. Common values include:
        * `StatusCode.COMMAND_SUCCESS`
        * `StatusCode.SUCCESS_WITH_WARNINGS`
        * `StatusCode.COMMAND_FAILED`
        * `StatusCode.HARDWARE_FAULT`
        * `StatusCode.EMERGENCY_STOP`

When you return a `DeviceCommandResponse`, ARES determines success or failure from `status_code` and encodes `response` into the protobuf result (either as a struct for dictionaries or a scalar value).

Legacy behavior:
* If your callback returns a raw dictionary or scalar value instead of a `DeviceCommandResponse`, PyAres will still encode that value into the result and mark the command as successful, but it will emit a `FutureWarning` indicating that this pattern is deprecated. New device implementations should always return `DeviceCommandResponse`.

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
