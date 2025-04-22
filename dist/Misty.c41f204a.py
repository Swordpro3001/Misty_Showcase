import asyncio
from pyodide.http import pyfetch

class Misty:
    def __init__(self, ip):
        self.ip = ip
        self.api_url = f"http://{self.ip}/api/"

    async def mistyResponse(self, command, parameters=None):
        url = f"{self.api_url}{command}"
        response = await pyfetch(url, method="POST", body=str(parameters) if parameters else None)
        text = await response.text()
        print(f"{url}\n{response.status}\n{text}")
        print(parameters)

    async def halt(self):
        await self.mistyResponse("halt")

    async def stop(self):
        await self.mistyResponse("drive/stop")

    async def wait(self, tsec):
        await asyncio.sleep(tsec)

    async def setLEDHex(self, hex):
        hexint = int(hex, 16)
        await self.setLEDRGB(hexint & 0xFF, (hexint >> 8) & 0xFF, (hexint >> 16) & 0xFF)

    async def setLEDRGB(self, r, g, b):
        parameters = {
            "red": r,
            "green": g,
            "blue": b
        }
        await self.mistyResponse("led", parameters)

    async def say(self, text):
        parameters = {"Text": text}
        await self.mistyResponse("tts/speak", parameters)

    async def drive(self, linvel, angvel):
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
        }
        await self.mistyResponse("drive", parameters)

    async def driveTimed(self, linvel, angvel, timems):
        parameters = {
            "LinearVelocity": linvel,
            "AngularVelocity": angvel,
            "TimeMS": timems,
        }
        await self.mistyResponse("drive/time", parameters)

    async def driveDistance(self, heading, distance, timems, reverse):
        parameters = {
            "Heading": heading,
            "Distance": distance,
            "TimeMS": timems,
            "Reverse": reverse,
        }
        await self.mistyResponse("drive/hdt", parameters)

    async def driveGrid(self):
        for _ in range(4):
            await self.driveTimed(50, 0, 647)
            await asyncio.sleep(2)
        await asyncio.sleep(3)

    async def driveGridRev(self):
        await self.driveTimed(-50, 0, 1330)
        await asyncio.sleep(3)

    async def turnLeft(self):
        await self.driveTimed(0, 100, 4435)
        await asyncio.sleep(5)
