import motor.motor_asyncio
from bson.objectid import ObjectId
from bson import SON, json_util
import json
import pprint

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.InTruck # Primary Database

################### Client Config Section ######################

ClientCollection = database.get_collection("ClientConfig")

# helpers
def ClientConfigHelper(config) -> dict:
    return {
        "id": str(config["_id"]),
        "device_name": config["device_name"],
        "user_id": config["user_id"],
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
        ClientCollection.append(ClientConfigHelper(client))
    return userConfigs

# Retrieve a users current config
async def retrieveConfig(user_id: str, device_name: str):
    config = await ClientCollection.find_one({"user_id": user_id, "device_name": device_name})
    return ClientConfigHelper(config)

# Update or Create a clientConfig with matching user_id and device_name
async def updateConfig(data: dict):
    # Return false if an empty request body is sent.
    if len(data) < 1:
        return False
    config = await ClientCollection.find_one({'user_id': data['user_id']}, {'device_name': data['device_name']})
    print('found document: %s' % pprint.pformat(config))
    if config:
        _id = config['_id']
        updated_config = await ClientCollection.replace_one({'_id': ObjectId(_id)},  data )
        if updated_config:
            return "Update Successful"
        return "Update Failed"
    else:
        add_config = await ClientCollection.insert_one(data)
        if add_config:
            return "Added Successful"
        return "Added Failed"

################### Device Section ######################
DeviceCollection = database.get_collection("DeviceData")

async def retrieveDevicesNames():
    response = await database.command(SON([('distinct', 'DeviceData'), ('key', "device_name")]))
    return response

async def retrieveDeviceData(device_name: str):
    #device = DeviceCollection.find({'device_name': device_name}).sort("timestamp")
    deviceData = []
    async for deviceDoc in DeviceCollection.find({'device_name': device_name}).sort("timestamp"):
        doc = json.dumps(deviceDoc, default=json_util.default)
        deviceData.append(doc)
    return deviceData