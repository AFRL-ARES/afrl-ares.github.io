---
sidebar_position: 4
title: Analyzers
---

# Creating Analyzers
Analyzers are the eyes of your laboratory. They take raw data such as images from a camera or logs from a sensor and process them to determine the result of an experiment.

## The Core Concept
An Analyzer sits in the loop to answer the question: "_Did this experiment work, and what was the result?_"
* **Input:** A dictionary of data points (defined by you).
* **Output:** An `Analysis` object containing the result value and a status flag indicating if the calculation completed successfully.

**Important:** The Analyzer does not decide if the experiment passed or failed. It only reports the data. ARES is responsible for checking that data against your experiment's Stop Conditions (if applicable).

## Key Classes
### `AresAnalyzerService`
#### **Initialization (`__init__`)**
Arguments required to create an instance of the service:
* `custom_analysis_logic`: A callable function that will be execute when an Analysis request is received. This function should accept an AnalysisRequest object and return an Analysis object (or an awaitable that resolves to one).
* `name` (str): The name of your analyzer.
* `version` (str): The version of your analyzer.
* `description` (str): A brief description of your analyzer.
* `use_localhost` (bool): If true, binds to localhost. Otherwise binds to [::]
* `port (int)`: The port your analyzer service will serve on. Defaults to port 7083.
* `max_message_size` (int): The max size, in megabytes, of the messages your Analysis service is capable of sending and receiving. Increasing this can help transfer large amounts of data for things like images, but may result in some loss in performance. 

This service is the main wrapper for your analyzer, giving you the bridge to connect to ARES.

#### Methods
* `add_analysis_parameter(name, type)`: Tells ARES what data this analyzer expects to receive. For example, if you are analyzing a print, you might request parameters like `"LayerHeight"` or `"CameraImage"`
* `add_setting(setting_name, setting_type, optional, constraints)`: Adds a setting that is configurable in ARES via the analyzer settings menu.
* `start(wait_for_termination)`: Starts your analysis service and begins listening for requests. 
    * **If `True` (Default)**: The call **blocks** the main thread, keeping your program running indefinitely. This is necessary for standalone scripts; without it the backgrounds gRPC threads would die as soon as the script finishes.
    * **If `False`**: The call returns immediately. This allows you to run other code, but it becomes **your responsibility** to keep the program alive (e.g. via a GUI loop or `while` loop).
* `stop()`: Stops your analysis service, terminating the connection. 


#### Objects
`AnalysisRequest`
* `request.inputs`: A dictionary containing the data sent from ARES.

`Analysis(result, outcome)`: The object you must return from your custom analysis logic.
* `result`: The calculated metric (e.g., `95.5`).
* `outcome`: An `Outcome` Enum indicating if the code ran successfully (e.g., `SUCCESS` or `FAILURE`).

## Example Implementation
```Python
from PyAres import AresAnalyzerService, AnalysisRequest, Analysis, AresDataType, Outcome

def analyze_sample(request: AnalysisRequest) -> Analysis:
    # 1. Extract inputs
    # 'Growth_Metric' would come from a sensor
    raw_value = request.inputs.get("Growth_Metric")

    if raw_value is None:
        return Analysis(result=0.0, Outcome = Outcome.FAILURE)
    
    # 2. Perform Logic
    print(f"Analyzing sample with value: {raw_value}")
    
    calculated_score = raw_value * 1.5 # Placeholder logic
    is_success = calculated_score > 10.0 # Define success criteria
    
    # 3. Return Result
    return Analysis(result=calculated_score, outcome=Outcome.SUCCESS)

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