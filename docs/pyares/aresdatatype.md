---
sidebar_position: 3
title: The Ares Data Type
---

The AresDataType enumeration defines the fundamental data types supported by the ARES ecosystem. It serves as a bridge between Python's dynamic typing system and the strict, strongly-typed nature of the underlying ARES OS (via Protocol Buffers).

When defining task parameters, operation inputs, or parsing responses from the ARES server, AresDataType is used to strictly identify the expected format of the data.

## Definition
```Python
from PyAres import AresDataType

class AresDataType(Enum):
    UNKNOWN = 0
    NULL = 1
    BOOLEAN = 2
    STRING = 3
    NUMBER = 4
    STRING_ARRAY = 5
    NUMBER_ARRAY = 6
    BYTE_ARRAY = 7
    BOOL_ARRAY = 8
```

## Usage Guidelines
### 1. Type Enforcement
While Python allows variables to change types dynamically, ARES requires strict adherence to the declared type. If you declare a parameter as AresDataType.NUMBER, you must ensure the value passed is an int or float. Passing a string representation of a number (e.g., "123") will result in a serialization error at the Protobuf layer.

### 2. Handling Arrays
When using the *_ARRAY types, ARES expects homogenous lists.

Correct: [1, 2, 3] with NUMBER_ARRAY

Incorrect: [1, "2", 3] with NUMBER_ARRAY

### 3. NULL vs UNKNOWN
Use NULL when a value is optional and explicitly intentionally left blank.

UNKNOWN is reserved for system use and usually indicates that the type field was missing during deserialization. You should rarely need to set a value to UNKNOWN manually.

## Examples
Declaring a Device Method Input
When creating a custom ARES Operation or Script, you use AresDataType to tell the UI what kind of input to generate.
```Python
from PyAres import AresDeviceService, DeviceSchemaEntry, DeviceCommandDescriptor, AresDataType 

def get_state():
  #Logic to get state
  return { }

def safe_mode():
  #Logic to enter safe mode
  pass

def set_temperature(temp_value: int):
  # Logic to set temperature
  pass


if __name__ == "__main__":
  # Basic information about my device
  device_name = "Demo Device"
  description = "A device to demonstrate the PyAres device capabilities"
  version = "1.0.0"
  device_service = AresDeviceService(safe_mode, get_state, device_name, description, version)

  # Create the "Set Temperature" Command
  parameter_schema = DeviceSchemaEntry(AresDataType.NUMBER, "A numeric temperature value", "Degree's Celsius")
  input_schema = { "temp_value": parameter_schema }
  set_temp_descriptor = DeviceCommandDescriptor("Set Temperature", "Set's the temperature of the demo device to the provided value.", input_schema, {})
  device_service.add_new_command(set_temp_descriptor, set_temperature)
```
Specifying Accepted Planner Types and Settings Using AresDataType
```Python
from PyAres import AresPlannerService, PlanRequest, PlanResponse, AresDataType 

def plan(request: PlanRequest) -> PlanResponse:
  #Planning logic
  return PlanResponse([], [])

if __name__ == "__main__":
  #Basic details about your planner
  name = "Python Test Planner"
  version = "1.0.0"
  description = "This is a test planner to demonstrate working with PyAres to create planners!"
  pythonDemoPlanner = AresPlannerService(plan, name, description, version)

  #Add Supported Types
  pythonDemoPlanner.add_supported_type(AresDataType.NUMBER)

  #Add Planner Options
  pythonDemoPlanner.add_planner_option("Random Planner", "A planner that returns random values", "1.0.0")
  pythonDemoPlanner.add_planner_option("Gradual Planner", "A planner that gradually increases a value based on the values history", "1.0.0")

  #Add Planner Settings, use the AresDataType to specify the settings type
  pythonDemoPlanner.add_setting("Setting One", AresDataType.STRING)
  pythonDemoPlanner.add_setting("Setting Two", AresDataType.NUMBER)
  pythonDemoPlanner.add_setting("Setting Three", AresDataType.BOOLEAN)
  pythonDemoPlanner.add_setting("Setting Four", AresDataType.STRING_ARRAY)
  pythonDemoPlanner.add_setting("Setting Five", AresDataType.STRING_ARRAY, True, ["One", "Two", "Three"])
  pythonDemoPlanner.add_setting("Setting Six", AresDataType.NUMBER_ARRAY)
  pythonDemoPlanner.add_setting("Setting Seven", AresDataType.NUMBER_ARRAY, True, [1, 2, 3])

```


## Internal Protobuf Mapping
For advanced users debugging raw packets: This Python Enum maps 1:1 with the AresValue message type definition in the ARES .proto files. AresDataType ensures that when PyAres serializes data, it packs the value into the correct oneof field in the Protobuf message structure.