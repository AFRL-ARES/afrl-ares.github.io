---
sidebar_position: 7
title: Testing Your Services
---

# Testing Your PyAres Services
Before deploying your Planners and Analyzers to a live ARES environment, you can use the built-in `test_tools` suite to verify your logic locally. This suite provides mock clients that simulate the gRPC requests ARES sends.

## The Test Clients
PyAres includes specialized clients for both Analyzers and Planners. These are located in `PyAres.test_tools`.

### `AnalyzerTestClient`
Use this to test your `AresAnalyzerService`.

#### Methods
* `__init__(port=7083, host='localhost')`: Connects to your running service.
* `check_status()`: Verifies the gRPC connection is alive.
* `get_info()`: Prints the name, version, and description reported by your service.
* `run_analysis(inputs, settings={})`: Sends a mock analysis request and prints the result or error.

#### Example Test Script
```python
from PyAres.test_tools import AnalyzerTestClient

if __name__ == "__main__":
    # Ensure your Analyzer script is already running in another terminal!
    client = AnalyzerTestClient(port=7083)
    
    # 1. Check Connectivity
    client.check_status()
    client.get_info()

    # 2. Test your analysis logic with sample data
    sample_inputs = {
        "Temperature": 130.5
    }
    client.run_analysis(inputs=sample_inputs)
```

### `PlannerTestClient`
Use this to test your `AresPlannerService`.

#### Methods
* `__init__(port=7082, host='localhost')`: Connects to your running service.
* `check_status()`: Verifies the gRPC connection is alive.
* `get_info()`: Prints the name, version, and description reported by your service.
* `run_planning(request)`: Sends a `PlanRequest` and returns a `PlanResponse`.

#### Example Test Script
```python
from PyAres import PlanRequest, PlanningParameter, AresDataType, ParameterHistoryItem
from PyAres.test_tools import PlannerTestClient

if __name__ == "__main__":
    # Ensure your Planner script is running!
    client = PlannerTestClient(port=7082)

    # 1. Create Mock Data
    params = [
        PlanningParameter(
            name="Pressure",
            minimum_value=0,
            maximum_value=1000,
            param_history=[ParameterHistoryItem(500, 498)],
            data_type=AresDataType.NUMBER,
            is_planned=True,
            is_result=False,
            planner_name="Random Planner"
        )
    ]
    
    # 2. Run Test
    request = PlanRequest(parameters=params, settings={}, analysis_results=[0.95])
    response = client.run_planning(request)
    print(f"Planner suggested: {response.parameter_values}")
```

## Why Use Test Tools?
1. **Speed:** Test your logic in seconds without launching the full ARES OS.
2. **Safety:** Debug hardware command logic or complex planning algorithms safely using mock inputs.
3. **Automation:** These clients can be integrated into standard Python `pytest` suites for continuous integration.
