import feld
import Misty

ip = ""
with open("../ipaddress", "r") as f:
    ip = f.read().strip()
print(f"IP-Address: {ip}")

m = Misty(ip)
m.wait(10)


