#!/usr/bin/python
# -*- coding: utf-8 -*-
 
import RPi.GPIO as GPIO
import time
import sys

class Blyss :
 
        # Table des identifiants programmés dans les prises
        tableauBoutons = {
            "1": "0000000000000000",
            "2": "0000000000000001",
            "3": "0000000000000010",
            "4": "0000000000000011",
        }
        # Table des codes roulants trouvés par les hackers d'arduino.cc
        # http://skyduino.wordpress.com/2012/07/17/hack-partie-1-reverse-engineering-des-interrupteurs-domotique-blyss/
        # http://skyduino.wordpress.com/2012/07/19/hack-partie-2-reverse-engineering-des-interrupteurs-domotique-blyss/
        tableRollingCode = [ 0x67, 0x98, 0xDA, 0x1E, 0xE6]
        echantillonnage = 44100
        paramBits = {
            0 : [ [ 25, 0 ], [ 12, 1 ] ],
            1 : [ [ 12, 0 ], [ 25, 1 ] ]
        }
        #dataPin    = 23
        nb_retry   = 7
        # Nombre de secondes d'attente entre deux retry
        attenteEntrePaquets = 0.024
 
        path2FileIdxLastRollingCode = "./lastRCBlyss.idx"
        idRollingCode = 0
 
        def __init__(self, dataPin ):
                self.dataPin = dataPin
 
                # A stocker dans un fichier
                try :
                        idRollingCodeFile = open( self.path2FileIdxLastRollingCode , 'r')
                        self.idRollingCode     = int ( idRollingCodeFile.readline() )
                        self.idRollingCode    += 1
                        if self.idRollingCode >= len( self.tableRollingCode ):
                                self.idRollingCode = 0
                        idRollingCodeFile.close()
                except :
                        self.idRollingCode = 0
 
                GPIO.setwarnings(False)
                GPIO.setmode(GPIO.BCM)
                GPIO.setup(self.dataPin, GPIO.OUT)
 
        def sendDataPulse( self, dataPin, duration, value ):
                if value == 1 :
                        GPIO.output(dataPin, GPIO.HIGH)
                else:
                        GPIO.output(dataPin, GPIO.LOW)
                time.sleep( duration )
 
        def genereTrame( self, identifiantTelecommande, canal, sousCanal, etatLumiere) :
            trame = ""
            # empreinte 0xFE (8 bits),
            trame += "11111110"
            # canal global (4 bits),
            trame += canal
            # adresse (16 bits),
            trame += identifiantTelecommande
            # sous canal (4 bits),
            trame += sousCanal
            # état lumière (état logique) (4 bits),
            trame += etatLumiere
            # rolling code, MSBFIRST (8 bits),
            trame += "{0:08b}".format( self.tableRollingCode[ self.idRollingCode ] )
            # timestamp incrémentiel (0 ~ 255), MSBFIRST (8 bits),
            trame += "00000011"
            return trame
 
        def send( self, button, action ):
 
                if button in self.tableauBoutons:
                        identifiantTelecommande = self.tableauBoutons[ button ];
                else:
                        print "Boutton non défini"
                        exit( 1)
                # canal : a paramètrer ?
                canal = "0000"
                # sous canal : a paramètrer ?
                sousCanal = "1000"
 
                if action == "ON" or action == "true" or action == "100":
                        etatLumiere = "0000"
                elif action == "OFF" or action == "false" or action == "0" :
                        etatLumiere = "0001"
                else :
                        print "l'action doit être ON ou OFF"
                        exit( 1)
 
                trame = self.genereTrame( identifiantTelecommande, canal, sousCanal, etatLumiere )
                print "Sending {} on GPIO BCM {}".format(trame, self.dataPin)
 
                for i in range( 0, self.nb_retry ) :
                        # Envoi d'un HIGH pendant 2.4ms
                        self.sendDataPulse( self.dataPin, 0.0024 , 1 )
                        
                        for bit in trame:
                                for paramBit in self.paramBits[ int( bit ) ]:
                                        self.sendDataPulse ( self.dataPin, 1.0 * paramBit[0]/self.echantillonnage, paramBit[1])
                        # Envoi d'un LOW pendant 0.24ms
                        self.sendDataPulse( self.dataPin, 0.00024 , 0 )
 
                        time.sleep( self.attenteEntrePaquets )
 
        def __del__(self):
                GPIO.cleanup()
                path2FileIdxLastRollingCode = open( self.path2FileIdxLastRollingCode , 'w')
                path2FileIdxLastRollingCode.writelines( str( self.idRollingCode ) )
                path2FileIdxLastRollingCode.close()
 
if __name__ == "__main__" :
        button = "1"
        action = "ON"
 
        if len(sys.argv) > 1:
                button = sys.argv[1]
                action = sys.argv[2]
        else :
                print "arguments incorrects :"
                print sys.argv[0] + "<id> <ON|OFF>"
                sys.exit(1)
        rf = Blyss(23)
        rf.send( button, action )