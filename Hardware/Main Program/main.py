from device import Device
import time

def main():
    device = Device()
    device.init()
    
    print(device.battery_info)
    print(device.network_info)
    print(device.temperature)
    print(device.humidity)
    print(device.air_pressure)
    for _ in range(2):
        print(device.location)
        time.sleep(2)

if __name__ == "__main__":
    main()