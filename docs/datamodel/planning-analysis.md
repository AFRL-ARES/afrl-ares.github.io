---
sidebar_position: 5
title: Planning & Analysis
---

# Planning & Analysis (Closed-Loop)

The primary objective of ARES is to close the experimental loop autonomously. This requires two specialized services: **Analyzers** (which interpret data) and **Planners** (which decide what to do next based on that data).

---

## The Analyzer Lifecycle

An **Analyzer** is a data processing service. After an experiment finishes, ARES passes raw data outputs (such as images, spectra, or data tables) to the Analyzer. The Analyzer returns a standardized performance metric or scalar result.

```protobuf
message Analysis {
    float result = 1;              // The performance metric (e.g., efficiency, purity)
    Outcome analysis_outcome = 2;  // SUCCESS, FAILURE, WARNING, CANCELED
    optional string error_string = 3;
}
```

### Discovery & Capabilities

Analyzers describe their connection parameters and processing constraints through `AnalyzerInfo` and `AnalyzerCapabilities`.

```protobuf
message AnalyzerInfo {
    string unique_id = 1;
    string name = 2;
    string type = 3;
    string version = 5;
    AnalyzerCapabilities capabilities = 6;
}

message AnalyzerCapabilities {
    int64 timeout_seconds = 1;     // Maximum wait threshold
    AresStructSchema settings_schema = 2; // Operational knobs for the analyzer
}
```

---

## The Planner Lifecycle

A **Planner** is an optimization or machine learning algorithm (e.g., Bayesian Optimization, Genetic Algorithms, Grid Search). It accepts the history of parameters used in past experiments along with their corresponding analyzer results, and generates the inputs for the next batch of experiments.

### `PlanningRequest`

When ARES needs a new trial configuration, it sends a `PlanningRequest` to the assigned planner service:

```protobuf
message PlanningRequest {
    repeated PlanningParameter planning_parameters = 1; // Parameters to plan for
    AresStruct adapter_settings = 2;                    // Hyperparameters for the algorithm
    repeated double analysis_results = 3;               // Historical rewards/outputs
    RequestMetadata metadata = 4;
    PlanStatusCode previous_plan_status_code = 5;       // Did the last trial succeed or fault?
    int32 batch_size = 6;                               // Number of plans to generate
}
```

### Parameter Tracking: `PlanningParameter`

The planner receives the full search space bounds along with a historical log of what has been tried so far:

```protobuf
message PlanningParameter {
    string parameter_name = 1;
    optional double minimum_value = 2;
    optional double maximum_value = 3;
    repeated ParameterHistoryInfo parameter_history = 5; // Past trials
    AresDataType data_type = 6;
    bool is_planned = 8;
    bool is_result = 9;
    optional AresValue initial_value = 11;
}

message ParameterHistoryInfo {
    AresValue planned_value = 1;  // What the planner asked for
    optional AresValue achieved_value = 2; // What the hardware actually hit
}
```

### `PlanningResponse` & `Plan`

The planner replies with a collection of `Plans` matching the requested batch size:

```protobuf
message PlanningResponse {
    repeated Plan plans = 4;
}

message Plan {
    repeated PlannedParameter planned_parameters = 1; // The parameters chosen for a single trial
    Outcome planning_outcome = 2;
    optional string error_string = 3;
}

message PlannedParameter {
    string parameter_name = 1;
    AresValue parameter_value = 2; // The specific value chosen
}
```

---

## Manual Seeding: `ManualPlannerSeed`

Sometimes researchers don't want an algorithm to choose parameters; they want to run a specific list of user-defined vectors first (e.g., a custom matrix of 10 samples). ARES supports this through the **Manual Planner**. 

The manual planner is populated by seeding a specific queue:

```protobuf
message ManualPlannerSeed {
    oneof planner_stuff {
        ManualPlannerSetCollection planner_values = 1; // Structured table of points
        ManualPlannerFileLines file_lines = 2;         // Raw lines from a CSV/file
    }
}

message ManualPlannerSetCollection {
    repeated ManualPlannerSet planned_values = 1;
}

message ManualPlannerSet {
    repeated ParameterNameValuePair parameter_values = 1; // One single trial vector
}
```

---

## Auditing & Integrity: Transactions

Every call made to an external Planner or Analyzer is logged as a transaction record inside the ARES database. This ensures complete reproducibility.

```protobuf
message PlannerTransaction {
    string planner_id = 5;
    string planner_name = 2;
    PlanningRequest planning_request = 6;
    PlanningResponse planning_response = 7;
    google.protobuf.Timestamp time_request_sent = 8;
    google.protobuf.Timestamp time_response_received = 9;
}
```

---

## Remote Plugin Architecture

Just like devices, custom Planners and Analyzers are integrated into ARES via simple, lightweight gRPC contracts. To connect a custom Python machine learning algorithm, wrap it in a gRPC server that fulfills `AresRemotePlannerService`.

**`AresRemotePlannerService` RPCs:**
- `Plan`: Takes `PlanningRequest`, returns `PlanningResponse`.
- `GetPlannerServiceCapabilities`: Informs ARES of what data types and algorithms are supported.

**`AresRemoteAnalyzerService` RPCs:**
- `Analyze`: Takes `AnalysisRequest`, returns `Analysis`.
- `GetAnalyzerCapabilities`: Returns available schemas and settings.
