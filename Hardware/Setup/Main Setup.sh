#! /bin/bash

# To initially configure the Pi, an image of the Raspberry Pi OS or equivalent should be written to the storage.
# This script will execute some initial configuration options.

# Update package repository:
sudo apt update

# Update packages:
sudo apt full-upgrade -y

# Install software for sensors
# Light sensor
python3 -m pip install bh1745
# Accelerometer
python3 -m pip install msa301
# Air quality
sudo pip3 install bme680

# Battery
sudo apt install pijuice-base -y

# MQTT client
sudo pip3 install paho-mqtt

# Install minicom, used for sending AT commands to the modem over serial
sudo apt install minicom -y

# Install software to read the GPS
sudo apt install gpsd gpsd-clients -y
pip3 install gpsd-py3
# Once GPSD is installed edit the /etc/default/gpsd file
# and add /dev/ttyUSB1 (or device equivalent) into the devices

# Enable I2C
echo
echo "The next step is to enable I2C, go to 3 -> I2C and enable"
read -p "Press enter to open Pi settings..."
sudo raspi-config

echo
echo "Next is to open minicom and configure the modem and GPS"
echo "See the associated files in github for instructions"
echo "To open minicom options press ctrl+a, then z"
echo "Recommend enabling local echo via this options menu"
read -p "Press enter to open minicom..."
# Sources:
    # https://docs.sixfab.com/page/cellular-internet-connection-in-ecm-mode
    # https://sixfab.com/wp-content/uploads/2022/02/Telit_LE910Cx_AT_Commands_Reference_Guide_r12.pdf
sudo minicom -b 115200 -D /dev/ttyUSB2