import requests as rq
from time import sleep

class Misty:
    def __init__(self, ip):
        self.ip = ip
        self.api_url = f"http://{self.ip}/api/"

    def mistyResponse(self, command, parameters):
        response = rq.post(f"{self.api_url}{command}", params=parameters)
        print(f"{self.api_url}{command}\n{response}\n{response.text}")
        print(parameters)

    # Stop all motor control
    def halt(self):
        self.mistyResponse("halt")

    # Stop Moving
    def stop(self):
        self.mistyResponse("drive/stop")

    def wait(self, tsec):
        sleep(tsec)

    """ 
    Expression
    """
    # Takes a hex value and sets the LED color to that Value
    def setLEDHex(self, hex):
        hexint = int(hex, 16)
        self.setLEDRGB(hexint & 0xFF, (hexint >> 8) & 0xFF, (hexint >> 16) & 0xFF)

    # Takes r, g and b as parameters and sets the LED accordingly
    def setLEDRGB(self, r, g, b):
        parameters = {
            "red": r,
            "green": g,
            "blue": b
        }
        self.mistyResponse("led", parameters)

    def say(self, text):
        parameters = {
            "Text": text
        }
        self.mistyResponse("tts/speak", parameters)

    """
    Movement Functions
    """
    # Drive in a Straight line
    def drive(self, linvel, angvel):
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
        }
        self.mistyResponse("drive", parameters)

    # Drive with all parameters
    def driveTimed(self, linvel, angvel, timems):
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
            "TimeMS": timems,
        }
        self.mistyResponse("drive/time", parameters)

    def driveDistance(self, heading, distance, timems, reverse):
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
        for i in range(4):
            self.driveTimed(50, 0, 647)
            sleep(2)
        sleep(3)

    def driveGridRev(self):
        self.driveTimed(-50, 0, 1330)
        sleep(3)

    # Turn
    def turnLeft(self):
        self.driveTimed(0, 100, 4435)
        sleep(5)
