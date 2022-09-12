# To allow the buttons to run these scripts, follow these steps

1. Add the main program to start/stop as a service (no requirement to make it start on boot)
2. Copy the `.sh` files into the `/usr/local/bin` folder
3. Use `chown` and `chgrp` to set the permissions to the default user account on the device (run the `id` command, the user with id 1000)
4. Use `chmod +x script_name.py` to make the scripts executable
5. Open the PiJuice configuration with `pijuice_cli`
6. Add the file location/name to the user scripts page
7. Add the user scripts to run when the buttons are pressed (e.g. SW2 and SW3)