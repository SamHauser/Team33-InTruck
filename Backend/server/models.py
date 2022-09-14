from typing import Optional
import uuid


from pydantic import BaseModel, Field

class DeviceSchema(BaseModel):
    #id: str = Field(default_factory=uuid.uuid4, alias="_id")
    device_name: str = Field(...)
    vehicle_rego: str = Field(...)
    max_temp: int = Field(...)
    min_temp: int = Field(...)
    max_hum: int = Field(...)
    min_hum: int = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "device_name": "In-Truck2",
                "vehicle_rego": "FTR065",
                "max_temp": 30,
                "min_temp": 4,
                "max_hum": 98,
                "min_hum": 70,
            }
        }

class UpdateDevice(BaseModel):
    device_name: str = Field(...)
    vehicle_rego: Optional[str]
    max_temp: Optional[str]
    min_temp: Optional[str]
    max_hum: Optional[str]
    min_hum: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "device_name": "In-Truck2",
                "vehicle_rego": "FTR065",
                "max_temp": 28,
                "min_temp": 3,
                "max_hum": 70,
                "min_hum": 45,
            }
        }

class UserSchema(BaseModel):
    #id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "username": "Admin",
                "first_name": "Nat",
                "last_name": "Brennan",
                "password": "YW1pZ2h0eXBhc3N3b3Jk",
            }
        }

class UpdateUser(BaseModel):
    username: str = Field(...)
    first_name: Optional[str]
    last_name: Optional[str]
    password: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "username": "Admin",
                "first_name": "Nat",
                "last_name": "Brennan",
                "password": "YW5vdGhlcm1pZ2h0eXBhc3N3b3Jk",
            }
        }


# class DatabaseSchema(BaseModel):
#     company_name: str = Field(...)

#     class Config:
#         schema_extra = {
#             "example": {
#                 "company_name": "In-Truck Company",
#             }
#         }




def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}