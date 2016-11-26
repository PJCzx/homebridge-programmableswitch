import sys

on = 'on'
true = 'true'
off = 'off'
false = 'false'

def action(code):
    if code is off or false or code == 0:
        print "Action 0"

    elif code is on or true or code == 1:
        print "Action 1"

    elif code == 2:
        print "Action 2"

    else:
        print "Action", code, "not handled yet" 

if __name__ == '__main__':
    for argument in sys.argv[1:]:
        exec('action(' + str(argument) + ')')
