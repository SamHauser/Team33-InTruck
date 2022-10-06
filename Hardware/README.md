# The Device

## Specifications

### Components

The device is made up of the following modular components:
- [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) - This can generally be switched to another Pi model as long as it has the correct GPIO pins.
- [PiJuice HAT](https://github.com/PiSupply/PiJuice) - Optional, includes buttons controls, LED status lights and a battery (included is 1820 mAh, can be switched for more capacity). 
- [Sixfab Base HAT](https://sixfab.com/product/raspberry-pi-4g-lte-modem-kit/) - Allows communication and control of a mounted mini PCIe modem. Includes a SIM card slot.
- [Telit LE910C4-AP](https://sixfab.com/product/telit-le910c4-mini-pcie-cat4-lte-module/?attribute_modules=LE910C4-AP+%28APAC%29) - Connects via the Sixfab HAT and connects to 4G/3G as well as GPS and other satellites. Includes antennas.
- [Pimoroni Breakout Garden Mini](https://shop.pimoroni.com/products/breakout-garden-mini-i2c?variant=15383637622867) - Allows connection of Pimoroni-produced sensors without soldering or using a breadboard.
- [Pimoroni BME688](https://shop.pimoroni.com/products/bme688-breakout?variant=39336951709779) - Temperature, humidity and air pressure sensor
- [Pimoroni MSA301](https://shop.pimoroni.com/products/msa301-3dof-motion-sensor-breakout?variant=27908089774163) - Accelerometer
- [Pimoroni BH1745](https://shop.pimoroni.com/products/bh1745-luminance-and-colour-sensor-breakout?variant=12767599755347) - Luminance and colour sensor

### Assembly

Using the components listed above, assembly does not require any soldering or use of breadboards. To assemble, perform the following steps:
1. Starting with the Sixfab Base HAT, install the Telit modem
2. Attach the antennas to the Telit modem as per [Sixfab's instructions](https://docs.sixfab.com/docs/raspberry-pi-4g-lte-cellular-modem-kit-getting-started)
3. Starting with the Pi as a base, place the PiJuice HAT on top, if available
4. Place the Sixfab HAT above
5. Connect the short micro-USB cable between the Sixfab HAT and the Pi
6. Attach the Breakout Garden
7. Attach the sensors to the Breakout Garden, making sure to line up the pins in the correct orientation

## Software Setup and Configuration

For a detailed setup guide, head to the [setup folder](./Setup/).

## Using the Device

### Powering on

### Buttons

### Status indicators