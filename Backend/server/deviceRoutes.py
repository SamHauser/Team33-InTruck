from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    retrieveDevicesNames,
    retrieveDeviceData,
    retrieveDeviceDataLast24
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

#  Get all device data using the device_name
@aRouter.get("/getDeviceData/", response_description="Device data retrieved")
async def get_device_data(device_name: str):
    device = await retrieveDeviceData(device_name)
    if device:
        return ResponseModel(device, "Device data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Device name doesn't exist.")

#  Get the last 24 hours of device data using the device_name to retrieve it
@aRouter.get("/getDeviceDataLast24/", response_description="Device data retrieved")
async def get_device_data_last_24H(device_name: str):
    device = await retrieveDeviceDataLast24(device_name)
    if device:
        return ResponseModel(device, f"Device data retrieved successfully, number of items returned {len(device)}")
    return ErrorResponseModel("An error occurred.", 404, "Device name doesn't \
                              exist or there was no entries for that device in the last 24 hours.")