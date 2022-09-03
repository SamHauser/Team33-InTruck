from fastapi import FastAPI
from server.configRoutes import router as userConfigRoutes
from server.deviceRoutes import aRouter as deviceDataRoutes

app = FastAPI()
app.include_router(userConfigRoutes, tags=["ClientConfig"], prefix="/config")
app.include_router(deviceDataRoutes, tags=["DeviceData"], prefix="/device")

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Default Page: In-Truck Monitoring System"}


