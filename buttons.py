
import RPi.GPIO as GPIO
import time

BUTTON_A = 26

time.sleep(10)

from pyautogui import press

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_A, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(BUTTON_A, GPIO.RISING)

def callback(pin):
	print("pressed pin {}".format(pin))
	press('N')

GPIO.add_event_callback(BUTTON_A, callback)


while True:
	time.sleep(0.02)