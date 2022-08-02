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
sudo apt-get install pijuice-base -y

# Enable I2C
echo "The next step is to enable I2C, go to 3 -> I2C and enable"
read -p "Press enter to open Pi settings..."
sudo raspi-config

# More to come


# sudo apt install minicom -y

# Minicom script
# Sources:
    # https://docs.sixfab.com/page/cellular-internet-connection-in-ecm-mode
    # https://sixfab.com/wp-content/uploads/2022/02/Telit_LE910Cx_AT_Commands_Reference_Guide_r12.pdf
# send AT+CGDCONT=1,"IPV4V6","super"
# send AT#USBCFG=4
# send AT#REBOOT
# send AT#ECM=1,0