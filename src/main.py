from Misty import Misty

ip = input("IP Adresse: ").strip()

m = Misty(ip)
m.wait(10)

for i in range(0, 2):
    m.driveGrid()
    m.turnLeft()
    m.turnLeft()
