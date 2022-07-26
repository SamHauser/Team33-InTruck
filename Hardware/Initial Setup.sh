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

# Enable I2C go to 3 -> I2C and enable
sudo raspi-config

# More to come