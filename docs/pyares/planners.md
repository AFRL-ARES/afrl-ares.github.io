---
sidebar_position: 4
title: Planners
---

# Creating Planners
Planners are the brain of your laboratory. They reside at the top of the loop, deciding _what to do next_ based on previous results.

## The Core Concept
A Planner is responsible for choosing your next experiment parameters. It receives the current parameter space (min/max constraints) and generates the specific settings for the next experiment iteration. Modern planners can also take into account analysis objectives, previous plan outcomes, and batch requests for multiple plans at once.

## Key Classes
### `AresPlannerService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `custom_plan_logic`: A callable function that will be executed when a `PlanRequest` is received. This function should accept a `PlanRequest` object and return either:
  * a `PlanResponse` object (or an awaitable that resolves to one) for backward-compatible single-plan usage, or
  * a `List[Plan]` (or awaitable resolving to a list of `Plan`) for modern, batch-capable planners.
* `service_name` (str): The name associated with your planner service.
* `service_description` (str): A brief description of your planner service and its capabilities.
* `service_version` (str): The version associated with your planner service.
* `timeout` (int): The amount of time, in seconds, ARES will wait to receive responses from your planner service. Defaults to 30.
* `use_localhost` (bool): An optional value that allows the user to specify whether to host the service on the local network or remote (if remote, it will listen to all addresses). _Defaults to True._
* `port` (int): The port that your planner service will serve on. _Defaults to port 7082._
* `max_message_size` (int): The max size, in megabytes, of the messages your planning service is capable of sending. Increasing this can help transfer heavy data like images, but may result in some loss in performance.
* `multi_objective_capable` (bool): Indicates whether your planner is capable of planning over multiple analysis objective values. Set this to `True` if your planner uses multi-objective data coming from analyzers. _Defaults to False._

This service is the main wrapper for your planners, giving you the bridge to connect your planning logic to ARES.

#### Methods
* `add_planner_option(planner_name, planner_description, planner_version)`: Tells ARES that this planner is available via this planning service. All planning services should host at least one planner, but can host as many as desired.
* `add_supported_type(type)`: Defines what kind of data this planner can handle (e.g., Numbers or Booleans) using the `AresDataType` class.
* `add_setting(setting_name, setting_type, default_value=None, optional=True, constraints=None, struct_schema=None, list_element_schema=None, limits=None, description=None)`: Adds a setting that is configurable in ARES via the planner settings menu. When `setting_type` is a struct or list type, `struct_schema` and/or `list_element_schema` can be provided to describe the shape of the setting. `constraints` and `limits` can be used to restrict allowed values.
* `set_timeout(new_timeout)`: Sets the amount of time, in seconds, that ARES will wait to receive responses from your planner service.
* `start(wait_for_termination)`: Starts your planner service and begins listening for requests.
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the background gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your planner service, terminating the connection.

If `custom_plan_logic` raises an exception, the service catches it, reports an `INTERNAL` error code back to ARES, and returns a failure planning response with the error message populated. This keeps ARES informed even when user code fails.

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
    * `data_type` (AresDataType): An `AresDataType` representing what kind of data this parameter is. Common examples are NUMBER and STRING.
    * `is_planned` (bool): Represents whether this parameter is designed to be planned for.
    * `is_result` (bool): Represents whether this parameter is the intended result of the experiment.
    * `planner_name` (str): The name of the planner this variable is to be planned by.
    * `initial_value` (Any): An optional initial value provided through the ARES UI.
* `parameter_names` (List[str]): Shortcut property returning a list of all parameter names in the request.
* `planned_parameter_table` (List[List[Any]]): Property returning tables of historical planned values.
* `acheived_parameter_table` (List[List[Any]]): Property returning tables of historical achieved values. _Note: the attribute name is spelled `acheived_parameter_table` in the current API for backward compatibility._
* `settings` (Dict): A dictionary that contains the current settings configured for your planner. If, for instance, you have a setting called "seed" you could access it by calling `request.settings.get("seed")` (using `get` is safer and generally best practice).
* `analysis_results` (List[float], deprecated): A deprecated list of floats representing previous analyzer responses (if any). Accessing this property emits a deprecation warning; new planners should use `analysis_data` / `analysis_objectives` instead.
* `batch_size` (int): The number of plans ARES is requesting from this planner. You may choose to honor this by returning a list of `Plan` objects of this length.
* `previous_plan_status_codes` (List[PlanStatusCode]): A list of status codes associated with previously planned experiments, allowing planners to react to prior outcomes.
* `analysis_data` (List[AnalysisDataEntry]): Structured analysis data for past experiments in the current batch. Each entry contains analyzer-produced objectives.
* `analysis_objectives` (List[List[Objective]]): Convenience property that returns a list of objective lists, one per experiment, derived from `analysis_data`.
* `request_metadata` (RequestMetadata): This object passes basic data about the request and the context around it for your use.
    * `system_name` (str): This is the name associated with the system sending this request (likely ARES).
    * `campaign_name` (str): The name of the running campaign that requested this plan.
    * `campaign_id` (str): The unique ID of the campaign that requested this plan.
    * `experiment_id` (str): The unique ID of the experiment that request this plan.
    * `experiment_start_time` (str): The start time of the current experiment, as reported by ARES.

`PlanningParameter`
* Represents a single parameter within a planning request, exposed in Python as a more user-friendly abstraction than the raw protobuf message. The fields mirror the bullets above (`name`, `minimum_value`, `maximum_value`, `param_history`, `data_type`, `is_planned`, `is_result`, `planner_name`, `initial_value`).

`AnalysisDataEntry`
* Represents the analysis data for a single experiment in a planning batch.
* `analysis_objectives` (List[Objective]): A list of analyzer-produced `Objective` instances for that experiment.

`Objective` (from analyzers)
* `objective_name` (str): The name associated with this objective.
* `objective_value` (Any): The value calculated by the analyzer.
* `objective_metadata` (Dict[str, Any]): Optional metadata associated with this objective (such as units, thresholds, etc.).

`PlanResponse(names, values)`
* `parameter_names` (List[str]): The list of names associated with your parameters.
* `parameter_values` (List[Any]): The list of values associated with your parameters.
* `parameter_data` (Dict[str, Any]): A dictionary of values that represents your planning data. When provided, it is used to populate `parameter_names` and `parameter_values`.
* `outcome` (Outcome): An enum of type `Outcome` that determines whether the planning process succeeded or not, defaults to `Outcome.SUCCESS`.
* `error_string` (str): An optional string for specifying planning failure reasons that are relayed to ARES.
* `objective_status` (ObjectiveStatus): An enum describing the status of the objective your planner is trying to achieve (if any), such as `OBJECTIVE_UNACHIEVED`, `OBJECTIVE_ACHIEVED`, or `OBJECTIVE_FAILED`.

When constructing a `PlanResponse`, you must provide either `parameter_data` **or** both `parameter_names` and `parameter_values`. If both are omitted, or if `parameter_names` and `parameter_values` are of different lengths, a `ValueError` is raised.

`PlannedParameter`
* A simple key/value pair representing a single planned parameter.
* `parameter_name` (str): The name of the planned parameter.
* `parameter_value` (Any): The value assigned by the planner.

`Plan`
* Represents a single plan to be executed by ARES.
* `planned_parameters` (List[PlannedParameter]): The list of planned parameters for this plan.
* `outcome` (Outcome): The outcome of the planning process for this plan.
* `error_string` (str): Optional error description if planning failed for this plan.
* `objective_status` (ObjectiveStatus): The status of the objective this plan is associated with (if any).

Modern planners are encouraged to implement `custom_plan_logic` so that it returns a `List[Plan]` (or awaitable resolving to one), especially when using `batch_size` or multi-objective data. Returning a single `PlanResponse` remains supported for backward compatibility and is treated internally as a single-plan response.

## Example Implementation
This example demonstrates a simple "Random Search" planner using the legacy `PlanResponse` return type. It is still valid, but new planners may prefer returning a list of `Plan` objects instead.
```Python
from PyAres import AresPlannerService, PlanRequest, PlanResponse, AresDataType, Outcome
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

    # Alternatively, you could populate names and planned_values into a dictionary
    # that is provided to the parameter_data argument
    return PlanResponse(parameter_names=names, parameter_values=planned_values, outcome=Outcome.SUCCESS)

if __name__ == "__main__":
    service = AresPlannerService(
        generate_plan,
        "Random Search Planner",
        "This planner picks random values within bounds.",
        "1.0.0",
    )

    # Tell ARES we can plan for Numeric values
    service.add_supported_type(AresDataType.NUMBER)

    service.start()
```

## Using Analyzer Objectives in Planners

Analyzers and planners are connected through objectives. An analyzer reports objective values in its `AnalysisResponse`, and ARES passes those values into your planner requests so you can adapt future plans based on past results.

On the analyzer side:
* Your analyzer declares its outputs with `add_objective_output(objective_name, objective_type, ...)`.
* It returns an `AnalysisResponse` with one or more `Objective` instances in the `objectives` list.

On the planner side, the same data appears in `PlanRequest`:
* `analysis_data` (List[AnalysisDataEntry]): One entry per experiment in the planning batch.
* Each `AnalysisDataEntry` exposes `analysis_objectives: List[Objective]` for that experiment.
* `analysis_objectives` (List[List[Objective]]): Convenience property on `PlanRequest` that returns a list of objective lists, one per experiment.

A simple pattern for using these objectives in a planner might look like this:

```Python
from PyAres import PlanRequest, Plan, PlannedParameter, Outcome

def generate_plan(request: PlanRequest) -> List[Plan]:
    # Look at the last experiment's objectives (if any)
    last_growth_score = None
    if request.analysis_objectives:
        for obj in request.analysis_objectives[-1]:
            if obj.objective_name == "growth_score":
                last_growth_score = obj.objective_value

    # Use last_growth_score (if present) to adjust your next parameter values
    planned_parameters = []
    for param in request.parameters:
        new_value = param.minimum_value
        if last_growth_score is not None:
            # Example: push the parameter upward if growth_score is low
            span = param.maximum_value - param.minimum_value
            factor = max(0.0, min(1.0, 1.0 - last_growth_score))
            new_value = param.minimum_value + span * factor

        planned_parameters.append(PlannedParameter(param.name, new_value))

    plan = Plan(planned_parameters=planned_parameters, outcome=Outcome.SUCCESS)
    return [plan]
```

For multi-objective planners, set `multi_objective_capable=True` when constructing `AresPlannerService`. This lets ARES know your planner expects and can leverage multiple analyzer objectives when producing plans.
