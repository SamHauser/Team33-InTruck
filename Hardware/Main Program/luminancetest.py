#!/usr/bin/env python
import time

from bh1745 import BH1745

bh1745 = BH1745()


bh1745.setup()
bh1745.set_leds(0)# 1 on 0 off
bh1745.set_measurement_time_ms(2560)#more time exposed the more saturated the colour

#TODO: find a way to dectect door opening, during the day at least, possible blue value change?
#TODO: if we cant use the RGB values to detect door opening at night, then how? humidity? 
#TODO: test light on or off, blue value generally greater with light on, easier to detect changes with light off.
#TODO: how often will we check? 

time.sleep(2.6)  # Skip the reading that happened before the LEDs were enabled

def rgb_check(data): # check if any of r,g,b is > 5, if so return true. LED off in dark car returns 0,0,0
    for x in data:
        if x > 5:
            return True #door should be open
        
    return False

try:
    while True:
        r, g, b= bh1745.get_rgb_scaled()#uses a cleaar value to scale the rgb values
        print('RGB: {:10.1f} {:10.1f} {:10.1f}'.format(r, g, b))
        data = [r,g,b]
        print(rgb_check(data)) 
        time.sleep(2.6)

except KeyboardInterrupt:
    bh1745.set_leds(0)

