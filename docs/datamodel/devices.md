---
sidebar_position: 4
title: Devices & Commands
---

# Devices & Commands

A **Device** in ARES represents a physical laboratory instrument or a software simulation of one. The ARES datamodel standardizes how these instruments describe their capabilities, how they are configured, and how they report their real-time state.

---

## Device Discovery: `DeviceInfo`

When a device (or its driver) connects to ARES, it provides a `DeviceInfo` manifest. This manifest tells ARES everything it needs to know to generate a user interface and validate commands.

```protobuf
message DeviceInfo {
    string unique_id = 1;
    string name = 2;
    string type = 3;         // e.g., "AlicatMFC", "ThorlabsLaser"
    string version = 5;
    optional string url = 6; // Remote address for networked devices
    
    // Self-Description
    AresStructSchema settings_schema = 7; // Configuration parameters
    repeated DeviceCommandDescriptor commands = 8; // Available actions
}
```

### Command Descriptors

Every action a device can take is described by a `DeviceCommandDescriptor`. This allows ARES to know what inputs a command requires and what output it will return *before* execution.

```protobuf
message DeviceCommandDescriptor {
    string name = 1;
    string description = 2;
    AresStructSchema input_schema = 5;  // Required arguments
    AresValueSchema output_schema = 4; // Expected return type
}
```

---

## Configuration & Connectivity

### `DeviceConfig` & `SerialConnection`

Devices are configured using `DeviceConfig`. This includes the driver identifier, whether the device is in "simulation" mode, and physical connection details like serial ports.

```protobuf
message DeviceConfig {
    string device_name = 2;
    string driver_id = 4;
    bool is_simulated = 5;
    
    // Connection specific info
    optional SerialConnection serial_info = 13;
    AresStruct device_settings = 20; // Matches settings_schema
}

message SerialConnection {
    string port_name = 1; // e.g., "COM3", "/dev/ttyUSB0"
    optional int32 baud_rate = 3;
}
```

---

## Real-Time Telemetry: `DeviceState`

Devices constantly emit their internal state (e.g., current temperature, pressure readings). This is captured in a `DeviceState` message.

```protobuf
message DeviceState {
    string device_id = 1;
    google.protobuf.Timestamp timestamp = 2;
    AresStruct data = 3; // The actual readings
}
```

### Polling & Logging

ARES provides fine-grained control over how often device data is collected.

* **`DevicePollingSettings`**: Controls the frequency of state updates from the device to the ARES server.
* **`DeviceLoggingSettings`**: Controls how often state updates are written to the persistent database.

Supported modes:
- `NONE`: No streaming/logging.
- `INTERVAL`: Fixed rate (e.g., every 500ms).
- `ON_CHANGE`: Only when values deviate by a specified `delta`.

---

## Status & Health: `DeviceOperationalStatus`

The `OperationalState` enum tracks the health of a device:

| State | Description |
| :--- | :--- |
| `INACTIVE` | The device is disconnected or powered off. |
| `ACTIVE` | The device is connected and ready to execute commands. |
| `ERROR` | The device has encountered a hardware fault or communication failure. |

---

## The Remote Device Interface

For hardware that cannot run the ARES driver natively (e.g., a device controlled by a separate Linux PLC), ARES defines a standard gRPC service: `AresRemoteDeviceService`. 

Any service that implements this contract can be added to ARES as a "Remote Device."

**Core RPCs:**
- `GetOperationalStatus`: Current health check.
- `GetInfo`: Returns `DeviceInfo`.
- `ExecuteCommand`: Perform an action.
- `GetStateStream`: Open a high-speed telemetry pipe.
- `EnterSafeMode`: Immediate emergency shutdown command.
