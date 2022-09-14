from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    updateConfig,
    retrieveConfig,
    retrieveConfigs,
)

from server.models import (
    ErrorResponseModel,
    ResponseModel,
    DeviceSchema,
    UpdateDevice,
)

configRouter = APIRouter()

# Add or Update, a users config
@configRouter.post("/", response_description="Config data added into the database")
async def add_update_client(deviceConfig: DeviceSchema = Body(...)):
    Config = jsonable_encoder(deviceConfig)
    updatedConfig = await updateConfig(Config)
    if updateConfig == "Update Successful":
        return ResponseModel(updatedConfig, "Config Updated successfully.")
    if updateConfig == "Update Failed":
        return ErrorResponseModel("An error occurred.", 418, "Could not update")
    if updateConfig == "Added Successful":
        return ResponseModel(updatedConfig, "Config added successfully.")
    if updateConfig == "Added Failed":
        return ErrorResponseModel("An error occurred.", 418, "Could not create")

#  Get a users config using the user_id and device_name
@configRouter.get("/getConfig/{device_name}", response_description="Device config data retrieved")
async def get_client_config_data(device_name: str):
    config = await retrieveConfig(device_name)
    if config:
        return ResponseModel(config, "Device config retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Device config doesn't exist.")