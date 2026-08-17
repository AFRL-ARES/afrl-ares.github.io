---
sidebar_position: 2
title: Installation
---

ARES OS is designed to be cross-platform, running natively on **Windows**, **macOS**, and **Linux**.

## Method 1: The ARES Launcher (Recommended)

For most users, the **ARES Launcher** is the easiest way to install and maintain the system. It handles version management, updates, and ensuring the correct runtime environment.

1. **Download:** Navigate to the [ARES Launcher Releases](https://github.com/AFRL-ARES/ARES-Launcher/releases) page and download the installer for your operating system.

2. Follow the instructions in the README of the [ARES Launcher Repository](https://github.com/AFRL-ARES/ARES-Launcher) to get ARES running on your system.

### Updating ARES

The ARES Launcher also supports pulling updates for your ARES system. See the [Update Section](https://github.com/AFRL-ARES/ARES-Launcher?tab=readme-ov-file#updates) of the ARES Launcher documentation.

## Method 2: Manual Build (For Developers)

### Prerequisites

- **.NET 10 SDK** (Required for all components)
- **Entity Framework Core Tools**: Required for managing database migrations

  ```bash
  dotnet tool install --global dotnet-ef
  ```

- **An Integrated Development Environment (IDE):**
  - **Recommendation: Visual Studio 2026** for the best C# and Blazor development experience.

### Steps

1. **Clone the repository:**

  ```Bash
  git clone https://github.com/AFRL-ARES/ARES.git
  cd ARES
  ```

2. **Trust HTTPS Development Certificate**

  ```Bash
  dotnet dev-certs https --trust
  ```

3. **Restore Dependencies and Build**

  ```Bash
  dotnet restore
  dotnet build
  ```

  Note: If initial build fails, try building a second time. The ARES project creates some required items at build time, which can cause some errors when building a fresh clone.

4. **Setup the database**  

  a. *Configure the Database*
    - nagigate and open to `UI\appsetting.UI.json`
    - Edit the "DatabaseProvider" value to whichever provider you choose from our list of supported (See [Database Options](#database-providers)).
    - Edit the "ConnectionStrings" sections based on the provider you're using. Each provider has slightly different syntax for connection strings, please see those providers documentation for assistance with connection strings. If you would like to use the default sqlite option, you may leave these settings as they appear.  

  b. *Initialize Database*

  ```Bash
  dotnet run --project .\UI\UI.csproj --migrate
  ```

5. **Start ARES**

```Bash
dotnet run --project .\UI\UI.csproj
```

6. **Navigate to the UI**  
Open a browser of your choice and navigate to [https://localhost:7084](https://localhost:7084). If you've started ARES successfully, this will open the ARES Dashboard.

    - You can use your port of choice by editing the "ARES\UI\Properties\launchSettings.json" file. Under the "profiles"/"UI"/"applicationUrl", edit the port value to match the port you want to use, then you restart the application. ARES will then be hosted on that new URL.

When setting up in an IDE, run the "UI" project when running/debugging as seen in the in step 6.

### Configuration Notes

#### System App Settings

The main system app settings is located at "ARES\UI\appsettings.UI.json". This contains settings we use to load/run ARES when developing.

#### Database Providers

We support the following database providers for ARES operations.  
The format is: "*Key* (common full alias)"

- "SQLite"
- "Postgres" (PostgreSQL)
- "SqlServer" (MSSQL)
