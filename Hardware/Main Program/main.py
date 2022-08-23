from device import Device
import time
import json
import socket
import paho.mqtt.client as mqtt

DEVICE_NAME = socket.gethostname()

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

    mqttc = connect_mqtt("203.101.231.176", 1883, DEVICE_NAME, "admin", "rogerthat")
    # Give time for it to connect
    for _ in range(10):
        if mqttc.connected_flag:
            break
        time.sleep(0.1)

    message_elements = [
        MessageElement("network", 2, device.network_info),
        MessageElement("environment", 5, {
            "temperature": device.temperature,
            "humidity": device.humidity,
            "air_pressure": device.air_pressure
        }),
        MessageElement("battery", 10, device.battery_info)
    ]

    while True:
        message_to_send = {
            "timestamp": time.time()
        }
        ref_time = time.monotonic()
        for element in message_elements:
            if ref_time - element.last_sent > element.send_freq:
                message_to_send[element.name] = element.data
                element.last_sent = ref_time

        # Set publish success for each message
        publish_success = False
        # connected_flag should be true if connected. When disconnected will take ~1 min to change to false.
        # Changes back to true pretty quick on reconnect. This is done with the callback functions.
        if mqttc.connected_flag:
            # Attempt to publish message above as JSON
            result = mqttc.publish("python/mqtt", json.dumps(message_to_send), qos=1)
            try:
                # Give it a sec for the server to confirm it is published (for qos 1 and I think also 2)
                result.wait_for_publish(timeout=1)
                publish_success = result.is_published()
            except RuntimeError as err_msg:
                print("Unable to publish:", err_msg)
        # If it was unable to publish the message, save it locally for sending later (messages will include the original timestamp)
        if not publish_success:
            print("In the future will save to local storage here")
        else:
            print("Published message")

        # Will change in future
        time.sleep(2)


if __name__ == "__main__":
    main()