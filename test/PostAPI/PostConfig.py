import requests

url = "http://localhost/config"

config = {'device_id': 'somewilddevicename',
          'max_temp': 15,
          'min_temp': 1,
          'max_hum': 90,
          'min_hum': 60}

x = requests.post(url, data = config, auth = ('admin', 'password'))