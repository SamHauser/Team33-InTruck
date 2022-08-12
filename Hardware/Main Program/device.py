from pijuice import PiJuice # Import the battery module
import gpsd # Import GPS library

class Device:
    def __init__(self):
        self.battery = PiJuice(1, 0x14)
    
    # Used to warm up sensors/start gps etc
    def init(self):
        print("Initialising hardware and sensors")
        # Connect to a running local GPSD server
        gpsd.connect()

    # Properties are similar to getters/setters
    # from other languages
    @property
    def temperature(self):
        pass

    @property
    def humidity(self):
        pass

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