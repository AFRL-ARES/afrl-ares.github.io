---
sidebar_position: 9
title: Visualization
---

# Visualization Datamodel

The ARES ecosystem includes a visualization layer that allows researchers to monitor experiment progress and telemetry in real-time via charts and indicators. The visualization datamodel defines how these widgets are configured, how they map to device data, and how they are persisted in the dashboard layout.

---

## Chart Styles: `ChartStyle`

ARES supports several different ways to represent data visually:

| Style | Description |
| :--- | :--- |
| `LINE` / `SPLINE` | Time-series data plots for continuous readings. |
| `AREA` | Shaded area charts for cumulative or bounded data. |
| `COLUMN` | Bar charts for categorical or discrete comparisons. |
| `GAUGE` | Circular or linear gauges for real-time scalar values (e.g., pressure, voltage). |
| `TEXT_INDICATOR` | Large-format numeric or status text display. |

---

## Widget Configuration: `DeviceVisualizationConfig`

Each chart or indicator on the ARES dashboard is defined by a `DeviceVisualizationConfig`. This includes the mapping to data sources, the visual style, and its physical position in the grid layout.

```protobuf
message DeviceVisualizationConfig {
    optional string unique_id = 1;
    repeated VisualizationPath paths = 3; // Source data mappings
    ChartStyle style = 4;
    
    // Refresh Logic
    int32 polling_rate = 5;            // Update frequency in ms
    int32 number_display_points = 6;   // Buffer size for time-series charts
    
    // UI Metadata
    bool show_data_labels = 7;
    bool show_markers = 8;
    string chart_title = 13;
    
    // GridStack Persistence (Layout)
    int32 grid_x = 9;  // Column position
    int32 grid_y = 10; // Row position
    int32 grid_w = 11; // Width
    int32 grid_h = 12; // Height
}
```

---

## Data Mapping: `VisualizationPath`

A `VisualizationPath` defines the exact link between a UI widget and a property on a physical device.

```protobuf
message VisualizationPath {
    string associated_device_id = 4; // Source device
    string path = 1;                 // Dot-notation path to a field (e.g., "Sensors.Temperature")
    AresDataType data_type = 2;      // The primitive type of the data
    bool is_plottable = 3;           // Hint for the UI if this is a numeric series
}
```

---

## Visualizer Capabilities

Just like Planners and Analyzers, custom **Visualizers** can be registered as adapters.

* **`VisualizerInfo`**: Basic identity, name, version, and connection URL.
* **`VisualizerCapabilities`**: Informs ARES of the settings schema (`AresStructSchema`) required to configure the visualizer (e.g., color palettes, axes limits, or smoothing factors).
