import paho.mqtt.client as mqtt
import random
import time

broker = "203.101.231.176"
#broker = "168.138.9.136"
port = 1883
topic = "/python/mqtt"
clientID = f'InTruckDevice-{random.randint(1, 50)}'
userName = "admin"
password = "rogerthat"

def connectMQTT():   
    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(client, userdata, flags, rc):
        if (rc == 0):
            print(f'Connected to broker at {broker}')
        else:
            print('Connection failed')
        
        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        client.subscribe("$SYS/#")

    client = mqtt.Client(clientID)
    client.username_pw_set(userName, password)
    client.on_connect = on_connect
    client.connect(broker, port, 60)
    return client