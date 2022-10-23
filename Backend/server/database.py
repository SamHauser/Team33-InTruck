import motor.motor_asyncio
import pymongo
from fastapi import Depends, HTTPException, status
from bson.objectid import ObjectId
from bson import SON, json_util
from datetime import datetime, timedelta
import time
import json
from jose import JWTError, jwt
from server.models import UserSchema
from hashlib import sha256
from base64 import b64encode
import random
import pprint
#from server.userRoutes import oauth2_scheme
from fastapi.security import OAuth2PasswordBearer

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.InTruck # Primary Database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")

#   Attempt to make a class for the DB object but FastAPI says NO
# class db(database, collection):
#     self.MONGO_DETAILS = "mongodb://localhost:27017"
#     self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
#     self.database = self.client.database
#     self.collection = self.database.get_collection(collection)

################### Device Config Section ######################

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

# Retrieve a users current config
async def retrieveConfig(device_name: str):
    config = await deviceConfig.find_one({"device_name": device_name})
    if config:
        return DeviceConfigHelper(config)
    else:
        return "Configuration could not be found"

# Update or Create a deviceConfig matches device_name as one device can have only one config.
async def updateConfig(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    data['last_update'] = time.time()
    config = await deviceConfig.find_one({'device_name': data['device_name']})
    if config:
        print("Config was found, updating now")
        _id = config['_id']
        updated_config = await deviceConfig.replace_one({'_id': ObjectId(_id)},  data )
        if updated_config:
            return "Update Successful"
        return "Update Failed"
    else:
        print("Config was NOT found, creating now")
        add_config = await deviceConfig.insert_one(data)
        if add_config:
            return "Added Successful"
        return "Added Failed"

################### Device Section ######################
DeviceCollection = database.get_collection("DeviceData")

async def retrieveDevicesNames():
    response = await database.command(SON([('distinct', 'DeviceData'), ('key', "device_name")]))
    print(response)
    doc = json.dumps(response, default=json_util.default)
    print(doc)
    return doc

async def retrieveDeviceData(device_name: str):
    #device = DeviceCollection.find({'device_name': device_name}).sort("timestamp")
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': device_name}).sort("timestamp"):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData


async def retrieveLatestEntry():
    deviceData = []
    # Get all available device names
    response = await database.command(SON([('distinct', 'DeviceData'), ('key', "device_name")]))
    for data in response["values"]:
        cursor = DeviceCollection.find({'device_name': data}).sort('timestamp', pymongo.DESCENDING)
        for document in await cursor.to_list(length=1):
            doc = json.dumps(document, default=json_util.default)
            deviceData.append(doc)
    return deviceData

async def retrieveDeviceDataLast24(device_name: str):
    #device = DeviceCollection.find({'device_name': device_name}).sort("timestamp")
    #my_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(1347517370))
    now = datetime.now()
    minus24 = now - timedelta(hours=25)
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': {'$eq' : device_name}, 'timestamp': {'$gt' : minus24.timestamp()}}):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData

async def retrieveDeviceDataRange(device_name: str, timeFrom: float, timeTo: float):
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': device_name, 'timestamp': {'$gt' : timeFrom, '$lt' : timeTo}}):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData
    
# async def retrieveAlertsRange(timeFrom: float, timeTo: float):
#     deviceData = []
#     async for deviceDoc in DeviceCollection.find({'alert': {'$exists': True}, 'timestamp': {'$gt' : timeFrom, '$lt' : timeTo}}):
#         doc = json.dumps(deviceDoc, default=json_util.default)
#         deviceData.append(doc)
#     return deviceData

################### Users Section ######################

userCollection = database.get_collection("Users")

def UserHelper(data) -> dict:
    return{
        "id": str(data["_id"]),
        "username": data["username"],
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        #"password": data["password"],
    }


# Get User from username
async def getUser(username: str, token: str = Depends(oauth2_scheme)):
    user = await userCollection.find_one({'username': username})
    del user["password"]
    if user:
        return UserHelper(user)
    else:
        return "User was not found"


# Get all User
async def getAllUsers(token: str = Depends(oauth2_scheme)):
    users = []
    async for user in userCollection.find():
        del user["password"]
        doc = json.dumps(user, default=json_util.default)
        users.append(doc)
    return users

# Get Current User 
async def is_authorised(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        secret = await database.jwtsecret.find_one()
        payload = jwt.decode(token, secret["jwtsecret"], algorithms=["HS256"])
        user = getUser(payload.get("username"))
    except JWTError:
        raise credentials_exception
    if user == "User was not found":
        return False
    return True

# Get Current Active user
# async def get_current_active_user(current_user: UserSchema = Depends(get_current_user)):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

# Create a token using username + password hashed with the salt
async def createToken(user: dict):
    secret = await database.jwtsecret.find_one()
    expire = datetime.utcnow() + timedelta(hours=24)
    userJson = {"username": user["username"], "exp": expire}
    return jwt.encode(userJson, secret["jwtsecret"])

# Validate Token
async def validateToken(token: str = Depends(oauth2_scheme)):
    secret = await database.jwtsecret.find()
    try:
        payload = jwt.decode(token, secret["jwtsecret"], algorithms = ["HS256"])
        return True
    except:
        return False
    return False

# Create a User if username is new.
async def addUser(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return "Body Missing"
    salt = random.randint(0000, 9999)
    data['salt'] = salt
    data['last_update'] = time.time()
    user = await userCollection.find_one({'username': data['username']})
    if user:
        return "Username Exsists"
    else:
        data['password'] = ("%s{%s}" % (data['password'], data['salt'])).encode()
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