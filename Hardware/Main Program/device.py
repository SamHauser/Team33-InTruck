from pijuice import PiJuice # Import the battery module
import gpsd # Import GPS library
from at_commander import ATCommander

class Device:
    def __init__(self):
        self.battery = PiJuice(1, 0x14)
        self._atsender = ATCommander()
    
    # Used to warm up sensors/start gps etc
    def init(self):
        print("Initialising hardware and sensors")
        self._startCellular()
        self._enableGps()
        # Connect to a running local GPSD server
        gpsd.connect()

    def _startCellular(self):
        self._atsender.runCommand("AT#ECM=1,0")
        response = self._atsender.runCommand("AT#ECM?")
        if response == "#ECM: 0,1":
            print("Cellular connection enabled")
        else:
            print("Error enabling cellular connection")

    def _enableGps(self):
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

    # @property
    # def networkInfo(self):
    #     info = {}
    #     info["key"] = "value"

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