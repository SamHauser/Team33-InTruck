# InTruck Setup Guide

This guide will walk through the steps required for the initial setup of the InTruck device.

## Pi Configuration

### OS Installation

To initially configure the Pi, an image of the Raspberry Pi OS or equivalent should be written to the storage.

This can be done via the [Raspberry Pi Imager](https://www.raspberrypi.com/software/).

During the imaging process, a user account, SSH access and a preconfigured WiFi network can be set.

### Enabling I2C

1. Via the command line, open the Pi configuration tool with `sudo raspi-config`
2. To enable I2C, go to 3 -> I2C and enable

## Software Installation

### Updating Packages

1. First, update the package repository with the command `sudo apt update`
2. Run `sudo apt full-upgrade` to upgrade the packages installed to their latest versions

### Software

Run these commands for the associated software to be installed:
- Light sensor: `python3 -m pip install bh1745`
- Accelerometer: `python3 -m pip install msa301`
- Air quality: `sudo pip3 install bme680`
- Battery: `sudo apt install pijuice-base`
- MQTT client: `sudo pip3 install paho-mqtt`
- Parameter storage: `pip install python-decouple`
- Modem configuration tool: `sudo apt install minicom`
- GPS reading and control:
    - `sudo apt install gpsd gpsd-clients`
    - `pip3 install gpsd-py3`

## Cellular and GPS Configuration

### Running AT commands

Minicom (installed earlier) can be used to run "AT" commands on the modem. These are configuration commands sent over serial.

To open Minicom and begin sending commands, run `sudo minicom -b 115200 -D /dev/ttyUSB3`

A guide to the AT commands available is available at https://sixfab.com/wp-content/uploads/2022/02/Telit_LE910Cx_AT_Commands_Reference_Guide_r12.pdf

### Cellular

The following AT commands will configure the cellular connection in ECM mode ([reference guide here](https://docs.sixfab.com/page/cellular-internet-connection-in-ecm-mode))

1. Set access point name (super is for sixfab, different between sim cards): `AT+CGDCONT=1,"IPV4V6","super"`
2. Set USB mode: `AT#USBCFG=4`
3. Restart the module to apply the above settings: `AT#REBOOT`
4. Start the internet session (this must be done every time the module is restarted): `AT#ECM=1,0`

### GPS

Use these commands to configure the GPS (again run through Minicom):

1. Set an internet-based location assistance service to help find initial GPS lock: `AT$LCSSLP=1,"supl.google.com",7275`
2. Set GPS accuracy level: `AT$GPSQOS=0,0,150,0,0,0,1`
3. Enable the Qualcomm GpsOneXTRA service which again helps speed up initial GPS lock: `AT$XTRAEN=1`
4. Enable finding location via nearby wireless networks: `AT#GTPEN=1`
5. Enable streaming NMEA data via serial, used by GPSD: `AT$GPSNMUN=2,1,1,1,1,1,1`
6. Save GPS settings: `$GPSSAV`
7. Set the GPS start mode to "hotstart": `AT$GPSR=3`
8. Enable the GPS (must be done every time the module is restarted): `AT$GPSP=1`

To check GPS information is being returned, run `AT$GPSACP`. Note that this will return several commas and a 1 if it's searching for a lock.

To get the location based on nearby WiFi networks, use the command `AT#GTP`

## GPSD Configuration

GPSD is the software used to read incoming GPS information over serial and make it available to other software.

1. Open the file at `/etc/default/gpsd` in a text editor
2. Set `DEVICES="/dev/ttyUSB1"` or equivalent for the GPS device in use. This should be the port that streams NMEA data.

## Installing the software to run on boot as a service
1. Copy the code below to a new file called intruck.service located in `/usr/lib/systemd/user`. Make sure the ExecStart path matches the path to the main program.
```
[Unit]
Description=Main InTruck program to publish sensor data

[Service]
ExecStart=/bin/python "/home/intruck2/Documents/Team33-InTruck/Hardware/Main Program/main.py"
KillSignal=SIGINT

[Install]
WantedBy=default.target
```
2. Run the command `systemctl --user status intruck.service` to check it has been detected
3. It can be started with `systemctl --user start intruck.service`
4. To run automaticallly, first run the command `sudo loginctl enable-linger $USER`
5. Run `systemctl --user enable intruck.service` to enable start on boot. Replace `enable` with `disable` to prevent it running on startup.

## Configuring PiJuice Buttons

To set the functionality of the buttons on the PiJuice, perform the following steps:

1. Add the main program to start/stop as a service (no requirement to make it start on boot)
2. Copy the `.sh` files in "PiJuice Button Scripts" into the `/usr/local/bin` folder
3. Use `chown` and `chgrp` to set the permissions to the default user account on the device (run the `id` command, the user with id 1000)
4. Use `chmod +x script_name.py` to make the scripts executable
5. Open the PiJuice configuration with `pijuice_cli`
6. Add the file location/name to the user scripts page
7. Add the user scripts to run when the buttons are pressed (e.g. SW2 and SW3)
8. For SW1, change the command to `SYS_FUNC_HALT_POW_OFF`. This will turn off the power to the cellular HAT after shutdown.

## PiJuice Automatic Shutdown

Setting an automatic shutdown will allow the Pi to gracefully shut down when the battery is low.

1. Open the PiJuice config tool with `pijuice_cli`
2. In the system task menu, set `System task enabled` as well as `Min charge` to a reasonable value, such as 10% or 15%
3. In the system events menu, set `Low charge` to the command `SYS_FUNC_HALT_POW_OFF`. This will perform a graceful shutdown and then turn off the power.
