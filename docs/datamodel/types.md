---
sidebar_position: 2
title: Core Type System
---

# Core Type System

ARES operates across diverse physical environments with highly varied instrument interfaces. To prevent recompiling software when adding new hardware or experimental variables, ARES implements a custom, highly expressive runtime type system.

This type system is defined primarily across `ares_struct.proto`, `ares_data_type.proto`, `ares_quantity_type.proto`, `ares_data_schema.proto`, and `ares_dataset.proto`.

---

## Primitive and Composite Types: `AresDataType`

The `AresDataType` enum identifies the fundamental data primitives and structures supported within the ecosystem:

| Value | Name | Description |
| :--- | :--- | :--- |
| `0` | `UNSPECIFIED_TYPE` | Default uninitialized type indicator. |
| `1` | `NULL` | Represents empty or missing values. |
| `2` | `BOOLEAN` | Standard boolean (`true` / `false`). |
| `3` | `STRING` | UTF-8 encoded text string. |
| `4` | `NUMBER` | Double-precision floating point scalar. |
| `5` | `STRING_ARRAY` | Ordered list of text strings. |
| `6` | `NUMBER_ARRAY` | Ordered list of double-precision floats. |
| `7` | `LIST` | Ordered list of heterogeneous `AresValue` nodes. |
| `8` | `STRUCT` | Nested key-value map (`AresStruct`). |
| `9` | `BYTE_ARRAY` | Arbitrary raw binary data blobs. |
| `10` | `ANY` | Wildcard type bypass indicator. |
| `11` | `UNIT` | Empty placeholder value (AresScript internal). |
| `12` | `FUNCTION` | Reference identifier to an invocable routine. |
| `13` | `QUANTITY` | Scalar associated with physical dimensions and a unit string. |
| `14` | `TIMESTAMP` | Temporal point identifier (UTC). |
| `15` | `FLOAT` | Double-precision alias (or single-precision mapping). |
| `16` | `INT` | 64-bit signed integer. |
| `17` | `INT_ARRAY` | Ordered list of 64-bit integers. |
| `18` | `FLOAT_ARRAY` | Ordered list of floats. |

---

## Self-Describing Data Containers

### `AresStruct` and `AresValue`

An `AresStruct` is an uncompiled dictionary structure mapping string keys to arbitrary `AresValue` instances. This forms the standard payload format for command arguments, device telemetry, and planner parameters.

```protobuf
message AresStruct {
    map<string, AresValue> fields = 1;
}
```

An `AresValue` utilizes a Protobuf `oneof` block to encapsulate exactly one of the supported types at runtime:

```protobuf
message AresValue {
    oneof kind {
        NullValue null_value = 1;
        bool bool_value = 2;
        string string_value = 3;
        double number_value = 4;
        bytes bytes_value = 5;
        StringArray string_array_value = 6;
        NumberArray number_array_value = 7;
        AresValueList list_value = 8;
        AresStruct struct_value = 9;
        UnitValue unit_value = 10;
        FunctionValue function_value = 11;
        QuantityValue quantity_value = 12;
        google.protobuf.Timestamp timestamp_value = 13;
        double float_value = 14;
        int64 int_value = 15;
        IntArray int_array_value = 16;
        FloatArray float_array_value = 17;
    }
}
```

---

## Physical Dimension Quantities

### `QuantityValue` & `QuantityType`

To provide structural safeguards during automated exploration (e.g., ensuring a planner does not feed a volume flow rate into a temperature field), ARES supports a `QUANTITY` primitive. A `QuantityValue` embeds a raw numeric scalar, an explicit physical dimension identifier (`QuantityType`), and a metric unit string identifier.

```protobuf
message QuantityValue {
    double scalar = 1;
    QuantityType type = 2;
    string unit = 3; // e.g., "degC", "mL/min", "Pa", "K"
}
```

`QuantityType` formalizes physical dimensions across laboratory instrumentation:
* **Core Dimensions:** `LENGTH`, `AREA`, `VOLUME`, `DURATION`, `SPEED`, `ACCELERATION`, `FREQUENCY`.
* **Mass & Amount:** `MASS`, `AMOUNT_OF_SUBSTANCE` (mol), `MOLAR_MASS` (g/mol).
* **Thermal & Pressure:** `TEMPERATURE`, `TEMPERATURE_DELTA`, `PRESSURE`, `TEMPERATURE_GRADIENT`.
* **Concentrations:** `MOLARITY`, `MASS_CONCENTRATION`, `VOLUME_CONCENTRATION`, `MASS_FRACTION`.
* **Fluid Mechanics:** `DENSITY`, `DYNAMIC_VISCOSITY`, `KINEMATIC_VISCOSITY`.
* **Flow & Fluxes:** `VOLUME_FLOW`, `MASS_FLOW`, `MASS_FLUX`.
* **Mixing & Agitation:** `ROTATIONAL_SPEED` (rpm), `ROTATIONAL_ACCELERATION`.
* **Energy & Electrical:** `ENERGY`, `POWER`, `HEAT_FLUX`, `ELECTRIC_POTENTIAL` (V), `ELECTRIC_CURRENT` (A), `ELECTRIC_RESISTANCE` (ohm), `ELECTRIC_CONDUCTIVITY`.

---

## Dynamic Meta-Schemas

ARES uses meta-schemas to describe the runtime fields expected by automated workflows, acting as validation manifests for equipment constraints and search ranges.

### `AresStructSchema` and `AresValueSchema`

An `AresStructSchema` defines the expected format of an `AresStruct`, mapping text keys to explicit validation constraints via `AresValueSchema`.

```protobuf
message AresStructSchema {
    map<string, AresValueSchema> fields = 1;
}
```

The `AresValueSchema` is a recursive, feature-rich structure supporting bounds, allowed options, descriptions, and default configuration overlays:

```protobuf
message AresValueSchema {
    AresDataType type = 1; 
    bool optional = 2; 
    string description = 3; 
    QuantitySchema quantity_schema = 4; // Populated if type == QUANTITY

    oneof available_choices {
        StringArray string_choices = 5; // Categorical enumeration constraints
        NumberArray number_choices = 6; // Explicit discrete scalar constraints
        Limits limits = 7;              // Numeric bounds interval
    }

    // Recursive shapes for composite types
    AresStructSchema struct_schema = 8;      // Populated if type == STRUCT
    AresValueSchema list_element_schema = 9;  // Populated if type == LIST

    optional double min_number_value = 10;
    optional double max_number_value = 11;
    optional AresValue default_value = 12;
}
```

### `QuantitySchema` and `Limits`

Physical quantities specify explicit dimensional checks and bound validation units:

```protobuf
message Limits {
    double minimum = 1;
    double maximum = 2;
}

message QuantitySchema {
    QuantityType quantity_type = 1;
    string bounds_unit = 2;          // Unit used when validating bounds (e.g. "degC")
    optional double min_scalar_value = 3;
    optional double max_scalar_value = 4;
}
```

---

## Tabular Datasets: `AresDataset`

When compiling high-volume experimental records or streaming history files, individual structs become inefficient. ARES implements `AresDataset` to represent structured tabular columns and corresponding records:

```protobuf
message AresDataset {
    optional string unique_id = 1;
    string name = 2;
    repeated AresDataColumn columns = 3;
    repeated AresDataRow rows = 4;
    map<string, string> metadata = 5; // Top-level global dataset parameters
}

message AresDataColumn {
    optional string unique_id = 1;
    string name = 2;
    AresValueSchema schema = 3;       // Column primitive/quantity type rules
    optional string display_name = 4;
}

message AresDataRow {
    optional string unique_id = 1;
    AresStruct data = 2;              // Row records mapping column names to fields
}
```
