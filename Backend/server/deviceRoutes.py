from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    retrieveDevicesNames,
    retrieveDeviceData
)

from server.models import (
    ErrorResponseModel,
    ResponseModel,
)

aRouter = APIRouter()

#  Get all device_names that are unique
@aRouter.get("/getDeviceNames/", response_description="Device names retrieved")
async def get_device_names():
    devices = await retrieveDevicesNames()
    if devices:
        return ResponseModel(devices, "Device names retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Issue retrieving names.")

#  Get a users config using the user_id and device_name
@aRouter.get("/getDeviceData/", response_description="Device data retrieved")
async def get_device_data(device_name: str):
    device = await retrieveDeviceData(device_name)
    if device:
        return ResponseModel(device, "Device data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Device name doesn't exist.")