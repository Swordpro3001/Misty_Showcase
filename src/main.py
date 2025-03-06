from Misty import Misty

ip = ""
with open("../ipaddress", "r") as f:
    ip = f.read().strip()
print(f"IP-Address: {ip}")

m = Misty(ip)
m.wait(10)

for i in range(3):
    m.driveGrid()
m.turnLeft()
m.driveGrid()
m.turnLeft()

for i in range(3):
    m.driveGrid()
m.turnLeft()
m.turnLeft()
m.turnLeft()
m.driveGrid()
m.turnLeft()
m.turnLeft()
m.turnLeft()

for i in range(3):
    m.driveGrid()
m.turnLeft()
m.driveGrid()
m.turnLeft()
