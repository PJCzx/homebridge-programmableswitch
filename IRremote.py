import os
import sys
import time

def IRremoteSend(remote, key):
	try:
		os.kill(os.system("pidof lircd"), 0)
	except OSError:
		os.system("sudo lircd -d /dev/lirc0")

	cmd = "irsend SEND_ONCE %s %s" % (remote, key)
	#os.system(cmd)
        for n in '123':
		os.system(cmd)
		time.sleep(1)

        if remote == "VP":
		if key == "KEY_POWER":
			for n in '123':
				os.system(cmd)
				time.sleep(1)

if __name__ == '__main__':
    IRremoteSend(sys.argv[1], sys.argv[2])
