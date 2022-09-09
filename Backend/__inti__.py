##############################
# Requriments:
#   pip install fastapi
#   pip install uvicorn
#   pip install pymongo
#   pip install motor
# Install via "pip install -r requirements.txt"
#


import uvicorn

if __name__ == "__main__":
    uvicorn.run("server.app:app", host="0.0.0.0", port=8000, reload=True)