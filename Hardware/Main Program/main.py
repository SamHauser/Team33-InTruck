from device import Device
from mqtt_connector import MqttConnector
import time
import logging
# from math import gcd
import json
import socket
import atexit
import sqlite3
from contextlib import closing
from decouple import config

DEVICE_NAME = socket.gethostname()
# To use the config() functions below, create a file called .env in the main program folder.
# Add the info like this, line by line:
    # MQTT_BROKER_PORT=1883
# etc. This means configuration is not hard coded.
MQTT_ADDRESS = config('MQTT_BROKER_ADDRESS')
MQTT_PORT = config('MQTT_BROKER_PORT', default=1883, cast=int)
MQTT_USERNAME = config('MQTT_USERNAME')
MQTT_PASS = config('MQTT_PASSWORD')

class MessageElement:
    def __init__(self, name: str, send_freq: float, data):
        self.name = name
        self.send_freq = send_freq
        self.data = data
        self.last_sent = 0

def exit_handler(device):
    logging.info("Exiting")
    # Turn off led when program is quit
    device.set_led(0, 0, 0)


def main():
    logging.info("Starting application")
    device = Device()
    device.init()
    atexit.register(exit_handler, device)
    # Set LED to blue to indicate initial connection
    device.set_led(0, 0, 100)

    mqttc = MqttConnector()
    mqttc.connect(MQTT_ADDRESS, MQTT_PORT, DEVICE_NAME, MQTT_USERNAME, MQTT_PASS)
    # Give time for it to connect
    for _ in range(10):
        if mqttc.connected_flag:
            break
        time.sleep(0.1)

    # Create list of what to include in the json payload
    message_elements = [
        MessageElement("network", 2, device.network_info),
        MessageElement("environment", 5, {
            "temperature": device.temperature,
            "humidity": device.humidity,
            "air_pressure": device.air_pressure
        }),
        MessageElement("battery", 10, device.battery_info)
    ]

    # loop_rest = gcd([element.send_freq for element in message_elements])
    loop_rest = 1

    with closing(sqlite3.connect("local_cache.db")) as connection:
        with closing(connection.cursor()) as db_cursor:
            # Configure local storage
            db_cursor.execute("CREATE TABLE IF NOT EXISTS stored_messages (json_payload TEXT)")
            connection.commit()
            # Main loop for device
            while True:
                message_payload = {}
                # Monotonic time always counts up and is unrelated to device time/timezone changes
                ref_time = time.monotonic()
                for element in message_elements:
                    # Only collect data if it's been enough time since it was last sent
                    if ref_time - element.last_sent > element.send_freq and element.data:
                        message_payload[element.name] = element.data
                        element.last_sent = ref_time
                
                if len(message_payload) != 0:
                    # Add device name and timestamp
                    message_payload["device_name"] = DEVICE_NAME
                    message_payload["timestamp"] = time.time()
                    # Publish function returns true or false for success
                    if mqttc.publish("python/mqtt", json.dumps(message_payload)):
                        logging.info(f"Published message with {list(message_payload.keys())}")
                        device.set_led(0, 60, 0)
                        # If there's any cached data, use the waiting time here to send it
                        while ref_time > time.monotonic() - loop_rest:
                            # Take the oldest entry
                            row = db_cursor.execute("SELECT rowid, * FROM stored_messages").fetchone()
                            # Don't send if there is no data
                            if row is None:
                                break
                            else:
                                logging.info(f"Publishing cache entry {row[0]}")
                                # Publish cached data
                                if mqttc.publish("python/mqtt", row[1]):
                                    # If the message was successfully sent, remove it from local storage
                                    db_cursor.execute("DELETE FROM stored_messages WHERE rowid = ?", (row[0],))
                                    connection.commit()
                    else:
                        # Save data locally if it can't connect
                        logging.info("Unable to publish, saving locally")
                        device.set_led(60, 0, 0)
                        db_cursor.execute("INSERT INTO stored_messages VALUES (?)", (json.dumps(message_payload),))
                        connection.commit()

                # Sleep for the remaining time, accounting for the time needed for the sending code above
                sleep_time = ref_time - time.monotonic() + loop_rest
                if sleep_time > 0:
                    time.sleep(sleep_time)


if __name__ == "__main__":
    logging.basicConfig(filename='intruck.log', format='%(asctime)s - %(message)s', level=logging.INFO)
    main()