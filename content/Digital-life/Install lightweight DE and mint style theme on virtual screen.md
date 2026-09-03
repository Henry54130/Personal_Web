---
title: Install lightweight DE and mint style theme on virtual screen
aliases: []
tags:
  - Linux
  - desktop-environment
  - software
level: 1
link:
note:
published: false
---



After setting up the virtual screen, it starts completely empty (no wallpaper, mouse cursor, or window manager). Install and configure a full desktop environment (DE) with official Linux Mint styling, wallpaper, and autostart to make it usable.

---

### 1. Install XFCE and Whisker Menu

Install XFCE and the modern start menu plugin:

```bash
sudo apt update
sudo apt install -y xfce4 xfce4-goodies xfce4-whiskermenu-plugin
```

---

### 2. Download and Install Official Mint-Y Themes, Icons & Wallpapers

Fetch and install the official theme, icon, and background packages directly from the Linux Mint repository:

```bash
# Create temporary workspace
mkdir -p /tmp/mint-pkgs && cd /tmp/mint-pkgs

# Download official Mint-Y themes, icons, and wallpapers
wget http://packages.linuxmint.com/pool/main/m/mint-themes/mint-themes_2.1.8_all.deb
wget http://packages.linuxmint.com/pool/main/m/mint-y-icons/mint-y-icons_1.7.5_all.deb
wget http://packages.linuxmint.com/pool/main/m/mint-backgrounds-vanessa/mint-backgrounds-vanessa_1.1_all.deb

# Install packages and resolve dependencies
sudo dpkg -i mint-themes*.deb mint-y-icons*.deb mint-backgrounds*.deb || sudo apt-get install -f -y

# Clean up
cd ~ && rm -rf /tmp/mint-pkgs
```

---

### 3. Configure Mint-Y Style, Panel Layout & Wallpaper via CLI

Set visual themes, window borders, font rendering, bottom panel layout, and the desktop wallpaper directly from the terminal before launching:

```bash
# Target the virtual display
export DISPLAY=:99

# Set GTK Widget Theme (Use "Mint-Y" for light or "Mint-Y-Dark" for dark)
xfconf-query -c xsettings -p /Net/ThemeName -s "Mint-Y-Dark" --create -t string

# Set Window Manager Titlebar Theme
xfconf-query -c xfwm4 -p /general/theme -s "Mint-Y-Dark" --create -t string

# Set Mint-Y Icon Theme
xfconf-query -c xsettings -p /Net/IconThemeName -s "Mint-Y" --create -t string

# Set Font Anti-aliasing (Matches Linux Mint defaults)
xfconf-query -c xsettings -p /Xft/RGBA -s "rgb" --create -t string
xfconf-query -c xsettings -p /Xft/HintStyle -s "hintslight" --create -t string

# Configure Mint-Style Panel (Move to bottom screen edge and use Whisker Menu)
xfconf-query -c xfce4-panel -p /panels/panel-1/position -s "p=8;x=0;y=0" --create -t string
xfconf-query -c xfce4-panel -p /plugins/plugin-1 -s "whiskermenu" --create -t string

# Set Linux Mint Wallpaper
WALLPAPER_PATH="/usr/share/backgrounds/linuxmint/default_background.jpg"
xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorDFP-0/workspace0/last-image -s "$WALLPAPER_PATH" --create -t string
xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorDFP-0/workspace0/image-style -s 5 --create -t int
```

---

### 4. Launch the Session (Manual Test)

Start the desktop inside an isolated DBus instance to test:(have to connect to streaming client first )

```bash
DISPLAY=:99 dbus-launch --exit-with-session startxfce4 &
```

---

### 5. Enable Automatic Startup on Boot

Create a user-level systemd service so the Mint-styled XFCE desktop session automatically launches on `:99` whenever the system boots.

#### 5.1 Create the Autostart Script

```bash
mkdir -p ~/.local/bin
cat <<'EOF' > ~/.local/bin/start-xfce-virtual.sh
#!/bin/bash
export DISPLAY=:99

# Wait until Xorg :99 is active and ready
until xset q >/dev/null 2>&1; do
    sleep 0.5
done

# Launch isolated DBus XFCE session
exec dbus-launch --exit-with-session startxfce4
EOF

chmod +x ~/.local/bin/start-xfce-virtual.sh
```

#### 5.2 Create the Systemd User Service

```bash
mkdir -p ~/.config/systemd/user
cat <<'EOF' > ~/.config/systemd/user/xfce-virtual.service
[Unit]
Description=XFCE Desktop Session on Virtual Display :99
After=xorg-virtual.service
Wants=xorg-virtual.service

[Service]
Type=simple
ExecStart=%h/.local/bin/start-xfce-virtual.sh
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF
```

#### 5.3 Enable and Start the Service

```bash
# Allow user services to run on boot without interactive login
sudo loginctl enable-linger $USER

# Reload systemd user manager and enable service
systemctl --user daemon-reload
systemctl --user enable --now xfce-virtual.service
```

#### 5.4 Verify the Status

```bash
systemctl --user status xfce-virtual.service
```
