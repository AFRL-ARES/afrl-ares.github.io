---
sidebar_position: 2
title: Configuration
---

The **Configuration** tab allows you to customize how the launcher finds, runs, and updates ARES, and how it connects to your data and repositories.

## ARES Version Management

At the top of the Configuration tab is the **ARES Version Management** panel.

- **Select Release**
  - Use the **Select Release** dropdown to choose which ARES version you want installed.
  - Each entry shows:
    - The semantic version number (e.g. `1.4.0`).
    - A **BETA** badge for beta releases.
    - An **(Installed)** suffix if that version is currently installed on your machine.

- **Install Button**
  - Clicking **Install**:
    - Downloads the selected release bundle from the current repository.
    - Extracts it into the configured binary paths.
    - Runs any database migrations as needed.
  - While an install is in progress, a progress bar and an “Installing…” indicator are shown, and the button is disabled.

- **Include Beta Releases**
  - In the **Advanced options** (see below) there is an **Include beta releases** toggle.
  - When enabled, beta releases are included in the version list; when disabled, only stable releases are shown.

- **Update Confirmation & Downgrades**
  - When switching to a version that is a major/minor upgrade or **downgrade**, the launcher will prompt you to confirm:
    - For **downgrades**, it will check if a database snapshot exists for the target version.
    - You can choose to:
      - Restore the snapshot, or
      - Reset the database.
  - The launcher also creates a snapshot of the current version before performing the update.
  - **Always back up your database** if you rely on external tooling or custom migrations.

If an error occurs during an update (for example, a download fails or a migration throws), the error is displayed at the bottom of the ARES Version Management panel.

---

## Binary Locations

The **Binary Locations** section controls where ARES binaries are stored and run from:

- **UI Binary Path**
  - The folder where ARES UI binaries are placed.
  - Typically a subfolder under the launcher’s application data directory.

- **Service Binary Path**
  - The folder where ARES service binaries are placed.
  - For most combined ARES release bundles, **UI and Service paths should be the same** (the UI and service are extracted together into a single directory).

> Tip: A note in the UI reminds you to keep UI and service paths aligned when using combined packages.

If you have a split layout (UI and service binaries separated), you can adjust these paths accordingly and choose the matching layout in **Advanced Settings** (see below).

---

## Advanced Settings

Click **Show advanced options** to reveal additional configuration controls. These let you tune how ARES connects to databases, runs its HTTP endpoints, and manages its binaries and repositories.

### Database Provider & Connection Strings

- **SQLite Database Path**
  - Custom path for the SQLite database file used by ARES.
  - By default, the launcher uses a local path under its application data directory.

- **Database Provider**
  - Choose which database backend ARES uses.
  - Supported providers:
    - **SQLite**
    - **PostgreSQL**
    - **MSSQL** (SQL Server)
  - The chosen provider must be compatible with the connection strings you configure below.

- **SQL Server Connection String**
  - Connection string for SQL Server / LocalDB.
  - Used when the provider is set to MSSQL.

- **Postgres Connection String**
  - Connection string for PostgreSQL.
  - Used when the provider is set to PostgreSQL.

Configure your provider and corresponding connection string together; mismatching provider and connection string will cause ARES to fail on startup.

### Service/UI Endpoints

- **Service Endpoint**
  - The HTTPS/HTTP address (including port) for the ARES service (API).
  - Example: `https://localhost:5001`
  - Adjust this to avoid port conflicts with other services.

- **UI Endpoint**
  - The HTTPS/HTTP address for the ARES UI.
  - Example: `https://localhost:7084`
  - Useful if you need to run multiple instances or if ports clash with other tools.

### Data & Process Settings

- **ARES Data Path**
  - Base folder where ARES stores its data (logs, configurations, etc.).
  - By default, this is under the launcher’s application data directory.

- **Installed ARES Layout**
  - Describes how ARES is laid out on disk:
    - The default is **SplitUiAndService**, but other layout options are available.
  - This helps the launcher understand whether UI and service binaries are combined or separated, and how to locate them.
  - Generally, this is set by the launcher when installing ARES, and should not be edited by users.

- **ARES Service Process Name**
  - The process name used to identify the ARES service when checking whether it is running.
  - Example: `AresService`.

- **ARES UI Process Name**
  - The process name for the ARES UI.
  - Example: `UI`.
  - Adjust these if your deployment uses custom process names or wrappers.

### Beta Release Visibility

- **Include beta releases**
  - As mentioned above, this toggle controls whether beta releases appear in the ARES version list.
  - Enable it if you want to track pre‑release builds; keep it off if you only want stable releases.

---

## Updates (ARES)

The launcher tracks available ARES versions from the selected repository and surfaces them in the **ARES Version Management** section:

- When a new ARES release with a higher version number is available, it will appear in the **Select Release** dropdown.
- Clicking **Install** for that release will:
  - Download the new release bundle.
  - Extract the UI and service binaries into the configured binary paths.
  - Run any required database migrations.
  - Optionally manage snapshots and downgrades as described earlier.

Downgrades are handled safely through snapshot detection and a confirmation dialog; however, you should still **back up your database** before performing updates or downgrades, especially in production environments.

---

## Custom ARES Repositories

By default, the launcher uses the official ARES repository:

https://github.com/AFRL-ARES/ARES

Under **Available repositories** in the advanced section, you can manage custom GitHub‑hosted repositories:

- **Available repositories**
  - A list of **Owner / Repository** pairs.
  - For each entry, you specify:
    - **Owner** – GitHub organization or user (e.g. `AFRL-ARES`).
    - **Repository** – Repo name (e.g. `ARES`).
  - Use:
    - **Add repository** to add a new owner/repo pair.
    - **Remove selected** to delete the selected entry.

- **Current repository**
  - Choose which repository the launcher uses for:
    - Fetching ARES releases.
    - Displaying the available version list.
  - The dropdown shows each repository as `Owner/Repo` for clarity.

Your custom repository must:

- Provide proper release bundles (ZIPs or installers compatible with the launcher).
- Follow the expected structure so the launcher can parse release assets and version numbers.

If you switch repositories while an instance is already installed:

- Update **UI binary path**, **Service binary path**, and **ARES data path** as needed to avoid conflicts.
- Ensure that the new repository’s releases are compatible with your chosen database provider and connection strings.

### GitHub Token (Private Repositories)

- **Git token**
  - If your custom repository is private, you can supply a GitHub token with **read** access.
  - The launcher will use this token to authenticate when fetching releases.
  - The field is masked with a password character in the UI.

---

## Saving Configuration

At the bottom of the Configuration tab there is a **Save** button:

- Clicking **Save** writes all editable fields (binary paths, database settings, endpoints, repositories, layout, beta settings, etc.) into the launcher configuration file.
- Some changes (like repository selection and database provider) may require restarting ARES or the launcher to fully take effect.

Make a habit of clicking **Save** after changing settings in the Configuration tab, to ensure your changes persist across launcher restarts.