import motor.motor_asyncio
from bson.objectid import ObjectId
from bson import SON, json_util
import datetime, time
import json
from hashlib import sha256
from base64 import b64encode
from datetime import datetime
import random
import pprint

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.InTruck # Primary Database

#   Attempt to make a class for the DB object but FastAPI says NO
# class db(database, collection):
#     self.MONGO_DETAILS = "mongodb://localhost:27017"
#     self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
#     self.database = self.client.database
#     self.collection = self.database.get_collection(collection)

################### Client Config Section ######################

deviceConfig = database.get_collection("deviceConfig")

# helpers
def DeviceConfigHelper(config) -> dict:
    return {
        "id": str(config["_id"]),
        "device_name": config["device_name"],
        "vehicle_rego": config["vehicle_rego"],
        "max_temp": config["max_temp"],
        "min_temp": config["min_temp"],
        "max_hum": config["max_hum"],
        "min_hum": config["min_hum"],
        "last_update": config["last_update"],
    }

# Retrieve all config docs present in the database (currently not linked)
async def retrieveConfigs():
    userConfigs = []
    async for client in ClientCollection.find():
        deviceConfig.append(DeviceConfigHelper(client))
    return userConfigs

# Retrieve a users current config
async def retrieveConfig(device_name: str):
    config = await deviceConfig.find_one({"device_name": device_name})
    return DeviceConfigHelper(config)

# Update or Create a deviceConfig matches device_name as one device can have only one config.
async def updateConfig(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    data['last_update'] = time.time()
    config = await deviceConfig.find_one({'device_name': data['device_name']})
    print('found document: %s' % pprint.pformat(config))
    if config:
        _id = config['_id']
        updated_config = await deviceConfig.replace_one({'_id': ObjectId(_id)},  data )
        if updated_config:
            return "Update Successful"
        return "Update Failed"
    else:
        add_config = await deviceConfig.insert_one(data)
        if add_config:
            return "Added Successful"
        return "Added Failed"

################### Device Section ######################
DeviceCollection = database.get_collection("DeviceData")

async def retrieveDevicesNames():
    response = await database.command(SON([('distinct', 'DeviceData'), ('key', "device_name")]))
    doc = json.dumps(response, default=json_util.default)
    return doc

async def retrieveDeviceData(device_name: str):
    #device = DeviceCollection.find({'device_name': device_name}).sort("timestamp")
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': device_name}).sort("timestamp"):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData

async def retrieveDeviceDataLast24(device_name: str):
    #device = DeviceCollection.find({'device_name': device_name}).sort("timestamp")
    #my_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(1347517370))
    now = datetime.datetime.now()
    minus24 = now - datetime.timedelta(days=10)
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': {'$eq' : device_name}, 'timestamp': {'$gt' : minus24.timestamp()}}):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData

################### Users Section ######################

userCollection = database.get_collection("Users")

# Create a User if username is new.
async def addUser(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return "Body Missing"
    salt = random.randint(0000, 9999)
    data['salt'] = salt
    data['last_update'] = time.time()
    user = await userCollection.find_one({'username': data['username']})
    print('found document: %s' % pprint.pformat(user))
    if user:
        return "Username Exsists"
    else:
        data['password'] = ("%s{%s}" % (data['password'], data['salt'])).encode()
        print(data['password'])
        print(data['salt'])
        add_user = await userCollection.insert_one(data)
        if add_user:
            return "Added Successful"
        return "Added Failed"

# update user, mainly used for updating password
async def updateUser(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return "Body Missing"
    data['last_update'] = time.time()
    user = await userCollection.find_one({'username': data['username']})
    print('found document: %s' % pprint.pformat(user))
    if user:
        _id = user['_id']
        data['password'] = ("%s{%s}" % (data['password'], user['salt'])).encode()
        data['salt'] = user['salt']
        updated_user = await userCollection.replace_one({'_id': ObjectId(_id)},  data )
        if updated_user:
            return "Update Successful"
        return "Update Failed"
    else:
        return "Username Does Not Exsists"


# Login function
async def loginUser(username: str, password: str):
    user = await userCollection.find_one({'username': username})
    print('found document: %s' % pprint.pformat(user))
    if user:
        saltedPassword = ("%s{%s}" % (password, user['salt'])).encode()
        if saltedPassword == user['password']:
            return True
        else:
            return "Passwords do not match"
    else:
        return "Incorrect user or password"

 ################### Alerts Section ######################

async def retrieveAlertsRange(timeFrom: int, timeTo: int):
    # Input should be as epoch time. JS should be Date.now()
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'alert': {'$exists' : True}, 'timestamp': {'$gt' : timeFrom, '$lt' : timeTo}}):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData


################### Database Section ######################
# DbCollection = database.get_collection("databases")

# # Check and switches Db's, returns bool
# async def checkDB(databaseInput):
#     print(databaseInput)
#     database = client.DbDatabases
#     dbs = database.get_collection("databases").find()
#     for db in await dbs:
#         if db['company_name'] == databaseInput:
#             print(db['company_name'])
#             database = client.databaseInput
#             return True
#         else:
#             return False
    

# async def createDB(data: dict):
#     # Return false if an empty request body is sent.
#     if len(data) < 1:
#         return "Body Missing"
#     # if checkDB(data['company_name']):
#     #     return "Database already exists"
#     add_db = await database.get_collection("databases").insert_one(data)
#     if add_db:
#         return "Added Successful"
#     return "Added Failed"