from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    addUser,
    updateUser,
    loginUser,
)

from server.models import (
    UserSchema,
    UpdateUser,
    ErrorResponseModel,
    ResponseModel,
)

userRouter = APIRouter()

# Add, a users and user config
@userRouter.post("/add", response_description="user added into the database")
async def add_user(userData: UserSchema = Body(...)):
    user = jsonable_encoder(userData)
    addAUser = await addUser(user)
    if addAUser == "Body Missing":
        return ResponseModel("An error occurred.", 418, "Body missing")
    if addAUser == "Username Exsists":
        return ResponseModel(addAUser, "Username has been used.")
    if addAUser == "Added Failed":
        return ErrorResponseModel("An error occurred.", 418, "User could not be added")
    if addAUser == "Added Successful":
        return ResponseModel(addAUser, "User added successfully.")

# update, a user and user config
@userRouter.put("/update", response_description="user added into the database")
async def update_user(userData: UpdateUser = Body(...)):
    user = jsonable_encoder(userData)
    updateAUser = await updateUser(user)
    if updateAUser == "Body Missing":
        return ResponseModel("An error occurred.", 418, "Body missing")
    if updateAUser == "Username Does Not Exsists":
        return ResponseModel(updateAUser, "Username does not exsist. Please add user.")
    if updateAUser == "Update Failed":
        return ErrorResponseModel("An error occurred.", 418, "User could not be added")
    if updateAUser == "Update Successful":
        return ResponseModel(updateAUser, "User added successfully.")

# Login User
@userRouter.get("/login/{username}, {password}", response_description="True or False for successful login")
async def login_user(username: str, password: str):
    loginAUser = await loginUser(username, password)
    if loginAUser == "Incorrect user or password":
        return ErrorResponseModel("An error occurred.", 418, "Failed to find a user")
    if loginAUser == "Passwords do not match":
        return ErrorResponseModel("An error occurred.", 418, "Username found but passwords do no match")
    if loginAUser:
        return ResponseModel(loginAUser, "True, all credentials were correct")
