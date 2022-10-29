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

Offical document link
[EMQX](https://www.emqx.io/docs/en/v3.0/install.html#ubuntu)

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

Navigate, open and edit the emqx configuration file. From the base location this is found at _etc/emqx/emqx.conf_
Use these 2 command to open and edit the file. The first command is to get you to the base location
```Console
cd ../..
sudo nano etc/emqx/emqx.conf
```
Find and replace this line _allow_anonymous = true_ to
```Console
allow_anonymous = false
```

Next we need to add authentication for the MQTT message. Navigate, open and edit the mnesia configuration file. From the base this is found at _etc/emqx/plugins/emqx_auth_mnesia.conf_
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

#### Further info
If you open the Dashboard port you will want to change the default password with the config file found here _etc/emqx/plugins/emqx_dashboard.conf_

***
## MongoDB Installation and Setup
### Installation
---
Import the public key used by the package management system
```Console
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```
Create a list file for MongoDB
```Console
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```
Reload local package database
```Console
sudo apt-get update
```
Install the latest stable version
```Console
sudo apt-get install -y mongodb-org
```
Make MongoDB as a system service. This will ensure that it restarts on reboot
```Console
sudo systemctl enable mongod
```
Start the MongoDB service
```Console
sudo systemctl start mongod
```

### Setup
---
Use Mongosh to create the database. This is best done in another terminal window
```Console
mongosh
```
Create database
```Console
use InTruck
```
Create a collection with insert one, while updating the string to a secret of your choice. This is used to create oauth2 tokens for access to the API endpoints
```Console
db.jwtsecret.insertOne( { jwtsecret: "AddYourSecretHere" } );
```

There are more collections created but these will be created when they are used.

Official document link
[MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

***
## Node-Red Installation and Setup
### Installation
---
Add PPA for specific Node.js version via NodeSource's official PPA setup script
```Console
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```
Install Node.js
```Console
sudo apt-get install -y nodejs
```
Install Node-Red
```Console
sudo npm install -g --unsafe-perm node-red node-red-admin
```
If this fails you might want to upgrade. This should fix any issues
```Console
sudo apt-get upgrade -y
```
Navigate to the .node-red folder. This is a hidden folder within the home/ubuntu.
```Console
cd home/ubuntu
ls -a
cd .node-red
```
Install the MongoDB package for Node-Red
```Console
sudo npm install node-red-node-mongodb
```