import textwrap
import sys
from functools import partial
from datetime import datetime

LINEFEED = [chr(10)]
CR = [chr(13)]
MAX_SIZE = 48
ESC = chr(27)
GS = chr(29)
FULL_CUT = [ESC, "m"]
CENTER = [ESC, chr(97), chr(1)]
LEFT = [ESC, chr(97), chr(0)]
RIGHT = [ESC, chr(97), chr(2)]
FEED = [ESC + "J", chr(255)]
THICK_HR = "".join([chr(205) * MAX_SIZE])
THIN_HR = "".join([chr(196) * MAX_SIZE])
REGULAR = [GS, chr(77), chr(0)]
XS = [GS, chr(77), chr(1)]
XSS = [GS, chr(77), chr(2)]
DOUBLE = [GS, chr(33), chr(17)]
NORMAL = [GS, chr(33), chr(0)]
RESET = [ESC, chr(33), chr(0)]
ALL_RIGHT = [ESC, "D", chr(20), chr(15)]


def write_command(_printer, commands):
    for c in commands:
        _printer.write(c)
    return


def write_normal(_printer, command):
    _printer.write(command)
    return


with open("/dev/usb/lp0", "w") as printer:
    _w = partial(write_command, printer)
    w = partial(write_normal, printer)

    """for i in range(30, 255):

        printer.write(str(i))
        w(CENTER)
        printer.write(chr(32))

        printer.write(chr(i))
        printer.write(LINEFEED)
        printer.flush()
    printer.write(LINEFEED)

    # printer.write(ESC + str(74) + "150")
    # printer.write(LINEFEED)

    printer.flush()"""

    bla = sys.stdin.read()
    counter, text = bla.splitlines()

    now = datetime.now()

    _w(RESET)
    w(THICK_HR)
    _w(LINEFEED)
    _w(LEFT)
    _w(DOUBLE)
    w("EVERYTHING")
    _w(LINEFEED)
    w("DEVOLVES INTO")
    _w(LINEFEED)
    _w(CENTER)
    w("SILLY")
    _w(LINEFEED)
    _w(RIGHT)
    w("WORDS")
    _w(LINEFEED)
    _w(NORMAL)
    _w(LEFT)
    w(THIN_HR)
    _w(LINEFEED)
    w("Fabian Frei")  # 12
    w("".join([" "] * (48 - 14)))
    w(counter)  # 3 counter
    _w(LEFT)
    _w(LINEFEED)
    w("Linz, {}.{}.{}".format(now.day, now.month, now.year))
    _w(LINEFEED)
    _w(LINEFEED)
    _w(LINEFEED)
    _w(CENTER)
    w("you discovered")
    _w(LINEFEED)
    _w(LINEFEED)
    _w(DOUBLE)
    w(textwrap.fill(text, 20))
    _w(LINEFEED)
    _w(LINEFEED)
    _w(RESET)
    w("Thank you!")
    _w(LINEFEED)
    _w(THIN_HR)
    _w(LINEFEED)
    _w(LEFT)
    w(textwrap.fill("Go to tofu.wtf/buzzwords to see ALL the words", MAX_SIZE))
    _w(LINEFEED)
    _w(LINEFEED)
    _w(LINEFEED)
    _w(RESET)
    _w(CENTER)
    w("".join([chr(222), chr(220), chr(216), chr(220), chr(221)]))
    _w(LINEFEED)
    _w(LINEFEED)
    _w(FEED)
    _w(FULL_CUT)
    _w(RESET)
    printer.flush()
