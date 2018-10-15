
import RPi.GPIO as GPIO
import time

BUTTON_A = 26
BUTTON_B = 19


from pyautogui import press

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_A, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_B, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(BUTTON_A, GPIO.RISING, bouncetime=200)
GPIO.add_event_detect(BUTTON_B, GPIO.RISING, bouncetime=200)


def callback(pin):
	print("pressed pin {}".format(pin))
	if pin == BUTTON_A:
		press('N')
		return
	if pin == BUTTON_B:
		press('L')
		return


GPIO.add_event_callback(BUTTON_A, callback)
GPIO.add_event_callback(BUTTON_B, callback)


while True:
	time.sleep(0.02)