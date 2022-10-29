# Cloud Server Software Installation and Setup Guide
This guide will cover the installation and setup of several services and applications required for the InTruck project. These services are:
1. EMQX community edition (this is the MQTT Broker)
2. MongoDB (the database used)
3. Node-Red (to process the incoming MQTT messages)
4. FastAPI (API used for the project)

This guide DOES NOT cover the setup of the cloud server and or opening ports, and configuring firewalls.
***
## EMQX Installation and Setup
### Installation
---
Install the required dependency from the Ubuntu terminal or ssh window
```console
sudo apt update && sudo apt install -y \
apt-transport-https \
ca-certificates \
curl \
gnupg-agent \
software-properties-common
```
Add the GPG key for EMQ X
```console
curl -fsSL https://repos.emqx.io/gpg.pub | sudo apt-key add -
```
```console
sudo apt-key fingerprint 3E640D53
```
Setup the stable repository
```console
sudo add-apt-repository \
"deb [arch=amd64] https://repos.emqx.io/emqx-ce/deb/ubuntu/ \
$(lsb_release -cs) \
stable
```
Update apt package index
```Console
sudo apt update
```
Install the latest version of EMQ X
```Console
sudo apt install emqx
```
Systemctl start
```Console
sudo systemctl start emqx
```
Service start
```Console
sudo service emqx start
```
To check the status of the service
```Console
emqx_ctl status
```
### Setup
---
The default TCP ports used by the EMQ X message server include:
Port|Service|
|---|------------------|
1883|MQTT protocol port|
|8883|MQTT/SSL port|
8083|MQTT/WebSocket port|
8080|HTTP API port|
18083|Dashboard Management Console Port|

Port 1883 must be open for public access

Diagram to help understand the Subscriber/Publisher model
![MQTT Diagram](https://emqxio-docs.emqx.net/docs/docs-assets/img/guide_1.479a9e54.png)

#### Authentication
We need to first disable ananymous authentication. Without changing this then anyone with the public address can start using the MQTT Broker

Navigate, open and edit the emqx configuration file. From the base location this is found at etc/emqx/emqx.conf
Use these 2 command to open and edit the file. The first command is to get you to the base location
```Console
cd ../..
sudo nano etc/emqx/emqx.conf
```
Find and replace this line _allow_anonymous = true_ to
```Console
allow_anonymous = false
```

Next we need to add authentication for the MQTT message. Navigate, open and edit the mnesia configuration file. From the base this is found at etc/emqx/plugins/emqx_auth_mnesia.conf
Use this command to open and edit the file, assuming you are still in the base location
```Console
sudo nano etc/emqx/plugins/emqx_auth_mnesia.conf
```
Add these next two commands at the bottom of this file, then save and close. These are the credentials that the device uses to authenticate the MQTT publishing messages
```Console
auth.user.1.username = admin
auth.user.1.password = rogerthat
```
Start the mnnesia service
```Console
sudo emqx_ctl plugins load emqx_auth_mnesia
```
Restarting the service to update the changes is needed. This can take some time
```Console
sudo emqx restart
```