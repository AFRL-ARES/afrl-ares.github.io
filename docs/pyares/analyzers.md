---
sidebar_position: 4
title: Analyzers
---

# Creating Analyzers
Analyzers are the eyes of your laboratory. They take raw data such as images from a camera or logs from a sensor and process them to determine the result of an experiment.

## The Core Concept
An Analyzer sits in the loop to answer the question: "_Did this experiment work, and what was the result?_"
* **Input:** A dictionary of data points (defined by you).
* **Output:** An `AnalysisResult` object containing the result value and a status flag indicating if the calculation completed successfully.

**Important:** The Analyzer does not decide if the experiment passed or failed. It only reports the data. ARES is responsible for checking that data against your experiment's Stop Conditions (if applicable).

## Key Classes
### `AresAnalyzerService`
#### **Initialization (`__init__`)**
Arguments required to create an instance of the service:
* `custom_analysis_logic`: A callable function that will be executed when an Analysis request is received. This function should accept an `AnalysisRequest` object and return an `AnalysisResponse` object (or an awaitable that resolves to one).
* `name` (str): The name of your analyzer.
* `version` (str): The version of your analyzer.
* `description` (str): A brief description of your analyzer.
* `timeout` (int): The amount of time, in seconds, ARES will wait to receive a response from this service. Defaults to 30.
* `use_localhost` (bool): If true, binds to localhost. Otherwise binds to [::]
* `port` (int): The port your analyzer service will serve on. Defaults to port 7083.
* `max_message_size` (int): The max size, in megabytes, of the messages your Analysis service is capable of sending and receiving. Increasing this can help transfer large amounts of data for things like images, but may result in some loss in performance. 

This service is the main wrapper for your analyzer, giving you the bridge to connect to ARES.

#### Methods
* `add_analysis_parameter(parameter_name, parameter_type, optional=False, struct_schema=None)`: Tells ARES what data this analyzer expects to receive. For example, if you are analyzing a print, you might request parameters like `"LayerHeight"` or `"CameraImage"`.
* `add_setting(setting_name, setting_type, default_value=None, optional=True, constraints=[], struct_schema=None, limits=None, description=None)`: Adds a setting that is configurable in ARES via the analyzer settings menu.
* `set_timeout(new_timeout)`: Dynamically sets a new timeout value in seconds for ARES to wait for responses.
* `start(wait_for_termination)`: Starts your analysis service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the background gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your analysis service, terminating the connection. 


#### Objects
`AnalysisRequest`
* `request.inputs`: A dictionary containing the input data sent from ARES.
* `request.settings`: A dictionary containing configured setting values for this analyzer.
* `request.request_metadata`: A `RequestMetadata` object containing campaign name, id, experiment id, etc.

`AnalysisResponse(result, outcome=Outcome.SUCCESS, error_string="")`: The object you must return from your custom analysis logic.
* `result`: The calculated metric represented as a float (e.g., `95.5`).
* `outcome`: An `Outcome` Enum indicating if the code ran successfully (e.g., `Outcome.SUCCESS` or `Outcome.FAILURE`).
* `error_string`: An optional string specifying why an analysis failed.

## Example Implementation
```Python
from PyAres import AresAnalyzerService, AnalysisRequest, AnalysisResponse, AresDataType, Outcome

def analyze_sample(request: AnalysisRequest) -> AnalysisResponse:
    # 1. Extract inputs
    # 'Growth_Metric' would come from a sensor
    raw_value = request.inputs.get("Growth_Metric")

    if raw_value is None:
        return AnalysisResponse(result=0.0, outcome=Outcome.FAILURE, error_string="Growth_Metric missing")
    
    # 2. Perform Logic
    print(f"Analyzing sample with value: {raw_value}")
    
    calculated_score = raw_value * 1.5 # Placeholder logic
    
    # 3. Return Result
    return AnalysisResponse(result=calculated_score, outcome=Outcome.SUCCESS)

if __name__ == "__main__":
    service = AresAnalyzerService(
        analyze_sample, 
        "Growth Analyzer", 
        "0.1.0", 
        "Calculates growth viability"
    )

    # Define what data we need from ARES
    service.add_analysis_parameter("Growth_Metric", AresDataType.NUMBER)

    service.start()
```