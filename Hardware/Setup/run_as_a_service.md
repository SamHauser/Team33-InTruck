# Installing the software to run on boot as a service
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