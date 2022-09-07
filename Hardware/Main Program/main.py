from device import Device
import time
import json
import socket
import sqlite3
from contextlib import closing
import paho.mqtt.client as mqtt
from decouple import config

DEVICE_NAME = socket.gethostname()
LOCAL_DB_NAME = "local_cache.db"
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

# Runs when the MQTT loop thread connects
def mqtt_connect_callback(client, userdata, flags, reasonCode, properties):
    # Reason code 0 is successful connection
    if reasonCode == 0:
        client.connected_flag = True
        print("Connected to MQTT broker:", reasonCode)
    else:
        print("Unable to connect to MQTT broker:", reasonCode)

# Runs when the MQTT loop thread disconnects (can take ~1 min after connection drops to trigger)
def mqtt_disconnect_callback(client, userdata, reasonCode, properties):
    client.connected_flag = False
    print("MQTT disconnected:", reasonCode)

def connect_mqtt(server_address, port, client_id, username=None, password=None):
    # Sets connected flag in class
    mqtt.Client.connected_flag = False
    connection = mqtt.Client(client_id, protocol=mqtt.MQTTv5)
    # Set username and password, if provided
    if None not in [username, password]:
        connection.username_pw_set(username, password)
    # Bind callback functions
    connection.on_connect = mqtt_connect_callback
    connection.on_disconnect = mqtt_disconnect_callback
    print(f"Connecting to MQTT broker at {server_address}:{port} with client ID {client_id}")
    try:
        connection.connect(server_address, port, keepalive=60)
    except OSError as err_msg:
        print("Unable to connect to MQTT broker:", err_msg)
    # Opens loop in another thread. Will automatically attempt reconnection
    connection.loop_start()
    return connection

def main():
    device = Device()
    device.init()

    # Configure local storage
    with closing(sqlite3.connect(LOCAL_DB_NAME)) as connection:
        with closing(connection.cursor()) as db_cursor:
            db_cursor.execute("CREATE TABLE IF NOT EXISTS stored_messages (json_payload TEXT)")
            connection.commit()

    mqttc = connect_mqtt(MQTT_ADDRESS, MQTT_PORT, DEVICE_NAME, MQTT_USERNAME, MQTT_PASS)
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

    with closing(sqlite3.connect(LOCAL_DB_NAME)) as connection:
        with closing(connection.cursor()) as db_cursor:
            # Main loop for device
            while True:
                message_payload = {}
                ref_time = time.monotonic()
                for element in message_elements:
                    if ref_time - element.last_sent > element.send_freq:
                        message_payload[element.name] = element.data
                        element.last_sent = ref_time
                
                if len(message_payload) != 0:
                    # Add device name and timestamp
                    message_payload["device_name"] = DEVICE_NAME
                    message_payload["timestamp"] = time.time()
                    # Set publish success for each message
                    publish_success = False
                    # connected_flag should be true if connected. When disconnected will take ~1 min to change to false.
                    # Changes back to true pretty quick on reconnect. This is done with the callback functions.
                    if mqttc.connected_flag:
                        # Attempt to publish message above as JSON
                        result = mqttc.publish("python/mqtt", json.dumps(message_payload), qos=1)
                        try:
                            # Give it a sec for the server to confirm it is published (for qos 1 and I think also 2)
                            result.wait_for_publish(timeout=1)
                            publish_success = result.is_published()
                        except RuntimeError as err_msg:
                            print("Unable to publish:", err_msg)
                    # If it was unable to publish the message, save it locally for sending later (messages will include the original timestamp)
                    if not publish_success:
                        db_cursor.execute("INSERT INTO stored_messages VALUES (?)", (json.dumps(message_payload),))
                        connection.commit()
                        print("Unable to publish, saved locally", message_payload)
                    else:
                        print("Published message", message_payload)

                # Will change in future
                time.sleep(1)


if __name__ == "__main__":
    main()