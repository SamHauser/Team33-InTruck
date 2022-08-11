from device import Device

def main():
    device = Device()
    device.init()
    
    print(device.name)
    print(device.battery.status.GetChargeLevel()["data"])






if __name__ == "__main__":
    main()