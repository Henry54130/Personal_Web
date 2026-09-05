---
title: how to use winapps
aliases:
  - use winapps  to install windows app on linux
tags:
  - windows
  - Linux
level: 1
link:
  - "[[run windows app on linux(like office and adobe)]]"
  - "[[run office client on linux]]"
published: false
---

# How to Use WinApps

WinApps allows you to run Windows applications (like Microsoft Office, Adobe Creative Cloud, etc.) inside a Windows Docker container or Virtual Machine, rendering them seamlessly as if they were native Linux apps.

---

## 1. Prerequisites & Status Check

For WinApps to work, your Windows VM or Docker container must be running.

* **Check if the Windows container is running:**
  ```bash
  docker ps
  ```
  *(You should see a container named `WinApps` running `ghcr.io/dockur/windows` mapping port `3389` to localhost).*

---

## 2. Configuration File

The configuration file is located at:
📁 `~/.config/winapps/winapps.conf`

Example configuration:
```bash
RDP_USER="admin"
RDP_PASS="admin"
RDP_IP="127.0.0.1"
RDP_PORT="3389"
WAFLAVOR="docker"
RDP_SCALE="180"
```

---

## 3. Creating & Installing Application Shortcuts

To run the installation wizard and select which Windows applications you want to map as desktop shortcuts on Linux:

```bash
sudo winapps-setup --system
```

### Installation Steps:
1. When prompted: *"How would you like to handle officially supported applications?"*
2. Select: **"Choose specific officially supported applications to set up"**
3. Use the **Spacebar** to check only the apps you want (e.g. `word-o365`, `excel-o365`, `powerpoint-o365`) and uncheck the rest.
4. Press **Enter** to complete the setup.

---

## 4. Managing Application Shortcuts

### Adding New Apps
To scan the VM for newly installed applications and add them without changing your existing shortcuts:
```bash
sudo winapps-setup --system --add-apps
```

### Removing Specific Apps
* **Option A (Clean Reinstall):**
  Uninstall the shortcuts and run the setup again to select only the ones you want:
  ```bash
  sudo winapps-setup --system --uninstall
  sudo winapps-setup --system
  ```
* **Option B (Manual Deletion):**
  Directly delete the shortcut files (e.g. to remove Microsoft Access):
  ```bash
  sudo rm /usr/share/applications/access-o365.desktop
  sudo rm /usr/local/bin/access-o365
  ```

### Full Uninstall
To clean up all application shortcuts and wrapper scripts:
```bash
sudo winapps-setup --system --uninstall
```

---

## 5. Troubleshooting Symlink & Path Issues

If the installer crashes with a copy directory loop (`cp: cannot copy a directory, '/usr/local/bin/.' into itself...`), or commands are not found, recreate the correct symlinks manually:

```bash
# Recreate system symlinks
sudo ln -sf /usr/local/bin/winapps-src/bin/winapps /usr/local/bin/winapps
sudo ln -sf /usr/local/bin/winapps-src/setup.sh /usr/local/bin/winapps-setup
```

---

## 6. Running Applications Manually
To run a Windows executable manually that does not have a pre-configured shortcut:
```bash
winapps manual "C:\path\to\executable.exe"
```
