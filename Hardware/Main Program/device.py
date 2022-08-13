from pijuice import PiJuice # Import the battery module
import gpsd # Import GPS library
from at_commander import ATCommander

class Device:
    def __init__(self):
        # Make the battery information directly accessible
        self.battery = PiJuice(1, 0x14)
        self._atsender = ATCommander()
    
    # Used to warm up sensors/start gps etc
    def init(self):
        print("Initialising hardware and sensors")
        self._startCellular()
        self._enableGps()
        gpsd.connect() # Connect to a running local GPSD server

    def _startCellular(self):
        '''Starts the ECM connection. Must be done for internet after a reboot.'''
        self._atsender.runCommand("AT#ECM=1,0")
        response = self._atsender.runCommand("AT#ECM?")
        if response == "#ECM: 0,1":
            print("Cellular connection enabled")
        else:
            print("Error enabling cellular connection")

    def _enableGps(self):
        '''Starts the GPS session'''
        self._atsender.runCommand("AT$GPSP=1")
        response = self._atsender.runCommand("AT$GPSP?")
        if response == "$GPSP: 1":
            print("GPS Enabled")
        else:
            print("Error enabling GPS")

    # Properties are similar to getters/setters
    # from other languages
    @property
    def temperature(self):
        pass

    @property
    def humidity(self):
        pass

    @property
    def networkInfo(self):
        info = {}

        # Splits the response into a list
        response = self._atsender.runCommand("AT+COPS?").split(",")
        # The [2] will access the operator name from the list obtained above
        info["operator"] = response[2].strip('\"')
        # 7, 2 and 0 are defined in the Telit module AT commands doc (see the ATCommander class info for links)
        if response[3] == "7":
            info["access_tech"] = "4G"
        elif response[3] == "2":
            info["access_tech"] = "3G"
        elif response[3] == "0":
            info["access_tech"] = "2G"
        else:
            info["access_tech"] = "Unknown"
        
        # The [6:] part will remove the first 6 characters from the module's response
        # This allows the first value to be read after splitting
        response = self._atsender.runCommand("AT+CSQ")[6:].split(",")
        # RSSI is "Received Signal Strength Indication"
        # Ranges from 0 to 31 for signal level. 99 indicates not known.
        # Higher is better
        info["rssi"] = response[0]
        # SQ is signal quality and ranges from 0 to 7. 99 indicates not known.
        # Lower is better (pretty sure, need to double check to confirm)
        info["sq"] = response[1]
        
        return info

    @property
    def location(self):
        packet = gpsd.get_current()
        return {
            "lat": packet.lat,
            "lon": packet.lon,
            "sats": packet.sats,
            "speed": packet.hspeed,
            "alt": packet.alt,
            "gps_time": packet.time,
            "speed_err": packet.error.get("s", 0),
            "lat_err": packet.error.get("y", 0),
            "lon_err": packet.error.get("x", 0)
        }