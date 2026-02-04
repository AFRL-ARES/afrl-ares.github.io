---
sidebar_position: 4
title: Adding a Device
---

## Adding a New Device to ARES OS

This guide will walk you through the process of navigating the settings menu to configure and add a new hardware device to your system.

### 1. Open the Device Settings
To begin, navigate to the **Settings** menu by clicking the gear icon in the bottom-left corner of the sidebar. Ensure the **Device** tab is selected at the top of the main content area to view the list of available device categories.

### 2. Select the Device Type
In the left-hand sub-navigation menu under the Device tab, locate and select the specific hardware type you wish to add

* For example, **Alicat MFCs** is selected from the list of supported hardware, which also includes Syringe Pumps, Laser Chillers, and more.

### 3. Initiate the "Add Device" Dialog
Once the correct category is selected, you will see a list of currently configured devices. To add a new one, click the plus (+) button located on the right side of the device list.

### 4. Configure Device Information
A New MFC (or respective device type) dialog box will appear. Fill in the required configuration details:

* **Name**: Enter a unique identifier for the device (e.g., SimCatThree).

* **Port**: Select the appropriate COM port from the dropdown menu (e.g., COM16).

* **Simulated**: Use the toggle to specify if this is a physical device or a simulated software instance.

* **Address/ID**: Select the specific device ID or address (e.g., C).

* **Mode**: Set the operational mode (e.g., Normal).

* **Features**: Toggle specific hardware features, such as Has Valve, if applicable.

Once all fields are correctly populated, click the **Save** button.

### 5. Device Simulations
ARES supports simulations for most devices it directly supports, allowing users to understand how that devices looks and feels within the ARES software without having to plug it into their computer.


### 6. Verify Successful Addition
After saving, a green notification toast will appear in the top-right corner confirming: **"Successfully added [Device Name]"**.

The new device will now appear in the main list. From here, you can:

* **Monitor Status:** View real-time status updates (e.g., "Activated SimCatThree").

* **Quick Actions:** Use the Submit buttons to update the Current Gas or Current Id directly from the list.

* **Manage:** Use the icons on the right side of the device card to view Info, Edit configuration, access Settings, or Delete the device.

See below for a quick 30 second video demonstrating the steps described above.
