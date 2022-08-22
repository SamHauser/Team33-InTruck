from device import Device
import time
import json
import socket
import paho.mqtt.client as mqtt

DEVICE_NAME = socket.gethostname()

def mqtt_connect_callback(client, userdata, flags, reasonCode, properties):
    if reasonCode==0:
        client.connected_flag = True
        print("Connected to MQTT server:",reasonCode)
    else:
        print("Unable to connect to MQTT server:",reasonCode)

def mqtt_disconnect_callback(client, userdata, reasonCode, properties):
    client.connected_flag = False
    print("MQTT disconnected:", reasonCode)

def connect_mqtt(server_address, port, client_id, username=None, password=None):
    connection = mqtt.Client(client_id, protocol=mqtt.MQTTv5)
    if None not in [username, password]:
        connection.username_pw_set(username, password)
    connection.on_connect = mqtt_connect_callback
    connection.on_disconnect = mqtt_disconnect_callback
    print(f"Connecting to MQTT server at {server_address}:{port} with client ID {client_id}")
    connection.connect(server_address, port, keepalive=60)
    connection.loop_start()
    return connection

def main():
    device = Device()
    device.init()
    
    # print(device.battery_info)
    # print(device.network_info)
    # print(device.temperature)
    # print(device.humidity)
    # print(device.air_pressure)
    # for _ in range(2):
    #     print(device.location)
    #     time.sleep(2)

# Still work in progress
    mqttc = connect_mqtt("203.101.231.176", 1883, DEVICE_NAME, "admin", "rogerthat")
    for i in range(1000):
        # if i == 2:
        #     mqttc.disconnect()
        # elif i == 5:
        #     mqttc.reconnect()
        message_to_send = {
            "timestamp": time.time(),
            "environment": {
                "temperature": device.temperature,
                "humidity": device.humidity,
                "air_pressure": device.air_pressure
            },
            "battery": device.battery_info,
            "network": device.network_info
        }
        result = mqttc.publish("python/mqtt", json.dumps(message_to_send), qos=1)
        result.wait_for_publish(timeout=1)
        # while not result.is_published():
        #     print("publishing")
        # print(result)
        try:
            print(result.is_published())
        except RuntimeError:
            print("disconnected")
        time.sleep(2)


if __name__ == "__main__":
    main()