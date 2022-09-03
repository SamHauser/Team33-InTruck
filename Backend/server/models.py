from typing import Optional
import uuid
from datetime import datetime

from pydantic import BaseModel, Field

class ClientSchema(BaseModel):
    #id: str = Field(default_factory=uuid.uuid4, alias="_id")
    device_name: str = Field(...)
    user_id: str = Field(...)
    max_temp: str = Field(...)
    min_temp: str = Field(...)
    max_hum: str = Field(...)
    min_hum: str = Field(...)
    last_update = Field(datetime.now())

    class Config:
        schema_extra = {
            "example": {
                "device_name": "In-Truck2",
                "user_id": "t.jones",
                "max_temp": "30",
                "min_temp": "4",
                "max_hum": "98",
                "min_hum": "70",
            }
        }

class UpdateClient(BaseModel):
    device_name: Optional[str]
    user_id: Optional[str]
    max_temp: Optional[str]
    min_temp: Optional[str]
    max_hum: Optional[str]
    min_hum: Optional[str]
    last_update = Field(datetime.now())

    class Config:
        schema_extra = {
            "example": {
                "device_name": "In-Truck2",
                "user_id": "t.jones",
                "max_temp": "30",
                "min_temp": "4",
                "max_hum": "98",
                "min_hum": "70",
            }
        }


def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}