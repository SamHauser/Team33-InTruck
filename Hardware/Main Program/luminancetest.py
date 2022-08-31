#!/usr/bin/env python
import time
from bh1745 import BH1745

bh1745 = BH1745()

bh1745.setup()
bh1745.set_leds(0)# 1 on 0 off
bh1745.set_measurement_time_ms(5000)#more time exposed the more saturated the colour

#TODO: find a way to dectect door opening, during the day at least, possible blue value change?
#TODO: if we cant use the RGB values to detect door opening at night, then how? humidity? 
#TODO: test light on or off, blue value generally greater with light on, easier to detect changes with light off.
#TODO: how often will we check? 

time.sleep(5.0)  # Skip the reading that happened before the LEDs were enabled

try:
    while True:
        r, g, b= bh1745.get_rgb_scaled()#uses a cleaar value to scale the rgb values
        print('RGB: {:10.1f} {:10.1f} {:10.1f}'.format(r, g, b))
        time.sleep(5)

except KeyboardInterrupt:
    bh1745.set_leds(0)