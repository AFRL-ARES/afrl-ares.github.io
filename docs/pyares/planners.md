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
* `parameters` (List[PlanningParameter]): A list of parameters involved in the experiment (including their allowed range, history, and initial values if applicable)
    * `name` (str): The name associated with this parameter, as assigned in ARES.
    * `minimum_value` (float): The minimum value the parameter is capable of being assigned.
    * `maximum_value` (float): The maximum value the parameter is capable of being assigned.
    * `param_histroy` (List[ParameterHistoryItem]): A list of `ParameterHistoryItem` providing historical planned and achieved values associated with the parameter.
        * `planned_value` (Any): The value returned by the planner for this run.
        * `achieved_value` (Any): The value actually achieved by the experiment.
    * `data_type` (AresDataType): An AresDataType representing what kind of data this parameter is. Common examples are NUMBER and STRING.
    * `is_planned` (bool): Represents whether this parameter is designed to be planned for (often unused).
    * `is_result` (bool): Represents whether this parameter is the intended result of the experiment (often unused).
    * `planner_name` (str): The name of the planner this variable is to be planned by. In the case you have a single planner service hosting multiple planner options, utilize this string to match to the correct planner in your service.
    * `initial_value` (Any): An optional value that can be provided through the ARES UI, this allows the user to set the very first value they wish to use in their planner, however it is up to your planner to utilize this field.
* `settings` (Dict): This is a dictionary that contains the current settings requested for your analyzer. If for instance if you have a setting called "seed" you could access it by calling `request.settings.get("seed")` (Note: you could access this item directly via `request.settings["seed"]`, however the get method is safer and generally best practice).
* `analysis_results` (List[float]): This is a list of floats representing the previous responses from your analyzer (if any). This list will be empty if no previous analysis requests have been processed. These analysis results are paired with previous parameters via indexing, so for instance the first index of this results list will be the analysis result matching the first index of all your parameters historical values.
* `request_metadata` (RequestMetadata): This object passes basic data about the request and the context around it for your use.
    * `system_name` (str): This is the name associated with the system sending this request (likely ARES).
    * `campaign_name` (str): The name of the running campaign that requested this plan.
    * `campaign_id` (str): The unique ID of the campaign that requested this plan.
    * `experiment_id` (str): The unique ID of the experiment that request this plan.
    * `experiment_start_time` (str): The start time of the current experiment, as reported by ARES.


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
  

   