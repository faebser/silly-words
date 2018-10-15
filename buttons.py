from evdev import uinput, ecodes as e
import RPi.GPIO as GPIO

BUTTON_A = 26

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_A, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(4, GPIO.RISING)

def callback(pin):
	print("pressed pin {}".format(pin))
	with uinput.UInput() as ui:
	    #ui.write(e.EV_KEY, e.KEY_LEFTSHIFT, 1)
	    ui.write(e.EV_KEY, e.KEY_L, 1)
	    ui.write(e.EV_KEY, e.KEY_L, 0)
	    ui.syn()
