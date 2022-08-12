import serial

class ATCommander:
    # Configure serial interface options
    _ser = serial.Serial()
    _ser.port = '/dev/ttyUSB2'
    _ser.baudrate = 115200
    _ser.timeout = 5

    def __init__(self):
        # Open the serial port
        if not self._ser.is_open:
            self._ser.open()

    def _runCommand(self, command: str):
        # Clear any input from the connection
        if self._ser.inWaiting() > 0:
            self._ser.flushInput()
        # Send command to the module
        self._ser.write(command.encode() + b'\r')
        # First line sent back is newline on /dev/ttyUSB2 for some reason
        self._ser.readline()
        # Return the command response (need to double check it's always the second line)
        return self._ser.readline().decode().strip()

    # Example function that will enable the GPS (WIP)
    def gpsEnable(self):
        return(self._runCommand("AT$GPSP=1"))

# Example code (WIP)
atsender = ATCommander()
print(atsender.gpsEnable())