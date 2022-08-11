from pijuice import PiJuice # Import the battery module

class Device:
    def __init__(self):
        # Example property here
        self.name = "Example"
        # Allows code to access the battery information
        self.battery = PiJuice(1, 0x14)
    
    # Used to warm up sensors/start gps etc
    def init(self):
        print("Initialising hardware and sensors")

    # Returns the provided information. Possibly could be
    # improved to use the format as with the battery above
    def getTemperature(self):
        pass

    def getHumidity(self):
        pass

    def getLocation(self):
        pass