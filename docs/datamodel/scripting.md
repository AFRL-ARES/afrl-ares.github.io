---
sidebar_position: 7
title: Scripting & Editor Support
---

# Scripting & Editor Support (LSP)

ARES supports procedural experiment definitions using **AresScript**. To power advanced front-end user interfaces, code editors, and IDEs, the datamodel contains a rich set of Language Server Protocol (LSP) style messages. These messages are defined under the `scripting/` package directory.

---

## Code Completion & Autocomplete

As a user types an AresScript, the client software requests autocomplete suggestions based on the cursor position. The server returns a list of `CompletionItem` records.

```protobuf
message CompletionItem {
    string label = 1;               // Displayed text in the suggestions list
    string insert_text = 2;         // The text to insert into the document
    InsertTextFormat insert_text_format = 3; // PLAIN_TEXT or SNIPPET
    string sort_text = 4;
    
    string detail = 6;              // Short type/signature summary
    string documentation = 7;       // Longer description markdown or hover text
    SymbolKind kind = 8;            // DEVICE, FUNCTION, VARIABLE, PLANNER, etc.
    
    // Rich Type Schema
    AresStructSchema input_schema = 10; // Input arguments if it's a function
    AresValueSchema output_schema = 11; // Return value schema if it's a function
    AresValueSchema schema = 12;        // Type schema if it's a variable or constant
}
```

### `InsertTextFormat`
- `INSERT_TEXT_FORMAT_PLAIN_TEXT`: Inserts literal text.
- `INSERT_TEXT_FORMAT_SNIPPET`: Inserts a snippet with tab-stops (e.g., `set_temperature(${1:target_temp}, ${2:cooldown_rate})`).

---

## Editor Diagnostics (Linting & Errors)

The server analyzes scripts in the background to catch syntax mistakes, invalid hardware references, or out-of-bounds constants before compilation or run time.

```protobuf
message Diagnostic {
    int32 start_line = 1;    // 1-based start line coordinate
    int32 start_column = 2;  // 1-based start column coordinate
    int32 end_line = 3;
    int32 end_column = 4;
    
    string message = 5;      // The warning or error message
    DiagnosticSeverity severity = 6; // ERROR, WARNING, INFO, HINT
    string code = 7;         // Machine-readable error code
}
```

---

## Rich Symbol Metadata & Shapes

The `ScriptSymbolMetadata` message provides full signature reflection for components discovered inside a script. It maps symbols to explicit structures called **Shapes**.

```protobuf
message ScriptSymbolMetadata {
    string identifier = 1;
    optional string parent_identifier = 2; // e.g., device name for a method
    SymbolKind kind = 3;
    repeated SymbolTag tags = 8;           // DEPRECATED, READ_ONLY, EXPERIMENTAL
    
    oneof shape {
        ValueShape value_shape = 6;        // Used for variables/constants
        FunctionShape function_shape = 7;  // Used for functions/methods
    }
}
```

### Symbol Classifications (`SymbolKind`)
Symbols are classified to help client applications render icons and structure scope views correctly:
- `SYMBOL_KIND_DEVICE`: A hardware block namespace.
- `SYMBOL_KIND_FUNCTION`: An invocable action.
- `SYMBOL_KIND_VARIABLE`: A variable reference.
- `SYMBOL_KIND_STRUCT`: A structured data schema definition.
- `SYMBOL_KIND_KEYWORD`: Built-in language keywords.
- `SYMBOL_KIND_PLANNER` / `SYMBOL_KIND_ANALYZER`: AI/ML components mapped to the script environment.

---

## Signature Help (Parameter Hover)

When a developer types an open parenthesis `(` after a function name, the editor uses `SignatureHelp` to display parameter requirements and highlight the current argument index.

```protobuf
message SignatureHelp {
    repeated FunctionSignature signatures = 1;
    optional int32 active_signature = 2; // 0-based index of active signature
    optional int32 active_parameter = 3; // 0-based index of active argument
}

message FunctionSignature {
    string label = 1; // Full signature text (e.g., "set_flow(rate: quantity) -> bool")
    optional string documentation = 2;
    repeated SignatureParameter parameters = 3;
    AresValueSchema return_schema = 4;
}
```

---

## Code Navigation: Go-To-Definition

To support clicking or pressing `F12` to skip to a symbol's declaration site, the server calculates precise text coordinates:

```protobuf
message SymbolLocation {
    string identifier = 1;
    optional string parent_identifier = 2;
    ScriptRange range = 3;
}

message ScriptRange {
    int32 start_line = 1;
    int32 start_column = 2;
    int32 end_line = 3;
    int32 end_column = 4;
}
```
