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
    ClientSchema,
    UpdateClient,
)

router = APIRouter()

# Add or Update, a users config
@router.post("/", response_description="Config data added into the database")
async def add_update_client(clientConfig: ClientSchema = Body(...)):
    Config = jsonable_encoder(clientConfig)
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
@router.get("/getConfig/", response_description="User config data retrieved")
async def get_client_config_data(user_id: str, device_name: str):
    config = await retrieveConfig(user_id, device_name)
    if config:
        return ResponseModel(config, "User config retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "User config doesn't exist.")