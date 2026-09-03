---
link:
  - "[[Install lightweight DE and mint style theme on virtual screen]]"
title: Create isolated screen on Linux
aliases: []
tags:
  - Linux
level: 1
note:
published: false
---



Create an independent, isolated virtual X display (e.g., `:99`) separate from the physical screen, fully hardware-accelerated by the NVIDIA driver for RDP and streaming.

> **Notice:** Do not modify the default `/etc/X11/xorg.conf` or interfere with `:0` / DRM master.

---

### 1. Identify GPU Bus ID

Run `lspci` to find the PCI Bus ID of your NVIDIA GPU:

```bash
lspci | grep -i nvidia
# Example output: 01:00.0 VGA compatible controller: NVIDIA Corporation ...
```

Convert the PCI ID format for Xorg (`01:00.0` → `PCI:1:0:0`):
- `01` → `1`
- `00` → `0`
- `0` → `0`

---

### 2. Create an Isolated Xorg Configuration File

Create a standalone configuration file (e.g., `~/xorg-headless.conf`) that configures a virtual connected display and its dependencies:

```bash
cat <<'EOF' > ~/xorg-headless.conf
Section "ServerLayout"
    Identifier     "Layout0"
    Screen      0  "Screen0" 0 0
EndSection

Section "Device"
    Identifier     "Device0"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    # Replace with your actual BusID from step 1:
    BusID          "PCI:1:0:0"
    Option         "AllowEmptyInitialConfiguration" "True"
    Option         "ConnectedMonitor" "DFP-0"
    Option         "CustomEDID" "DFP-0:/dev/null"
EndSection

Section "Screen"
    Identifier     "Screen0"
    Device         "Device0"
    Monitor        "Monitor0"
    DefaultDepth    24
    Option         "UseDisplayDevice" "None"
    Option         "ModeValidation" "NoMaxPClkCheck, NoEdidMaxPClkCheck, NoHorizontalSyncCheck, NoVerticalRefreshCheck, NoVirtualSizeCheck"
    SubSection     "Display"
        Depth       24
        Modes      "1920x1080"
    EndSubSection
EndSection

Section "Monitor"
    Identifier     "Monitor0"
    VendorName     "Unknown"
    ModelName      "Dummy"
    HorizSync       28.0 - 33.0
    VertRefresh     43.0 - 72.0
    Option         "DPMS"
EndSection
EOF
```

---

### 3. Launch the Independent X Server

Start `Xorg` on an isolated display number (e.g., `:99`) using the custom configuration file. Pass `-noreset`, `-novtswitch`, and `-sharevts` to prevent DRM and VT conflicts:

```bash
Xorg :99 -config ~/xorg-headless.conf -noreset -novtswitch -sharevts &
```

---

### 4. Verify Hardware Acceleration

Set the environment variable to point to the new display and verify OpenGL acceleration:

```bash
export DISPLAY=:99

# Check renderer details
glxinfo | grep -E "OpenGL vendor|OpenGL renderer|OpenGL version"
```

*Expected output:*
```text
OpenGL vendor string: NVIDIA Corporation
OpenGL renderer string: NVIDIA GeForce ...
OpenGL version string: 4.6.0 NVIDIA ...
```

---

## Enable Automatic Startup on Boot

### 1. Move Configuration to System Directory

Copy the custom configuration file to `/etc/X11/` so root can access it during boot:

```bash
sudo cp ~/xorg-headless.conf /etc/X11/xorg-headless.conf
```

---

### 2. Create the Systemd Service

Create the service unit file at `/etc/systemd/system/xorg-virtual.service`:

```bash
sudo tee /etc/systemd/system/xorg-virtual.service <<'EOF'
[Unit]
Description=Isolated Headless NVIDIA Xorg Display :99
After=systemd-modules-load.service systemd-udevd.service
Wants=systemd-udevd.service

[Service]
Type=simple
ExecStart=/usr/lib/xorg/Xorg :99 -config /etc/X11/xorg-headless.conf -noreset -novtswitch -sharevts
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
```

---

### 3. Enable and Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now xorg-virtual.service
```

---

### 4. Verify Service Status

Check that the service is running:

```bash
sudo systemctl status xorg-virtual.service
```

Confirm that the virtual display is active and responding:

```bash
DISPLAY=:99 glxinfo | grep "OpenGL renderer"
```

---

## 5. Remote Access

Stream this virtual display as a remote desktop using tools like Sunshine, or configure VNC over an SSH tunnel.
