import paho.mqtt.client as mqtt

class MqttConnector:
    def __init__(self):
        self.connected_flag = False

    # Runs when the MQTT loop thread connects
    def _mqtt_connect_callback(self, client, userdata, flags, reasonCode, properties):
        # Reason code 0 is successful connection
        if reasonCode == 0:
            self.connected_flag = True
            print("Connected to MQTT broker:", reasonCode)
        else:
            print("Unable to connect to MQTT broker:", reasonCode)

    # Runs when the MQTT loop thread disconnects (can take ~1 min after connection drops to trigger)
    def _mqtt_disconnect_callback(self, client, userdata, reasonCode, properties):
        self.connected_flag = False
        print("MQTT disconnected:", reasonCode)

    def connect(self, server_address, port, client_id, username=None, password=None):
        self._connection = mqtt.Client(client_id, protocol=mqtt.MQTTv5)
        # Set username and password, if provided
        if None not in [username, password]:
            self._connection.username_pw_set(username, password)
        # Bind callback functions
        self._connection.on_connect = self._mqtt_connect_callback
        self._connection.on_disconnect = self._mqtt_disconnect_callback
        print(f"Connecting to MQTT broker at {server_address}:{port} with client ID {client_id}")
        try:
            self._connection.connect(server_address, port, keepalive=60)
        except OSError as err_msg:
            print("Unable to connect to MQTT broker:", err_msg)
        # Opens loop in another thread. Will automatically attempt reconnection
        self._connection.loop_start()
    
    def publish(self, topic, message):
        publish_success = False
        if self.connected_flag:
            result = self._connection.publish(topic, message, qos=1)
            try:
                # Give it a sec for the server to confirm it is published (for qos 1 and I think also 2)
                result.wait_for_publish(timeout=1)
                publish_success = result.is_published()
            except RuntimeError as err_msg:
                print("Unable to publish:", err_msg)
        return publish_success