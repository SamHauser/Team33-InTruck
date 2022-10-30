from pijuice import PiJuice # Import the battery module
import bme680 # Air quality sensor
import gpsd # Import GPS library
import msa301 #Accelerometer
from bh1745 import BH1745
from at_commander import ATCommander # Send AT commands to Telit module
import logging
from threading import Event
import time
log = logging.getLogger(__name__)

class Device:
    def __init__(self):
        self._atsender = ATCommander()
        # GTP is the approximate location using wifi networks
        self._gtp_last_sent = 0
        self._last_gtp_data = {}
    
    # Used to warm up sensors/start gps etc
    def init(self):
        log.info("Initialising hardware and sensors")
        self._battery = PiJuice(1, 0x14)

        # Air quality sensor
        log.info("Detecting air quality sensor")
        try:
            self._air_sensor = bme680.BME680(bme680.I2C_ADDR_PRIMARY)
            self._air_sensor.set_humidity_oversample(bme680.OS_2X)
            self._air_sensor.set_pressure_oversample(bme680.OS_4X)
            self._air_sensor.set_temperature_oversample(bme680.OS_8X)
            self._air_sensor.set_filter(bme680.FILTER_SIZE_3)
        except (RuntimeError, OSError) as err:
            self._air_sensor = None
            log.warning(f"Unable to connect to air quality sensor: {err}")
        
        # Accelerometer
        log.info("Detecting accelerometer")
        try:
            self._accelerometer = msa301.MSA301()
            self._accelerometer.reset()
            self._accelerometer.set_power_mode('normal')
            self._accelerometer.enable_interrupt(['freefall_interrupt'])
        except (RuntimeError, OSError) as err:
            self._accelerometer = None
            log.warning(f"Unable to connect to accelerometer: {err}")
        
        # Luminance sensor
        log.info("Detecting Luminance Sensor")
        try:
            self._luminance = BH1745()
            self._luminance.setup()
            self._luminance.set_leds(0)
            self._luminance.set_measurement_time_ms(2560)
        except (RuntimeError, OSError) as err:
            self._luminance = None
            log.warning(f"Unable to connect to luminance sensor: {err}")
        
        self._start_cellular()
        self._enable_gps()
        gpsd.connect()
        # Give time for GPSD to connect
        time.sleep(0.2)

    def _start_cellular(self):
        '''Starts the ECM connection. Must be done for internet after a reboot.'''
        for _ in range(3):
            log.info("Enabling cellular connection...")
            self._atsender.runCommand("AT#ECM=1,0")
            response = self._atsender.runCommand("AT#ECM?")
            if response == "#ECM: 0,1":
                log.info("Cellular connection enabled")
                break
            else:
                log.warning(f"Error enabling cellular connection: {response}")
                time.sleep(5)

    def _enable_gps(self):
        '''Starts the GPS session'''
        for _ in range(3):
            log.info("Enabling GPS...")
            self._atsender.runCommand("AT$GPSP=1")
            response = self._atsender.runCommand("AT$GPSP?")
            if response == "$GPSP: 1":
                log.info("GPS Enabled")
                break
            else:
                log.warning(f"Error enabling GPS hardware: {response}")
                time.sleep(5)
    
    def set_led(self, r: int, g: int, b: int):
        '''Set the PiJuice LED colour via RGB (0-255)'''
        try:
            self._battery.status.SetLedState("D2", [r, g, b])
        except:
            pass

    def get_temperature(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # Degrees Celsius
                return self._air_sensor.data.temperature
        return None

    def get_humidity(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # Relative humidity (%)
                return self._air_sensor.data.humidity
        return None
    
    def get_air_pressure(self):
        if self._air_sensor is not None:
            if self._air_sensor.get_sensor_data():
                # hectoPascals (hPa)
                return self._air_sensor.data.pressure
        return None

    def wait_for_freefall(event):#used by thread to detect interrupt
        while True:
            accel.wait_for_interrupt('freefall_interrupt', polling_delay=0.05)
            event.set() #sets the event flag

    def get_network_info(self):
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
        
        if info:
            return info
        else:
            return None

    def get_location(self):
        try:
            packet = gpsd.get_current()
        except UserWarning:
            # log.warning("Unable to connect to local GPSD server")
            packet = None

        # Packet mode - 0 = no data, 1 = no fix, 2 = 2D fix, 3 = 3D fix
        if packet is not None and packet.mode > 1:
            return {
                "type": "GPS",
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
        # Only update wifi-based location periodically
        elif time.monotonic() - self._gtp_last_sent > 20:
            # Get approx location via WiFi networks while waiting for GPS lock
            response = self._atsender.runCommand("AT#GTP").split(",")
            if len(response) >= 4:
                self._gtp_last_sent = time.monotonic()
                self._last_gtp_data = {
                    "type": "WiFi",
                    "lat": response[0][6:],
                    "lon": response[1],
                    "alt": response[2]
                }
                return self._last_gtp_data
        # If there's an error, expire the info
        elif time.monotonic() - self._gtp_last_sent < 60:
            return self._last_gtp_data
        else:
            return None
        
    def get_battery_info(self):
        try:
            basic_stats = self._battery.status.GetStatus()["data"]["battery"]
        except KeyError:
            battery_present = False
        try:
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
        except NameError:
            battery_present = False #catches error if battery isnt there
        if battery_present:
            return {
                "installed": battery_present,
                "charging": charging,
                "charge_level": self._battery.status.GetChargeLevel().get("data", 0),
                "temp": self._battery.status.GetBatteryTemperature().get("data", 0),
                "voltage": self._battery.status.GetBatteryVoltage().get("data", 0) / 1000,
                "current": self._battery.status.GetBatteryCurrent().get("data", 0) / 1000,
                # "faults": self._battery.status.GetFaultStatus().get("data", {})
            }
        else:
            return {
                "installed": battery_present,
            }

    #used by thread to detect interrupt
    def wait_for_freefall(self, event):
        if self._accelerometer:
            while True:
                self._accelerometer.wait_for_interrupt('freefall_interrupt', polling_delay=0.05)
                event.set()

    def detect_door_open(self, event):
        if self._luminance:
            while True:
                r, g, b= self._luminance.get_rgb_scaled()
                log.info('RGB: {:10.1f} {:10.1f} {:10.1f}'.format(r, g, b))
                rgb_data = [r,g,b]
                for x in rgb_data:
                    if x > 10:
                        event.set() #door must be open
                time.sleep(2) #exposure time

    def check_for_freefall(self, event): #for payload
        if event.is_set():
            event.clear()
            return True
        else:
            return False

    def check_door_open(self, event):
        if event.is_set():
            event.clear()
            return True
        else:
            return False
