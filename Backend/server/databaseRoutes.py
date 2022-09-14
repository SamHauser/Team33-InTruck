# from fastapi import APIRouter, Body
# from fastapi.encoders import jsonable_encoder

# from server.database import (
#     createDB,
# )

# from server.models import (
#     ErrorResponseModel,
#     ResponseModel,
#     DatabaseSchema,
# )

# dbRouter = APIRouter()

# # Add database
# @dbRouter.post("/{company_name}", response_description="Add a database")
# async def add_database(database: DatabaseSchema = Body(...)):
#     db = jsonable_encoder(database)
#     addDb = await createDB(db)
#     if addDb == "Body Missing":
#         return ErrorResponseModel("An error occurred.", 418, "Body Missing")
#     if addDb == "Database already exists":
#         return ErrorResponseModel("An error occurred.", 418, "Database already exists")
#     if addDb == "Added Successful":
#         return ResponseModel(addDb, "Database added successfully.")
#     if addDb == "Added Failed":
#         return ErrorResponseModel("An error occurred.", 418, "Could not create")