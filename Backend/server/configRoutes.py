from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder

from server.database import (
    updateConfig,
    retrieveConfig,
    is_authorised,
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
async def add_update_device_config(deviceConfig: DeviceSchema = Body(...), is_authorised: bool = Depends(is_authorised)):
    Config = jsonable_encoder(deviceConfig)
    updatedConfig = await updateConfig(Config)
    if updatedConfig == "Update Successful":
        return ResponseModel(updatedConfig, "Config updated successfully.")
    if updatedConfig == "Update Failed":
        return ErrorResponseModel("An error occurred.", 418, "Could not update")
    if updatedConfig == "Added Successful":
        return ResponseModel(updatedConfig, "Config added successfully.")
    if updatedConfig == "Added Failed":
        return ErrorResponseModel("An error occurred.", 418, "Could not create")

#  Get a users config using the user_id and device_name
@configRouter.get("/getConfig/{device_name}", response_description="Device config data retrieved")
async def get_device_config_data(device_name: str, is_authorised: bool = Depends(is_authorised)):
    config = await retrieveConfig(device_name)
    if config == "Configuration could not be found":
        return ErrorResponseModel("An error occurred.", 404, "Device config doesn't exist.")
    if config:
        return ResponseModel(config, "Device config retrieved successfully")
    else:
        return ErrorResponseModel("An error occurred.", 404, "Unknown error")