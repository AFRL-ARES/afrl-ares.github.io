---
sidebar_position: 5
title: Analyzers
---

# Creating Analyzers
Analyzers are the eyes of your laboratory. They take raw data (which can include data from a planner) such as images from a camera or logs from a sensor and process them to determine the result of an experiment.

## The Core Concept
An Analyzer sits in the loop to answer the question: "Did this experiment work, and what was the result?"
* **Input:** A dictionary of data points (defined by you).
* **Output:** An `AnalysisResponse` object containing one or more objectives plus a status flag indicating if the calculation completed successfully.

**Important:** The Analyzer does not decide if the experiment passed or failed. It only reports the data. ARES is responsible for checking that data against your experiment's Stop Conditions (if applicable).

## Key Classes
### `AresAnalyzerService`
#### Initialization (`__init__`)
Arguments required to create an instance of the service:
* `custom_analysis_logic`: A callable function that will be executed when an analysis request is received. This function should accept an `AnalysisRequest` object and return an `AnalysisResponse` object (or an awaitable that resolves to one).
* `name` (str): The name of your analyzer.
* `version` (str): The version of your analyzer.
* `description` (str): A brief description of your analyzer.
* `timeout` (int): The amount of time, in seconds, ARES will wait to receive a response from this service. Defaults to 30.
* `use_localhost` (bool): If `True`, binds to localhost. Otherwise binds to `[::]`, which is all IP addresses that exist on the computer the service is running on.
* `port` (int): The port your analyzer service will serve on. Defaults to port 7083.
* `max_message_size` (int): The max size, in megabytes, of the messages your analysis service is capable of sending and receiving. Increasing this can help transfer large amounts of data for things like images, but may result in some loss in performance.

This service is the main wrapper for your analyzer, giving you the bridge to connect to ARES.

If `custom_analysis_logic` raises an exception, the service catches it, reports an `INTERNAL` error code back to ARES, and returns a failure analysis response with the error message populated. This keeps ARES informed even when user code fails.

#### Methods
* `add_analysis_parameter(parameter_name, parameter_type, optional=False, struct_schema=None, list_element_schema=None)`: Tells ARES what data this analyzer expects to receive. For example, if you are analyzing a print, you might request parameters like `"LayerHeight"` or `"CameraImage"`. When `parameter_type` is a list type, `list_element_schema` can be used to describe the shape of each list element.
* `add_objective_output(objective_name, objective_type, objective_description="", optional=False, struct_schema=None, list_element_schema=None)`: Declares an analysis objective that this analyzer can produce, including its type and an optional description. This schema is advertised to ARES so other components (like planners) know what objective data to expect.
* `add_setting(setting_name, setting_type, default_value=None, optional=True, constraints=None, struct_schema=None, list_element_schema=None, limits=None, description=None)`: Adds a setting that is configurable in ARES via the analyzer settings menu. When `setting_type` is a struct or list type, `struct_schema` and/or `list_element_schema` can be provided to describe the shape of the setting. `constraints` and `limits` can be used to restrict allowed values.
* `set_timeout(new_timeout)`: Dynamically sets a new timeout value in seconds for ARES to wait for responses.
* `start(wait_for_termination)`: Starts your analysis service and begins listening for requests.
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the background gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (for example via a GUI loop or `while` loop).
* `stop()`: Stops your analysis service, terminating the connection.
* `get_objective_schema() -> List[ObjectiveSchema]`: Returns a Python representation of the configured objective schema, useful for introspection or dynamic behavior.

#### Objects
`AnalysisRequest`
* `request.inputs` (Dict[str, Any]): A dictionary containing the input data sent from ARES.
* `request.settings` (Dict[str, Any]): A dictionary containing configured setting values for this analyzer.
* `request.request_metadata` (RequestMetadata): A `RequestMetadata` object containing campaign name, id, experiment id, and other contextual information.

`AnalysisResponse`
The object you must return from your custom analysis logic.

Preferred usage (multi-objective):
* `AnalysisResponse(objectives=[Objective(...), ...], outcome=Outcome.SUCCESS, error_string="")`
    * `objectives` (List[Objective]): A list of objective values calculated by your analyzer.
    * `outcome` (Outcome): An `Outcome` Enum indicating if the code ran successfully (for example, `Outcome.SUCCESS` or `Outcome.FAILURE`).
    * `error_string` (str): An optional string specifying why an analysis failed.

Deprecated usage (single numeric result):
* `AnalysisResponse(result=0.0, outcome=Outcome.SUCCESS, error_string="")`
    * `result` (float): A single numeric result value. When you construct an `AnalysisResponse` using `result`, it is wrapped internally into a default objective and a deprecation warning is emitted. This form will be removed in a future major version; new analyzers should prefer the `objectives` form.

Additional properties:
* `deprecated_result_usage` (bool): Indicates whether this `AnalysisResponse` was created via the deprecated `result` parameter.

`Objective`
Represents a single analysis objective in the new `AnalysisResponse` model.
* `objective_name` (str): The name associated with this objective.
* `objective_value` (Any): The value calculated by the analyzer.
* `objective_metadata` (Dict[str, Any]): Optional metadata associated with this objective (such as units, thresholds, region of interest information, etc.).

`ObjectiveSchema`
Represents the expected form of an objective as advertised by your analyzer via `add_objective_output`.
* `objective_name` (str): Name of the objective.
* `objective_type` (AresDataType): The data type associated with the objective.
* `objective_description` (str): Human-readable description of what the objective represents.
* `optional` (bool): Whether this objective is optional.
* `struct_schema` / `list_element_schema`: Optional nested schemas describing the structure of complex objective values.

## Example Implementation
This example demonstrates a simple analyzer using the deprecated single-result pattern. It is still supported today, but new analyzers should prefer returning explicit `Objective` objects.
```Python
from PyAres import AresAnalyzerService, AnalysisRequest, AnalysisResponse, AresDataType, Outcome, Objective

def analyze_sample(request: AnalysisRequest) -> AnalysisResponse:
    # 1. Extract inputs
    # 'Growth_Metric' would come from a sensor
    raw_value = request.inputs.get("Growth_Metric")

    if raw_value is None:
        # Deprecated path using `result` for simplicity
        return AnalysisResponse(result=0.0, outcome=Outcome.FAILURE, error_string="Growth_Metric missing")
    
    # 2. Perform Logic
    print(f"Analyzing sample with value: {raw_value}")
    calculated_score = raw_value * 1.5  # Placeholder logic
    
    # 3. Return Result as an Objective (preferred pattern)
    objective = Objective(
        objective_name="growth_score",
        objective_value=calculated_score,
        objective_metadata={"units": "arbitrary"},
    )
    return AnalysisResponse(objectives=[objective], outcome=Outcome.SUCCESS)

if __name__ == "__main__":
    service = AresAnalyzerService(
        analyze_sample,
        "Growth Analyzer",
        "0.1.0",
        "Calculates growth viability",
    )

    # Define what data we need from ARES
    service.add_analysis_parameter("Growth_Metric", AresDataType.NUMBER)

    # Advertise the objective this analyzer will produce
    service.add_objective_output(
        objective_name="growth_score",
        objective_type=AresDataType.NUMBER,
        objective_description="Growth viability score",
    )

    service.start()
```

## How Analyzers and Planners Work Together

Analyzers and planners are connected through objectives. The high-level flow looks like this:

1. Your analyzer receives an `AnalysisRequest` and returns an `AnalysisResponse` that contains one or more `Objective` instances.
2. ARES records those objectives as part of the experiment history.
3. When a planner is invoked, those same objectives are made available on the planner side via `PlanRequest.analysis_data` (as a list of `AnalysisDataEntry` objects) and the convenience property `PlanRequest.analysis_objectives`.

On the planner side:
* `PlanRequest.analysis_data` is a list where each element represents one experiment in the planning batch.
* Each `AnalysisDataEntry` contains an `analysis_objectives` list with the `Objective` instances produced by your analyzer for that experiment.
* `PlanRequest.analysis_objectives` returns the same information as a `List[List[Objective]]` for easier iteration.

This means you can use analyzer outputs to guide planning directly. For example, a planner can look at the most recent objective value:

```Python
# Inside your planner custom_plan_logic(request: PlanRequest)
if request.analysis_objectives:
    # Get objectives for the most recent experiment in the batch
    last_experiment_objectives = request.analysis_objectives[-1]
    for obj in last_experiment_objectives:
        if obj.objective_name == "growth_score":
            print(f"Last growth_score: {obj.objective_value}")
            # Use this to adjust your next plan
```

To make this work end-to-end:
* Your analyzer must declare and populate objectives via `add_objective_output(...)` and `AnalysisResponse(objectives=[...])`.
* Your planner should set `multi_objective_capable=True` when constructing `AresPlannerService` if it plans over multiple objectives.
