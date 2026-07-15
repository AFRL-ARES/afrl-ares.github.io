---
sidebar_position: 2
title: Installation
---

ARES OS is designed to be cross-platform, running natively on **Windows**, **macOS**, and **Linux**.

## Method 1: The ARES Launcher (Recommended)

For most users, the **ARES Launcher** is the easiest way to install and maintain the system. It handles version management, updates and ensuring the correct runtime environment.

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

  Note: If initial build fails, try building again as some thing won't exist until building the first time.

4. **Setup the database**  

  a. *Configure the Database*
    - nagigate and open to `UI\appsetting.UI.json`
    - Edit the "DatabaseProvider" value to whichever providor you choose that we support (See [Database Options](#database-providers)).
    - Edit the "ConnectionStrings" sections depending on the provider you're using to use the right values you set, depending on how you setup the database provider (dont worry about this if you didnt/dont wanna use a different provider as thigns work as is with the default of everything).  

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

    - You can change the default URL you can use to the port of choice by editing the "ARES\UI\Properties\launchSettings.json" file. Under the "profiles"/"UI"/"applicationUrl", edit the port value you want to use. Then you restart the application and go to that new URL.

When setting up in an IDE, youll want to run the "UI" project when running/debugging as seen in the in step 6, as it's the project we run there.

### Configuration Notes

#### System App Settings

The main system app settings is located/created at "ARES\UI\appsettings.UI.json". This contains settings we use to load/run ARES when developing.

#### Database Providers

We support the following database providers for ARES operations.  
The format is: "*Key* (common full alias)"

- "SQLite"
- "Postgres" (PostgreSQL)
- "SqlServer" (MSSQL)
