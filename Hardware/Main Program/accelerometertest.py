import msa301
import time
from threading import Event
from threading import Thread

print("""freefall.py - detect a freefall event.
Gently throw your sensor upwards and catch it.
Press Ctrl+C to exit.
""")

accel = msa301.MSA301()
accel.reset()
accel.set_power_mode('normal')
accel.enable_interrupt(['freefall_interrupt'])

def wait_for_freefall(event):#used by thread to detect interrupt
        while True:
            accel.wait_for_interrupt('freefall_interrupt', polling_delay=0.05)
            event.set()
try:
    wait_event = Event()
    wait_thread = Thread(target=wait_for_freefall, args=(wait_event,))
    wait_thread.start()
    
    while True:
        if wait_event.is_set():
            print('i have fallen')
            wait_event.clear()
        else:
            print('i am okay')
        time.sleep(0.5)
        

except KeyboardInterrupt:
    pass