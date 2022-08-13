from device import Device
import time

def main():
    device = Device()
    device.init()
    
    print(device.battery.status.GetChargeLevel()["data"])
    print(device.networkInfo)
    for _ in range(5):
        print(device.location)
        time.sleep(2)

if __name__ == "__main__":
    main()