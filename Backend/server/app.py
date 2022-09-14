from fastapi import FastAPI
from server.configRoutes import configRouter as userConfigRoutes
from server.deviceRoutes import deviceRouter as deviceDataRoutes
from server.userRoutes import userRouter as userDataRoutes
from fastapi.middleware.cors import CORSMiddleware
#from server.databaseRoutes import dbRouter as dbRoutes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userConfigRoutes, tags=["Device Config"], prefix="/config")
app.include_router(deviceDataRoutes, tags=["Device Data"], prefix="/device")
app.include_router(userDataRoutes, tags=["User Data"], prefix="/users")
#app.include_router(dbRoutes, tags=["Databases"], prefix="/databases")

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Default Page: In-Truck Monitoring System"}


