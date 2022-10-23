from fastapi import APIRouter, Body, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder

from server.database import (
    addUser,
    updateUser,
    loginUser,
    getUser,
    getAllUsers,
    createToken,
    validateToken,
    #get_current_active_user,
    #get_current_user,
    is_authorised,
)

from server.models import (
    UserSchema,
    UpdateUser,
    ErrorResponseModel,
    ResponseModel,
)

userRouter = APIRouter()

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Add, a users and user config
@userRouter.post("/add", response_description="user added into the database")
async def add_user(userData: UserSchema = Body(...), is_authorised: bool = Depends(is_authorised)):
    user = jsonable_encoder(userData)
    addAUser = await addUser(user)
    if addAUser == "Body Missing":
        return ResponseModel("An error occurred.", 418, "Body missing")
    if addAUser == "Username Exists":
        return ResponseModel(addAUser, "Username has been used.")
    if addAUser == "Added Failed":
        return ErrorResponseModel("An error occurred.", 418, "User could not be added")
    if addAUser == "Added Successful":
        return ResponseModel(addAUser, "User added successfully.")

# update, a user and user config
@userRouter.put("/update", response_description="user added into the database")
async def update_user(userData: UpdateUser = Body(...), is_authorised: bool = Depends(is_authorised)):
    user = jsonable_encoder(userData)
    updateAUser = await updateUser(user)
    if updateAUser == "Body Missing":
        return ResponseModel("An error occurred.", 418, "Body missing")
    if updateAUser == "Username Does Not Exsists":
        return ResponseModel(updateAUser, "Username does not exsist. Please add user.")
    if updateAUser == "Update Failed":
        return ErrorResponseModel("An error occurred.", 418, "User could not be added")
    if updateAUser == "Update Successful":
        return ResponseModel(updateAUser, "User updated successfully.")

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

# Return a user
@userRouter.get("/get/{username}", response_description="Returns a user if one exists")
async def get_user(username: str, is_authorised: bool = Depends(is_authorised)):
    if not is_authorised:
        ErrorResponseModel("An error occurred.", 418, "Unauthorised")
    else:
        getAUser = await getUser(username)
        if getAUser == "User was not found":
            return ErrorResponseModel("An error occurred.", 418, "Failed to find a user")
        if getAUser:
            return ResponseModel(getAUser, "True, user returned")

# Return all users
@userRouter.get("/getAll", response_description="Returns a list of all users")
async def get_users(is_authorised: bool = Depends(is_authorised)):
    if not is_authorised:
        ErrorResponseModel("An error occurred.", 418, "Unauthorised")
    else:
        getUsers = await getAllUsers()
        if len(getUsers) == 0:
            return ErrorResponseModel("An error occurred.", 418, "Failed to retrieve list of users")
        else:
            return ResponseModel(getUsers, f"True, {len(getUsers)} users returned")

@userRouter.post("/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    LoginAUser = await loginUser(form_data.username, form_data.password)
    if LoginAUser == "Incorrect user or password":
        return ErrorResponseModel("An error occurred.", 418, "Failed to find a user")
    if LoginAUser == "Passwords do not match":
        return ErrorResponseModel("An error occurred.", 418, "Username found but passwords do no match")
    else:
        getAUser = await getUser(form_data.username)
        token = await createToken(getAUser)
        return {"access_token": token, "token_type" : "bearer"}

# @userRouter.get("/me/", response_description="Gets current user")
# async def read_users_me(is_authorised = Depends(is_authorised)):
#     return is_authorised
