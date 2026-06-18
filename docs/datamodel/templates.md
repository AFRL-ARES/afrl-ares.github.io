---
sidebar_position: 3
title: Templates & Campaigns
---

# Templates & Campaign Architecture

In ARES, experiments are not hard-coded scripts. Instead, they are defined as hierarchical **Templates**. These templates represent the abstract structure of a research workflow, allowing ARES to dynamically resolve parameters, allocate planners, and orchestrate hardware commands.

---

## Hierarchical Composition

The ARES campaign structure follows a strict hierarchy of templates:

1. **`CampaignTemplate`**: The top-level container for a research objective.
2. **`ExperimentTemplate`**: A single trial definition (e.g., a "Run" or "Sample").
3. **`StepTemplate`**: A logical grouping of commands within an experiment that can run sequentially or in parallel.
4. **`CommandTemplate`**: An abstract request for a specific device to perform an action.

### `CampaignTemplate`

The `CampaignTemplate` defines the scope of the entire automated loop. It includes a startup phase, the core experimental trial phase, and a closeout phase.

```protobuf
message CampaignTemplate {
    optional string unique_id = 1;
    string name = 2;
    
    // Core Workflow Phases
    ExperimentTemplate startup_template = 2;
    ExperimentTemplate experiment_template = 3; // The trial that repeats
    ExperimentTemplate closeout_template = 4;
    
    // Planning & Variables
    repeated ParameterMetadata plannable_parameters = 6;
    repeated planning.PlannerAllocation planner_allocations = 7;
}
```

---

## The Execution Unit: `ExperimentTemplate`

An `ExperimentTemplate` is composed of multiple `StepTemplates`. It also defines how an **Analyzer** should process the results of the experiment.

```protobuf
message ExperimentTemplate {
    optional string unique_id = 1;
    string name = 2;
    repeated StepTemplate step_templates = 2;
    
    // Analysis Mapping
    optional string analyzer_id = 4;
    map<string, string> analyzer_maps = 5; // Maps variable names to analyzer inputs
}
```

### Steps and Parallelism

A **Step** is a collection of commands. The `is_parallel` flag determines if ARES should fire all commands in the step simultaneously or wait for each to complete before starting the next.

```protobuf
message StepTemplate {
    string name = 2;
    bool is_parallel = 3;
    repeated CommandTemplate command_templates = 4;
}
```

---

## Commands & Dynamic Parameters

### `CommandTemplate`

A command is the smallest executable entity. It references a `CommandMetadata` (which defines what the hardware *can* do) and provides the actual `Parameter` values or sources.

```protobuf
message CommandTemplate {
    optional string unique_id = 1;
    CommandMetadata metadata = 2;
    repeated Parameter parameters = 3;
    optional string output_var_name = 5; // Assigns the command result to a variable
}
```

### Parameter Sourcing: `Parameter`

The most powerful feature of the ARES datamodel is the ability to source parameters dynamically. A `Parameter` value can come from several different sources resolved at runtime:

```protobuf
message Parameter {
    oneof source {
        LiteralParameterSource literal_source = 10;           // A fixed, hardcoded value
        PlannedParameterSource planned_source = 11;           // Provided by an AI/ML Planner
        EnvironmentParameterSource environment_source = 12;   // System/Campaign variables
        CommandVariableParameterSource command_variable_source = 13; // Output of a previous command
    }
}
```

#### Parameter Sources Explained

| Source | Description |
| :--- | :--- |
| **Literal** | A static value (e.g., "Set temperature to 500"). |
| **Planned** | A value determined by a `Planner` service based on previous trial results. |
| **Environment** | Contextual variables like `CAMPAIGN_RESULT_PATH` or `EXPERIMENT_NUMBER`. |
| **Variable** | The output result of a previous command in the same experiment (e.g., "Use the weight measured in Step 1"). |

---

## Metadata and Constraints

### `ParameterMetadata`

Metadata defines the "rules" for a parameter, such as its name, physical units, and constraints. Planners use this metadata to understand the valid search space.

```protobuf
message ParameterMetadata {
    string name = 2;
    string unit = 3;
    repeated Limits constraints = 4; // Min/Max bounds
    optional AresValueSchema schema = 9;
    bool not_plannable = 7; // If true, planners will ignore this field
    optional AresValue initial_value = 12;
}
```
