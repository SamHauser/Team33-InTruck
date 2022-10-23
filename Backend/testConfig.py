


# python file for extending the tests. This is for the test data that will be used for the unit tests.

# user details for use to get token
userTokenParams = {
    "grant_type": "",
    "username": "Admin",
    "password": "dGhlYWN0dWFscGEkJHdvcmQ=",
    "scope": "",
    "client_id": "",
    "client_secret": ""
}

# Test device config
deviceConfig = {
  "device_name": "InTruck3",
  "vehicle_rego": "RTF065",
  "max_temp": 35,
  "min_temp": 4,
  "max_hum": 95,
  "min_hum": 60
}

# test.users password = greatPencilCase
# test.users updated password = PencilCaseForAll, Base64 = UGVuY2lsQ2FzZUZvckFsbA==
User = {
  "username": "test.user",
  "first_name": "Test",
  "last_name": "User",
  "password": "Z3JlYXRQZW5jaWxDYXNl"
}

# Dummy device data to test on
deviceDataList = [
    {"device_name": 'InTruck5',"timestamp": 1662444963.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 30,"voltage": 0.108,"current": 0},"alert": {"type": 'door', "value" : 'lux value'}},
    {"device_name": 'InTruck5',"timestamp": 1662358563.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 29,"voltage": 0.108,"current": 0},"alert": {"type": 'impact', "value" : 'gforce value'}},
    {"device_name": 'InTruck5',"timestamp": 1662272163.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 28,"voltage": 0.108,"current": 0}},
    {"device_name": 'InTruck6',"timestamp": 1662444963.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 30,"voltage": 0.108,"current": 0},"alert": {"type": 'door', "value" : 'lux value'}},
    {"device_name": 'InTruck6',"timestamp": 1662358563.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 29,"voltage": 0.108,"current": 0},"alert": {"type": 'impact', "value" : 'gforce value'}},
    {"device_name": 'InTruck6',"timestamp": 1662272163.408958,"network": {},"environment": { "temperature": "null", "humidity": "null", "air_pressure": "null" },"battery": {"installed": "false","charging": "false","charge_level": 0,"temp": 28,"voltage": 0.108,"current": 0}}
  
]