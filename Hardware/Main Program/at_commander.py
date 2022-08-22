import serial

class ATCommander:
    '''
    Send AT Commands to the Telit module.
    
    Possible commands and their expected output can be found here:
    https://sixfab.com/wp-content/uploads/2022/05/Telit_LE910Cx_AT_Commands_Reference_Guide_r14.pdf
    '''
    
    # Configure serial interface options
    _ser = serial.Serial()
    _ser.port = '/dev/ttyUSB2'
    _ser.baudrate = 115200
    _ser.timeout = 10

    def __init__(self):
        # Open the serial port
        if not self._ser.is_open:
            try:
                self._ser.open()
            except serial.serialutil.SerialException:
                print("Unable to open serial interface to modem")

    def runCommand(self, command: str):
        if self._ser.is_open:
            # Clear any input from the connection
            if self._ser.inWaiting() > 0:
                self._ser.flushInput()
            # Send command to the module
            self._ser.write(command.encode() + b'\r')
            # First line sent back is newline on /dev/ttyUSB2 for some reason
            self._ser.readline()
            # Return the command response (need to double check it's always the second line)
            return self._ser.readline().decode().strip()
        else:
            return "Error: Serial not connected"
