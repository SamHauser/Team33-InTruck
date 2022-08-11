from device import Device
import time

def main():
    device = Device()
    device.init()
    
    print(device.name)
    print(device.battery.status.GetChargeLevel()["data"])
    for _ in range(5):
        print(device.getLocation())
        time.sleep(2)






if __name__ == "__main__":
    main()