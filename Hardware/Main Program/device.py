import time
from pijuice import PiJuice # Import the battery module
import bme680 # Air quality sensor
import gpsd # Import GPS library
from at_commander import ATCommander # Send AT commands to Telit module

class Device:
    def __init__(self):
        self._atsender = ATCommander()
    
    # Used to warm up sensors/start gps etc
    def init(self):
        print("Initialising hardware and sensors")
        self._battery = PiJuice(1, 0x14)
        # Air quality sensor
        try:
            print("Detecting air quality sensor")
            self._air_sensor = bme680.BME680(bme680.I2C_ADDR_PRIMARY)
            self._air_sensor.set_humidity_oversample(bme680.OS_2X)
            self._air_sensor.set_pressure_oversample(bme680.OS_4X)
            self._air_sensor.set_temperature_oversample(bme680.OS_8X)
            self._air_sensor.set_filter(bme680.FILTER_SIZE_3)
        except RuntimeError:
            self._air_sensor = None
            print("Unable to detect to air quality sensor")
        self._start_cellular()
        self._enable_gps()
        print("Connecting to local GPSD server")
        gpsd.connect()

    def _start_cellular(self):
        '''Starts the ECM connection. Must be done for internet after a reboot.'''
        self._atsender.runCommand("AT#ECM=1,0")
        response = self._atsender.runCommand("AT#ECM?")
        if response == "#ECM: 0,1":
            print("Cellular connection enabled")
        else:
            print("Error enabling cellular connection")

    def _enable_gps(self):
        '''Starts the GPS session'''
        self._atsender.runCommand("AT$GPSP=1")
        response = self._atsender.runCommand("AT$GPSP?")
        if response == "$GPSP: 1":
            print("GPS Enabled")
        else:
            print("Error enabling GPS hardware")

    # Properties are similar to getters/setters
    # from other languages
    @property
    def temperature(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # Degrees Celsius
                return self._air_sensor.data.temperature
        return None

    @property
    def humidity(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # Relative humidity (%)
                return self._air_sensor.data.humidity
        return None
    
    @property
    def air_pressure(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # hectoPascals (hPa)
                return self._air_sensor.data.pressure
        return None

    @property
    def network_info(self):
        info = {}

        # Splits the response into a list
        response = self._atsender.runCommand("AT+COPS?").split(",")
        if len(response) >= 4:
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
        if len(response) >= 2:
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
        try:
            packet = gpsd.get_current()
        except UserWarning:
            print("Unable to connect to local GPSD server")
            packet = None

        # Packet mode - 0 = no data, 1 = no fix, 2 = 2D fix, 3 = 3D fix
        if packet is not None and packet.mode > 1:
            return {
                "fix": True,
                "lat": packet.lat,
                "lon": packet.lon,
                "sats": packet.sats,
                "speed": packet.hspeed,
                "alt": packet.alt,
                # "gps_time": packet.time,
                "speed_err": packet.error.get("s", 0),
                "lat_err": packet.error.get("y", 0),
                "lon_err": packet.error.get("x", 0)
            }
        else:
            return {
                "fix": False
            }
        
    @property
    def battery_info(self):
        try:
            basic_stats = self._battery.status.GetStatus()["data"]["battery"]
        except KeyError:
            return {"installed": False}
        if basic_stats in ["CHARGING_FROM_IN", "CHARGING_FROM_5V_IO"]:
            charging = True
            battery_present = True
        elif basic_stats == "NORMAL":
            charging = False
            battery_present = True
        elif basic_stats == "NOT_PRESENT":
            charging = False
            battery_present = False
        else:
            charging = None
            battery_present = None

        return {
            "installed": battery_present,
            "charging": charging,
            "charge_level": self._battery.status.GetChargeLevel().get("data", 0),
            "temp": self._battery.status.GetBatteryTemperature().get("data", 0),
            "voltage": self._battery.status.GetBatteryVoltage().get("data", 0) / 1000,
            "current": self._battery.status.GetBatteryCurrent().get("data", 0) / 1000,
            # "faults": self._battery.status.GetFaultStatus().get("data", {})
        }