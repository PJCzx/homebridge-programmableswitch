import os
import sys
import time

def IRremoteSend(remote, key):
	try:
		os.kill(os.system("pidof lircd"), 0)
	except OSError:
		os.system("sudo lircd -d /dev/lirc0")

	cmd = "irsend SEND_ONCE %s %s" % (remote, key)
	os.system(cmd)

	if remote == "VP":
		if key == "KEY_POWER":
			time.sleep(1)
			os.system("irsend SEND_ONCE VP KEY_POWER")

if __name__ == '__main__':
    IRremoteSend(sys.argv[1], sys.argv[2])