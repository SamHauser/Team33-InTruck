import unittest
import requests
import json
import pymongo
import testConfig as TC
import time
from datetime import datetime, timedelta
import jwt

# Database Details, used to create test data and clean up the tests
client = pymongo.MongoClient('mongodb://127.0.0.1:27017')
db = client["InTruck"]
deviceConfigCollection = db['deviceConfig']
deviceDataCollection = db['DeviceData']
usersCollection = db['Users']


# Details for the API, credentials to get Token
domain = "http://203.101.231.176:8000/"
tokenRequest = requests.post(domain + "users/token/", data = TC.userTokenParams)
tokenObject = tokenRequest.json()
token = tokenObject['access_token']
headers = {'Authorization': 'Bearer '+ token}

# Class tests for the Device Config API calls
class TestDeviceConfig(unittest.TestCase):
    # Test to add device config
    def test_add_config(self):
        print("Running Add Device Config Test")
        response = requests.post(domain + "config/", json = TC.deviceConfig,  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "Config added successfully.")

    # Test to update the current config of InTruck5, created above
    def test_update_config(self):
        print("Running Update Device Config Test")
        # Update the deviceConfig
        TC.deviceConfig["max_temp"] = 30
        TC.deviceConfig["min_hum"] = 45
        response = requests.post(domain + "config/", json = TC.deviceConfig,  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "Config updated successfully.")
        # We then use the get device config endpoint and check the changes
        response = requests.get(domain + "config/getConfig/InTruck3",  headers = headers)
        responseJson = response.json()
        self.assertIs(responseJson["data"][0]["max_temp"], 30)
        self.assertIs(responseJson["data"][0]["min_hum"], 45)

    # Test the get device config with parameter of device name
    def test_get_config(self):
        print("Running Get Device Config Test")
        parameter = "InTruck3"
        response = requests.get(domain + "config/getConfig/" + parameter,  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], 'Device config retrieved successfully')
        self.assertIs(responseJson["data"][0]["max_temp"], 35)

    # Tear Down CLass is run after all test in this class is complete.
    @classmethod
    def tearDownClass(cls):
        print("Running Tear Down after device config tests")
        # Remove the Device Config that we just created
        deviceConfigCollection.delete_one({"device_name": "InTruck3"})

# Class tests for the Device Data API calls
class TestDeviceData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print("Running set up before all tests for device data tests")
        # Creating dummy device data. 2 devices both with some alerts and days apart
        deviceDataList = TC.deviceDataList
        index = 0
        for data in deviceDataList:
            index += 1
            now = datetime.now()
            minus1Day = now - timedelta(days=1)
            minus2Day = now - timedelta(days=2)
            if index == 1:
                data["timestamp"] = now.timestamp()
            if index == 2:
                data["timestamp"] = minus1Day.timestamp()
            if index == 3:
                data["timestamp"] = minus2Day.timestamp()
                index = 0
        deviceDataCollection.insert_many(deviceDataList)

    # Test get all distinct device name values.
    def test_get_device_names(self):
        print("Running Get Device Names Test")
        response = requests.get(domain + "device/getDeviceNames/", headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn("InTruck5", responseJson["data"][0])
        self.assertIn("InTruck6", responseJson["data"][0])
        # Test against the database 
        deviceNames = deviceDataCollection.distinct("device_name")
        self.assertIn(deviceNames[2], responseJson["data"][0])
        self.assertIn(deviceNames[3], responseJson["data"][0])

    # Test get data for one device check the response and the size of the response
    def test_get_device_data(self):
        print("Running Get Device Data Test")
        parameter = "InTruck5"
        response = requests.get(domain + "device/getDeviceData/" + parameter, headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], 'Device data retrieved successfully')
        self.assertIs(len(responseJson), 3)

    # Test get latest entry for a given device
    def test_get_lastest_entry(self):
        print("Running Get Latest Entry")
        response = requests.get(domain + "device/getLatestEntry", headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        # Find the test data that was returned, this ensures that it is the latest data added
        now = datetime.now()
        minus1minute = now - timedelta(minutes=1)
        lastEntryDeviceData = []
        for data in responseJson["data"][0]:
            jsonDump = json.loads(data)
            if jsonDump["device_name"] == "InTruck5" or jsonDump["device_name"] == "InTruck6":
                timestamp = time.localtime(jsonDump["timestamp"])
                deviceTimestamp = datetime.utcfromtimestamp(jsonDump["timestamp"])
                if deviceTimestamp > minus1minute:
                    lastEntryDeviceData.append(jsonDump)
        self.assertIn(lastEntryDeviceData[0]["device_name"], 'InTruck5')
        self.assertIn(lastEntryDeviceData[1]["device_name"], 'InTruck6')
    
    # Test get device data for the last 24 hours
    def test_get_device_data_last24(self):
        print("Running Get Device Data last 24 hours")
        parameter = "InTruck6"
        response = requests.get(domain + "device/getDeviceDataLast24/" + parameter, headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], 'Device data retrieved successfully, number of items returned 2')
        jsonDump = json.loads(responseJson["data"][0][0])
        self.assertIn(jsonDump["device_name"], 'InTruck6')

    # Test get device data using device name and time range
    def test_get_device_data_range(self):
        print("Running Get Device Data within Range")
        # create time ranges in timestamp format
        now = datetime.now()
        minus23hours = now - timedelta(hours=23)
        minus49hours = now - timedelta(hours=49)
        fromTime = minus49hours.timestamp()    
        toTime = minus23hours.timestamp()
        parameters = 'InTruck6, ' + str(fromTime) + ', ' + str(toTime)
        response = requests.get(domain + "device/getDeviceDataRange/" + parameters, headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "InTruck6 device data retrieved successfully, number of items returned 2")
        DeviceDataAlerts = []
        for data in responseJson["data"][0]:
            jsonDump = json.loads(data)
            DeviceDataAlerts.append(jsonDump)
        self.assertTrue(DeviceDataAlerts[0]["timestamp"] > fromTime)
        self.assertTrue(DeviceDataAlerts[0]["timestamp"] < toTime)
        self.assertTrue(DeviceDataAlerts[1]["timestamp"] > fromTime)
        self.assertTrue(DeviceDataAlerts[1]["timestamp"] < toTime)
            
            
    # Test get device data with alert within a time range
    def test_get_alert_range(self):
        print("Running Get Device Data Alerts within a range")
        # create time ranges in timestamp format
        now = datetime.now()
        minus1Day = now - timedelta(hours=20)
        minus3Days = now - timedelta(hours=27)
        fromTime = minus3Days.timestamp()
        toTime = minus1Day.timestamp()
        parameters = str(fromTime) + ", " + str(toTime)
        response = requests.get(domain + "device/getAlertRange/" + parameters, headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "Device data retrieved successfully, number of items returned 2")
        DeviceDataAlerts = []
        for data in responseJson["data"][0]:
            jsonDump = json.loads(data)
            DeviceDataAlerts.append(jsonDump)
        self.assertTrue(DeviceDataAlerts[0]["timestamp"] > fromTime)
        self.assertTrue(DeviceDataAlerts[0]["timestamp"] < toTime)
        self.assertTrue(DeviceDataAlerts[1]["timestamp"] > fromTime)
        self.assertTrue(DeviceDataAlerts[1]["timestamp"] < toTime)


    # Remove the test data for next round of testing to be successfull
    @classmethod
    def tearDownClass(cls):
        print("Running Tear Down after device data tests")
        #deviceDataCollection.delete_many({"device_name":"InTruck5"})
        #deviceDataCollection.delete_many({"device_name":"InTruck6"})

# Class tests for the Users API calls
class TestUsers(unittest.TestCase):
    # Test add or create User
    def test_add_user(self):
        print("Running add User")
        response = requests.post(domain + "users/add/", json = TC.User,  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "User added successfully.")
        user = usersCollection.find_one({"username":"test.user"})
        self.assertIn(user["username"], "test.user")

    # Test update the above user added
    def test_update_user(self):
        print("Running update user")
        TC.User["first_name"] = "tester"
        TC.User["last_name"] = "elite"
        response = requests.put(domain + "users/update/", json = TC.User,  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "User updated successfully.")
        user = usersCollection.find_one({"username":"test.user"})
        self.assertIn(user["first_name"], "tester")
        self.assertIn(user["last_name"], "elite")

    # Test login with user credentials
    def test_users_login(self):
        print("Running user logins")
        payload = TC.User["username"] + ", " + TC.User["password"]
        response = requests.get(domain + "users/login/" + TC.User["username"] + ", " + TC.User["password"])
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "True, all credentials were correct")
        
    # Test get a users account details
    def test_get_user(self):
        print("Running get user")
        response = requests.get(domain + "users/get/" + TC.User["username"],  headers = headers)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        self.assertIn(responseJson["message"], "True, user returned")
        self.assertIn(responseJson["data"][0]["username"], "test.user")
        self.assertIn(responseJson["data"][0]["first_name"], "Test")
        self.assertIn(responseJson["data"][0]["last_name"], "User")
        
    # Test get all users account details
    def test_get_all_users(self):
        print("Running get all users")
        response = requests.get(domain + "users/getAll/",  headers = headers)
        responseJson = response.json()
        print(responseJson)
        self.assertIs(response.status_code, 200)
        #self.assertIn(responseJson["data"][2]["username"], "test.user")
        #self.assertIn(responseJson["data"][2]["first_name"], "Test")
        #self.assertIn(responseJson["data"][2]["last_name"], "User")

    # Test get token
    def test_get_token(self):
        print("Running get token")
        response = requests.post(domain + "users/token/", data = TC.User)
        responseJson = response.json()
        self.assertIs(response.status_code, 200)
        # decode without the signature to verify the details of the token
        decodedPayoad = jwt.decode(responseJson['access_token'], options={"verify_signature": False})
        self.assertIn(decodedPayoad["username"], "test.user")
        expire = datetime.utcnow() + timedelta(hours=24)
        self.assertEqual(decodedPayoad["exp"], int(expire.timestamp()))

    # Tear down removes the user created for testing from the DB
    @classmethod
    def tearDownClass(cls):
        print("Running Tear Down after Users tests")
        usersCollection.delete_one({"username":"test.user"})
        
if __name__ == '__main__':
    unittest.main()