---
sidebar_position: 5
title: Planners
---

# Creating Planners
Planners are the brain of your laboratory. They reside at the top of the loop, deciding _what to do next_ based on previous results.

## The Core Concept
A Planner is responsible for choosing your next experiment parameters. It received the current parameter space (min/max constraints) and generates the specific settings for the next experiment iteration.

## Key Classes
### `AresPlannerService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `custom_plan_logic`: A callable function that will be executed when a PlanRequest is received. This function should accept a PlanRequest object and return a PlanResponse object (or an awaitable that resolves to one).
* `service_name` (str): The name associated with your planner service.
* `service_description` (str): A brief description of your planner service.
* `service_version` (str): The version associated with your planner service.
* `use_localhost` (bool): An optional value that allows the user to specify whether to host the service on the local network. _Defaults to True._
* `port` (int): The port that your planner service will serve on. _Defaults to port 7082._
* `max_message_size` (int): The max size, in megabytes, of the messages your planning service is capable of sending. Increasing this can help transfer heavy data like images, but may result in some loss in performance.

This service is the main wrapper for your planners, giving you the bridge to connect your planning logic to ARES.

#### Methods
* `add_planner_option(planner_name, planner_description, planner_version)`: Tells ARES that this planner is available via this planning service. All planning services should host at least one planner, but can host as many as desired. 
* `add_supported_type(type)`: Defines what kind of data this planner can handle (e.g., Numbers or Booleans) using the AresDataType class.
* `add_setting(setting_name, setting_type, optional, constraints)`: Adds a setting that is configurable in ARES via the planner settings menu.
* `set_timeout(new_timeout)`: Sets the amount of time, in seconds, that ARES will wait to receive responses from your planner service.
* `start(wait_for_termination)`: Starts your planner service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the backgrounds gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your planner service, terminating the connection. 

#### Objects
`PlanRequest`
* `request.parameters`: A list of parameters involved in the experiment (including their allowed range, history, and initial values if applicable)

`PlanResponse(names, values)`
* You return a paired list of parameter names and their new target values.

## Example Implementation
This example demonstrates a simple "Random Search" planner.
```Python
from PyAres import AresPlannerService, PlanRequest, PlanResponse, AresDataType
import random

def generate_plan(request: PlanRequest) -> PlanResponse:
    planned_values = []
    names = []

    # Iterate through every parameter configured in the ARES Experiment
    for param in request.parameters:
        # Simple Logic: Pick a random value within the allowed range
        val = random.uniform(param.minimum_value, param.maximum_value)
        
        names.append(param.name)
        planned_values.append(val)

    return PlanResponse(parameter_names=names, parameter_values=planned_values)

if __name__ == "__main__":
    service = AresPlannerService(
        generate_plan, 
        "Random Search Planner", 
        "This planner picks random values within bounds.", 
        "1.0.0"
    )

    # Tell ARES we can plan for Numeric values
    service.add_supported_type(AresDataType.NUMBER)

    service.start()
```
  

   