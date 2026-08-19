---
sidebar_position: 4
title: 🧠 Planners
---

# Creating Planners
Planners are the brain of your laboratory. They reside at the top of the loop, deciding _what to do next_ based on previous results.

## The Core Concept
A Planner is responsible for choosing your next experiment parameters. It receives the current parameter space (min/max constraints) and generates the specific settings for the next experiment iteration. Planners should be capable of performing batch planning, where ARES specifies how many plans it would like in a given response. Planners are designed to be stateless by default, but whether or not your service tracks data between experiments is up to the implementer. 

## Key Classes
### `AresPlannerService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `custom_plan_logic`: A callable function that will be executed when a PlanRequest is received. This function should accept a `PlanRequest` object and return a `List[Plan]` (or `PlanResponse`) object (or an awaitable that resolves to one).
* `service_name` (str): The name associated with your planner service.
* `service_description` (str): A brief description of your planner service.
* `service_version` (str): The version associated with your planner service.
* `timeout` (int): The amount of time, in seconds, ARES will wait to receive responses from your planner service. Defaults to 30.
* `use_localhost` (bool): An optional value that allows the user to specify whether to host the service on the local network or remote(if remote, it'll listen to all addresses). _Defaults to True._
* `port` (int): The port that your planner service will serve on. _Defaults to port 7082._
* `max_message_size` (int): The max size, in megabytes, of the messages your planning service is capable of sending. Increasing this can help transfer heavy data like images, but may result in some loss in performance.

This service is the main wrapper for your planners, giving you the bridge to connect your planning logic to ARES.

#### Methods
* `add_planner_option(planner_name, planner_description, planner_version)`: Tells ARES that this planner is available via this planning service. All planning services should host at least one planner, but can host as many as desired. 
* `add_supported_type(type)`: Defines what kind of data this planner can handle (e.g., Numbers or Booleans) using the `AresDataType` class.
* `add_setting(setting_name, setting_type, default_value=None, optional=True, constraints=[], limits=None, description=None)`: Adds a setting that is configurable in ARES via the planner settings menu.
* `set_timeout(new_timeout)`: Sets the amount of time, in seconds, that ARES will wait to receive responses from your planner service.
* `start(wait_for_termination)`: Starts your planner service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the background gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your planner service, terminating the connection. 

#### Objects
`PlanRequest`
* `parameters` (List[PlanningParameter]): A list of parameters involved in the experiment (including their allowed range, history, and initial values if applicable).
    * **Dynamic Field Access Shortcut:** You can access parameters directly by name as fields on the request object (e.g., `request.Temperature` can be used instead of searching through `request.parameters`).
    * `name` (str): The name associated with this parameter, as assigned in ARES.
    * `minimum_value` (float): The minimum value the parameter is capable of being assigned.
    * `maximum_value` (float): The maximum value the parameter is capable of being assigned.
    * `bounds` (List[float]): Shortcut property returning `[minimum_value, maximum_value]`.
    * `param_history` (List[ParameterHistoryItem]): A list of `ParameterHistoryItem` providing historical planned and achieved values associated with the parameter.
        * `planned_value` (Any): The value returned by the planner for this run.
        * `achieved_value` (Any): The value actually achieved by the experiment.
    * `planned_values` (List[Any]): Shortcut property returning a list of all historical planned values for this parameter.
    * `achieved_values` (List[Any]): Shortcut property returning a list of all historical achieved values for this parameter.
    * `data_type` (AresDataType): An AresDataType representing what kind of data this parameter is. Common examples are NUMBER and STRING.
    * `is_planned` (bool): Represents whether this parameter is designed to be planned for.
    * `is_result` (bool): Represents whether this parameter is the intended result of the experiment.
    * `planner_name` (str): The name of the planner this variable is to be planned by.
    * `initial_value` (Any): An optional initial value provided through the ARES UI.
* `parameter_names` (List[str]): Shortcut property returning a list of all parameter names in the request.
* `planned_parameter_table` (List[List[Any]]): Property returning tables of historical planned values.
* `achieved_parameter_table` (List[List[Any]]): Property returning tables of historical achieved values.
* `settings` (Dict): This is a dictionary that contains the current settings requested for your planner. If for instance you have a setting called "seed" you could access it by calling `request.settings.get("seed")` (Note: you could access this item directly via `request.settings["seed"]`, however the get method is safer and generally best practice).
* `analysis_results` (List[float]): This is a list of floats representing the previous responses from your analyzer (if any). This list will be empty if no previous analysis requests have been processed. These analysis results are paired with previous parameters via indexing, so for instance the first index of this results list will be the analysis result matching the first index of all your parameters historical values. **This field is deprecated, and will be removed in a future release of ARES.** It is being replaced by the new field `request.analysis_data`.
* `request_metadata` (RequestMetadata): This object passes basic data about the request and the context around it for your use.
    * `system_name` (str): This is the name associated with the system sending this request (likely ARES).
    * `campaign_name` (str): The name of the running campaign that requested this plan.
    * `campaign_id` (str): The unique ID of the campaign that requested this plan.
    * `experiment_id` (str): The unique ID of the experiment that requested this plan.
    * `experiment_start_time` (str): The start time of the current experiment, as reported by ARES.
* `request.batch_size` (int): The number of plans ARES is requesting be sent back from this planner in its response.
* `request.previous_plan_status_codes` (List[PlanStatusCode]): An optional list of status codes associated with previously planned experiments.
* `request.analysis_data` (List[AnalysisDataEntry]): A list of `AnalysisDataEntry` objects, one per experiment, containing analyzer-produced objectives.

`ObjectiveStatus(Enum)` Planners are now capable of reporting the status of the objective they're working towards, which ARES can optionally use to determine when to stop experimenting.
* `OBJECTIVE_STATUS_UNSPECIFIED`: A default state, suggesting the planner has not specified anything regarding the state of the objective.
* `OBJECTIVE_UNACHIEVED`: A state from the planner that it is tracking the status of the objective, but it is currently unachieved.
* `OBJECTIVE_ACHIEVED`: A state from the planner that says the objective has been achieved from its understanding.
* `OBJECTIVE_FAILED`: A state from the planner suggesting some sort of error has been encountered, used when we are no longer capable of achieving the desired objective.

`ParameterHistoryItem(planned_value, achieved_value)`
* `planned_value` (Any): The value given directly from the planner.
* `achieved_value` (Any): An optional value that represents the real world achieved value, which may differ from the planners target value.

`AnalysisDataEntry(analysis_objectives)`
* `analysis_objectives` (List[Objective]): A list of `Objective` instances produced by the analyzer. See the [analyzer docs](analyzers.md) for more information on Objectives.

#### Return Types

Your custom planning logic can return either a **`List[Plan]`** (recommended, supports batch planning) or a **`PlanResponse`** (legacy / single-plan).

`Plan(parameters, outcome=Outcome.SUCCESS, error_string="", objective_status=ObjectiveStatus.OBJECTIVE_STATUS_UNSPECIFIED)`  
*(Recommended)* Represents an individual experimental plan. When ARES requests a batch size greater than 1 (`request.batch_size`), return a list containing multiple `Plan` objects (e.g., `[Plan(...), Plan(...)]`).
* `parameters` (Union[List[PlannedParameter], Dict[str, Any]]): The planned variables for this specific iteration. Can be provided as a dictionary of `{"param_name": value}` or a list of `PlannedParameter` objects.
* `outcome` (Outcome): Indicates if planning succeeded. Defaults to `Outcome.SUCCESS`.
* `error_string` (str): Optional string detailing failure reasons if `outcome != Outcome.SUCCESS`.
* `objective_status` (ObjectiveStatus): Optional status of the objective being optimized (e.g., `OBJECTIVE_ACHIEVED`). Defaults to `OBJECTIVE_STATUS_UNSPECIFIED`.

`PlannedParameter(name, value)`
* `name` (str): The name of the parameter as defined in ARES.
* `value` (Any): The planned value for this parameter.

`PlanResponse(parameter_names=None, parameter_values=None, parameter_data=None, outcome=Outcome.SUCCESS, error_string="", objective_status=ObjectiveStatus.OBJECTIVE_STATUS_UNSPECIFIED)`  
> **Deprecated:** `PlanResponse` wraps a single plan execution. It is maintained for backwards compatibility, but returning a `List[Plan]` is preferred for all new services to support batch generation.
* `parameter_data` (Optional[Dict[str, Any]]): Dictionary of `name: value` pairs for planned parameters.
* `parameter_names` (Optional[List[str]]): List of parameter names (used with `parameter_values`).
* `parameter_values` (Optional[List[Any]]): List of parameter values.
* `outcome` (Outcome): Indicates success/failure. Defaults to `Outcome.SUCCESS`.
* `error_string` (str): Optional error message.
* `objective_status` (ObjectiveStatus): Status of the target objective.


## Example Implementation
This example demonstrates a simple "Random Search" planner.
```Python
import random
from PyAres import AresPlannerService, PlanRequest, Plan, AresDataType, Outcome

def generate_plan(request: PlanRequest) -> list[Plan]:
    plans = []
    
    # Generate as many plans as ARES requested in request.batch_size
    for _ in range(request.batch_size):
        planned_values = {}
        for param in request.parameters:
            planned_values[param.name] = random.uniform(
                param.minimum_value, 
                param.maximum_value
            )
        
        # Construct an individual Plan
        plans.append(Plan(parameters=planned_values, outcome=Outcome.SUCCESS))
        
    return plans

if __name__ == "__main__":
    service = AresPlannerService(
        generate_plan, 
        "Random Search Planner", 
        "Picks random parameter values within bounds.", 
        "1.0.0"
    )

    service.add_supported_type(AresDataType.NUMBER)
    service.start()
```
  

   