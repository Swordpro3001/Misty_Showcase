import requests as rq
import random
from time import sleep

class Misty:
    def __init__(self, ip):
        self.ip = ip
        self.api_url = f"http://{self.ip}/api/"
        self.setLEDHex("000000")

    def mistyResponse(self, command, parameters):
        response = rq.post(f"{self.api_url}{command}", params=parameters)
        print(f"{self.api_url}{command}\n{response}\n{response.text}")
        print(parameters)

    # Stop all motor control
    def halt(self):
        self.setFaceVisibility(True)
        self.mistyResponse("halt","test")

    # Stop Moving
    def stop(self):
        self.setFaceVisibility(True)
        self.mistyResponse("drive/stop","test")

    def wait(self, tsec):
        self.setFaceVisibility(True)
        sleep(tsec)
        
    
        

    """ 
    Expression
    """
    # Takes a hex value and sets the LED color to that Value
    def setLEDHex(self, hex):
        self.setFaceVisibility(True)
        hexint = int(hex, 16)
        self.setLEDRGB(hexint & 0xFF, (hexint >> 8) & 0xFF, (hexint >> 16) & 0xFF)

    # Takes r, g and b as parameters and sets the LED accordingly
    def setLEDRGB(self, r, g, b):
        self.setFaceVisibility(True)
        parameters = {
            "red": r,
            "green": g,
            "blue": b
        }
        self.mistyResponse("led", parameters)

    def say(self, text):
        self.setFaceVisibility(True)
        parameters = {
            "Text": text
        }
        self.mistyResponse("tts/speak", parameters)
        
    def setVolume(self, volume):
        self.setFaceVisibility(True)
        parameters = {
            "Volume": volume
        }
        self.mistyResponse("audio/volume", parameters)


    def setFaceVisibility(self, visible):
        parameters = {
            "Visible": visible
        }
        self.mistyResponse("images/settings", parameters)
        
        
    def setDisplayText(self, text):
        parameters = {"Text": text}
        self.setFaceVisibility(False)
        self.mistyResponse("text/display", parameters)
        
    def setDisplayTextSetting(self, text, size, weight, r, g, b):
        self.setFaceVisibility(True)
        parameters = {
            "Size": size,
            "Weight": weight,
            "HorizontalAlignment": "Center",
            "VerticalAlignment": "Center",
            "Style": "Normal",
            "Red": r,
            "Green": g,
            "Blue": b,
            "Rotation": 0
        }
        self.setFaceVisibility(False)
        self.mistyResponse("text/settings", parameters)
    """
    Movement Functions
    """
    # Drive in a Straight line
    def drive(self, linvel, angvel):
        self.setFaceVisibility(True)
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
        }
        self.mistyResponse("drive", parameters)

    # Drive with all parameters
    def driveTimed(self, linvel, angvel, timems):
        self.setFaceVisibility(True)
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
            "TimeMS": timems,
        }
        self.mistyResponse("drive/time", parameters)

    def driveDistance(self, heading, distance, timems, reverse):
        self.setFaceVisibility(True)
        parameters = {
            "Heading": heading,
            "Distance": distance,
            "TimeMS": timems,
            "Reverse": reverse,
        }
        self.mistyResponse("drive/hdt", parameters)

    # def driveGrid(self):
    #     self.driveTimed(50, 0, 1330)
    #     sleep(3)

    def driveGrid(self):
        self.setFaceVisibility(True)
        for i in range(4):
            self.driveTimed(50, 0, 647)
            sleep(2)
        sleep(3)
        
    def driveGridRev(self):
        self.setFaceVisibility(True)
        self.driveTimed(-50, 0, 1330)
        sleep(3)

    # Turn
    def turnLeft(self):
        self.setFaceVisibility(True)
        self.driveTimed(0, 100, 4435)
        sleep(5)

    def changeFace(self, face):
        self.setFaceVisibility(True)
        parameters = {
            "FileName": f"e_{face}.jpg",
            "Alpha": 1
        }
        self.mistyResponse("images/display", parameters)

    def resetFace(self):
        self.setFaceVisibility(True)
        self.changeFace("DefaultContent")

    def playSound(self, filename):
        self.setFaceVisibility(True)
        parameters = {
            "FileName": f"{filename}.wav"
        }
        self.mistyResponse("audio/play", parameters)

    def dance(self):
        self.setFaceVisibility(True)
        pos = 90
        parameters = {
            "LeftArmPosition": 90,
            "RightArmPosition": 90,
            "LeftArmVelocity": 50,
            "RightArmVelocity": 50
        }
        clrs = ["f70606", "f7cd06", "45f706", "06f7e6", "0a06f7", "c406f7", "f70670"]
        faces = ["Joy", "Joy2", "JoyGoofy", "JoyGoofy2", "JoyGoofy3"]
        self.playSound("s_Joy3")
        for _ in range(5):
            parameters["LeftArmPosition"] = pos
            parameters["RightArmPosition"] = -pos
            pos *= -1
            self.setLEDHex(random.choice(clrs))
            self.changeFace(random.choice(faces))
            self.mistyResponse("arms/set", parameters)
            sleep(1)
        sleep(2)
        parameters["LeftArmPosition"] = 90
        parameters["RightArmPosition"] = 90
        self.resetFace()
        self.mistyResponse("arms/set", parameters)
        self.setLEDHex("000000")
        sleep(3)

