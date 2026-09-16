---
sidebar_position: 13
title: ARES Scripting
---

# ARES Scripting and Script Playground

ARES includes a dedicated scripting language and a **Script Playground** page for experimenting with scripts, inspecting their behavior, and building reusable logic.

This page introduces the Script Playground and the core syntax and features of the ARES scripting language.

## 1. Script Playground Overview

_Access: Script Playground page (route `/scripting` in the ARES UI)_

The Script Playground is a workspace for writing and running ARES scripts.

It has two main areas:

* **Script Editor:** A Monaco-based code editor with completions, diagnostics, semantic tokens, and hover support.
* **Execution panel:** An output area with two tabs:
  * **Output:** Shows timestamped lines of script output.
  * **Summary:** Shows a structured view of function invocation steps and their status.

At this time, the Script Playground is primarily a **live testing site** for scripts. It is designed for experimenting with syntax, functions, and device interactions, but scripts created or run here are not automatically persisted or wired into campaigns or other workflows.

### 1.1 Controls

The header exposes controls for managing script execution:

* **Start:** Clears previous output, reads the current script from the editor, and starts executing it.
* **Stop:** Requests that the currently running script stop.
* **Summarize:** Builds a summary of the script’s function invocation steps without running the full execution loop.

The status indicator shows whether the playground is currently **Running** or **Stopped**.

### 1.2 Output Tab

The **Output** tab presents a simple console-style view:

* Each line shows a timestamp and a message.
* Messages are produced by the script, for example by calling `print(...)` or other functions that emit output.

Use this tab to see the immediate, linear output of your script.

### 1.3 Summary Tab

The **Summary** tab shows a structured view of the script’s function calls:

* Each row represents a function invocation with:
  * Order number.
  * Function name.
  * Expression.
  * Status (Pending, Running, Completed, Failed).
  * Optional result and error message.
* Nested calls appear indented, so you can see parent–child relationships between function invocations.

Use the summary view when you want to understand how a script is structured and how functions are invoked over time, rather than just seeing printed output.

## 2. Language Basics

ARES scripts use an indentation-sensitive syntax inspired by Python, with explicit tokens for `INDENT`, `DEDENT`, and `NEWLINE`. The ARES parser is defined by the `AresLang.g4` grammar.

### 2.1 Programs and Statements

A script is a sequence of statements separated by newlines:

* **Program:** A list of statements followed by end-of-file.
* **Statements:**
  * Simple statements: assignments, expressions, asserts, function declarations.
  * Control-flow statements: `if` / `elif` / `else`, `while`, `for`.
  * Loop control: `break`, `continue` (valid only inside loops).
  * Function control: `return` (valid only inside functions).
  * `parallel` blocks for parallel execution.

Statements are grouped into blocks using indentation, not braces.

Example:

```text
# Simple script with assignments and a conditional
x = 5
y = 10

if x < y:
  print("x is less than y")
else:
  print("x is greater or equal to y")
```

### 2.2 Indentation and Blocks

Blocks follow a colon (`:`) at the end of a statement and are indented:

* **Non-loop block:**
  * Example: `if condition:` followed by an indented block of statements.
* **Loop block:**
  * Example: `while condition:` or `for x in values:` followed by an indented loop block.
* **Function block:**
  * Example: `def name(...):` followed by an indented function body.

Indentation must be consistent; it determines where blocks start and end.

Example:

```text
for i in range(0, 3):
  if i == 0:
    print("first experiment")
  else:
    print("experiment", i)
```

### 2.3 Assignments and lvalues

Assignments bind expressions to variables or more complex lvalues:

* **Basic assignment:** `x = expression`
* **Member assignment:** `obj.field = expression`
* **Index assignment:** `array[index] = expression`

Only valid lvalues (identifiers, member access, indexers) can appear on the left-hand side of `=`.

Example:

```text
# Basic variable assignment
count = 0

# Member assignment on a struct-like value
config = {"target": 42}
config.target = 50

# Index assignment on an array
values = [0, 1, 2]
values[1] = 10
```

### 2.4 Expressions

Expressions support arithmetic, comparison, logical operations, and function calls:

* **Arithmetic:** `+`, `-`, `*`, `/`, `%`
* **Relational:** `>`, `<`, `>=`, `<=`
* **Equality:** `==`, `!=`
* **Logical:** `and`, `or`, `not`
* **Member access:** `value.field`
* **Index access:** `value[index]`
* **Function calls:** `func(arg1, arg2, ...)`
* **Keyword arguments:** `func(x=1, y=2)`

Parentheses (`(`, `)`) can be used to group expressions and control evaluation order.

Example:

```text
a = 2
b = 3
c = 4

result = (a + b) * c

if result >= 10 and result != 0:
  print("result is", result)
```

### 2.5 Literals and Data Structures

Scripts support several literal types:

* **Numbers:**
  * Integers: `42`
  * Floats: `3.14`
* **Strings:** Single or double quoted, with escape sequences.
* **Booleans:** `True`, `False`
* **None:** `None`
* **Arrays:** `[1, 2, 3]` (a literal sequence of values).
* **Structs:** `{"key": value}` style definitions using braces and key–value pairs.

These map to ARES value types (numbers, strings, arrays, lists, structs, quantities, and more) inside the runtime.

Example:

```text
# Number and string literals
temperature = 23.5
label = "Sample A"

# Array literal
readings = [21.0, 22.3, 23.5]

# Struct literal with key-value pairs
metadata = {
  "sample": label,
  "count": len(readings)
}

print("Metadata:", metadata)
```

### 2.6 Control Flow

Control-flow statements include:

* **If / Elif / Else:**
  * `if condition: ... elif other_condition: ... else: ...`
* **While loops:**
  * `while condition: ...`
* **For loops:**
  * `for item in expression: ...`
* **Break / Continue:**
  * `break` exits the nearest loop.
  * `continue` skips to the next iteration of the nearest loop.
* **Assert:**
  * `assert condition, "optional message"` evaluates a condition and can carry an optional message.
* **Parallel blocks:**
  * `parallel:` followed by an indented `parallelBlock` of expressions for parallel execution.

Example:

```text
total = 0

for value in range(1, 5):
  if value % 2 == 0:
    continue  # skip even values

  total = total + value

# Purposely wrong to demonstrate assert failures
assert total == 9, "sum of odd numbers from 1 to 4 should be 9"

parallel:
  print("running in parallel")
  print("another parallel expression")
```

### 2.7 Functions and Returns

Scripts can declare functions using `def`:

* **Function declaration:**
  * `def name(parameters) -> type_hint: ...`
* **Parameters:**
  * Each parameter can optionally carry a type hint.
* **Type hints:**
  * Named types, struct-like types, and list types with optional constraints.
* **Return:**
  * `return expression` inside a function returns a value.

Return statements are only valid inside function bodies.

Example:

```text
def average(a, b):
  result = (a + b) / 2
  return result

value = average(10, 14)
print("average is", value)
```

### 2.8 Lambdas

The language supports lambda expressions for inline functions:

* **Single-parameter lambda:** `x => expression`
* **Multi-parameter lambda:** `(x, y) => expression`

Lambdas can be used anywhere an expression is valid.

Example:

```text
double = x => x * 2
add = (a, b) => a + b

print("double(3) =", double(3))
print("add(2, 5) =", add(2, 5))
```

## 3. Standard Library Functions

ARES scripts can call standard library functions defined in the `StandardLibrary` class.

Some key functions include:

* **print(value, ...):** Writes one or more values to the console output.
* **string(value, ...):** Converts one or more values to a string.
* **len(value):** Returns the length of strings, arrays, lists, bytes, or structs.
* **range(stop)**, **range(start, stop)**, **range(start, stop, step):** Generates a number array over the specified range.
* **sleep(time):** Pauses execution for a given duration. Accepts a plain number (milliseconds) or a Duration quantity.

Extension-style functions provide additional behaviors:

* **quantity.as("unit"):** Converts a quantity to a different unit (for example `duration.as("ms")`).
* **list.append(value):** Appends a value to a list.
* **number_array.append(number):** Appends a number to a number array.
* **string_array.append(string):** Appends a string to a string array.

These functions operate on ARES values and integrate with the ARES datamodel types used throughout the system.

Example:

```text
# Using print, range, and len
values = range(0, 5)
print("values:", values)
print("len(values) =", len(values))

# Sleeping for 500 milliseconds
sleep(500)

# Working with quantities
duration = Quantity.Duration.from(1, "s")
print("duration in ms:", duration.as("ms"))

# Appending to lists and arrays
items = []
items.append("first")
items.append("second")

numbers = range(0, 3)
numbers.append(3)
print("items:", items)
print("numbers:", numbers)
```

## 4. Using Devices in Scripts

In addition to pure data and control-flow logic, ARES scripts can invoke commands on registered devices through the `devices` namespace.

The general pattern is:

```text
devices.device_name.command_name(arg1, arg2, ...)
```

Where:

* `device_name` is the name of a device registered in ARES (for example a mass flow controller or furnace).
* `command_name` is the name of a command that device exposes.
* The arguments are the values required by that command.

Example using placeholder names:

```text
# Set a target value on a device
devices.MyDevice.SetPoint(42)

# Read back a value from the same device
current = devices.MyDevice.ReadValue()
print("Current value is", current)
```

In your own scripts, replace `MyDevice`, `SetPoint`, and `ReadValue` with the actual device and command names configured in your ARES system. Device commands invoked from scripts follow the same rules and safety controls as commands triggered from the UI.

## 4. Working With Scripts in Practice

When using the Script Playground:

1. Open the Script Playground page.
2. Write or paste a script into the editor.
3. Use **Start** to execute the script and watch its output appear in the Output tab.
4. Use **Summarize** to build a function invocation summary and inspect the structure and status of calls in the Summary tab.
5. Use **Stop** to request that a long-running script halt.

For more advanced usage, scripts can be used in contexts such as custom commands and campaign logic where the ARES UI supports script-backed behavior. The Script Playground helps you prototype and validate those scripts before you integrate them into your campaigns.
