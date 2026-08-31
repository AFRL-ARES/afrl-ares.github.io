---
sidebar_position: 1
title: Welcome to the ARES Launcher
---

import { useEffect, useState } from 'react';

# ARES Launcher

The ARES Launcher is a utility designed to make installing, running, and managing self‑contained ARES instances simple and reliable.

## Getting Started

Visit the [Releases](https://github.com/AFRL-ARES/ARES-Launcher/releases) page or use the buttons below to download the latest launcher for your operating system.

export const DownloadButtons = () => {
  const [urls, setUrls] = useState({
    windows: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest",
    linux: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest",
    macos: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest"
  });

  useEffect(() => {
    fetch("https://api.github.com/repos/AFRL-ARES/ARES-Launcher/releases/latest")
      .then(res => res.json())
      .then(data => {
        if (!data.assets) return;
        const getUrl = (str) => data.assets.find(a => a.name.toLowerCase().includes(str) && !a.name.toLowerCase().includes("offline"))?.browser_download_url;
        setUrls({
          windows: getUrl("windows") || urls.windows,
          linux: getUrl("linux") || urls.linux,
          macos: getUrl("macos") || urls.macos
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem'}}>
      <a className="button button--primary" href={urls.windows}>Download for Windows</a>
      <a className="button button--primary" href={urls.linux}>Download for Linux</a>
      <a className="button button--primary" href={urls.macos}>Download for macOS</a>
    </div>
  );
};

export const OfflineDownloadButtons = () => {
  const [urls, setUrls] = useState({
    windows: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest",
    linux: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest",
    macos: "https://github.com/AFRL-ARES/ARES-Launcher/releases/latest"
  });

  useEffect(() => {
    fetch("https://api.github.com/repos/AFRL-ARES/ARES-Launcher/releases/latest")
      .then(res => res.json())
      .then(data => {
        if (!data.assets) return;
        const getUrl = (str) => data.assets.find(a => a.name.toLowerCase().includes(str) && a.name.toLowerCase().includes("offline"))?.browser_download_url;
        setUrls({
          windows: getUrl("windows") || urls.windows,
          linux: getUrl("linux") || urls.linux,
          macos: getUrl("macos") || urls.macos
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem'}}>
      <a className="button button--primary" href={urls.windows}>Download Offline (Windows)</a>
      <a className="button button--primary" href={urls.linux}>Download Offline (Linux)</a>
      <a className="button button--primary" href={urls.macos}>Download Offline (macOS)</a>
    </div>
  );
};

<DownloadButtons />

After downloading, extract the zip to any folder. Inside, you will find the launcher executable.

### Windows

Double‑click `ARESLauncher.exe` to start the launcher. Windows SmartScreen may display a warning-select **More info → Run anyway** to continue.

### macOS (arm64)

Double click the downloaded .dmg file to mount the volume. Then drag the ARESLauncher application into the Applications directory.

Upon starting the launcher you will be greeted with a security exception. You will just need to follow these simple steps to start it. [Running Unknown Apps](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac)

### Linux

The launcher currently isn't packaged as a native `.desktop` bundle. After extracting, you can run it from a terminal:

```bash
./ARESLauncher
```

You may need to set executable permissions:

```bash
chmod +x ARESLauncher
```

### Offline Use
To support users requiring a completely offline installation solution, we provide an additional Offline Launcher for all three major platforms. This version offers the same functionality as the standard launcher but comes pre-packaged with the latest version of ARES. It can be installed without an internet connection, making it ideal for air-gapped environments or locations with restricted network access. These can be found alongside the regular launcher release files.

<OfflineDownloadButtons />

## Using the Launcher

### Installation

On startup, the launcher displays a simple UI with two tabs and an **Install** button. Click **Install** and the launcher will:

* Download the correct ARES binaries for your system
* Create a local database
* Configure the instance automatically

During installation you may see a certificate prompt. Approve the certificate-it's required for ARES’s built‑in web servers and for secure communication between the ARES service and UI.

### Running ARES

After installation, click **Start**. The launcher will:

* Start both the ARES service and UI
* Open your browser to the ARES UI URL

It may take several seconds for the server to finish booting, so the page may appear unavailable briefly.

You can safely close the launcher window-it continues running in the background and can be accessed from the **system tray**. To fully exit, right‑click the tray icon and choose **Exit**. *Stopping the launcher does **not** stop ARES; stopping ARES must be done explicitly.*

## Launcher Updates

The launcher itself can check for updates to its own binary:

- When a newer launcher version is detected:
  - A **Launcher Update Available** notification button appears on the Overview tab.
- Clicking this button:
  - Downloads the new launcher binary.
  - Stages it for use.
  - Shuts down the current launcher and relaunches into the updated version.

This flow removes the need to manually browse GitHub Releases for launcher updates.


#### Handling Conflicts

If you launch the app while an ARES instance is already running, you’ll be prompted to choose how to resolve the conflict:

* **Take Over** – assign the running processes to the launcher
* **Kill Processes** – terminate the existing instance
* **Ignore** – leave the existing instance running

The process names used for detection are configurable but generally should not be touched unless you know what you're doing.

## Contributing

If you are interested in contributing changes to the ARES Launcher, please refer to the [ARES Contributing Guidelines Page](https://afrl-ares.github.io/docs/ares/contributing) for more information.