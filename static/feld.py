import requests
from copy import deepcopy

class Feld:
    def __init__(self, misty):
        self.misty = misty
        self.curI = 0 
        self.curJ = 0
        self.rotation = 0  # 0: East, 1: South, 2: West, 3: North
        self.rottable = [0, 1, 2, 3]
        # Initialize field with walls (w) and grains (k)
        self.field = [
            [' ', ' ', ' ', 'k', 'w'], 
            ['w', 'w', ' ', 'w', 'w'], 
            ['k', 'w', ' ', ' ', 'k'], 
            [' ', ' ', ' ', 'w', 'w'], 
            [' ', ' ', ' ', 'k', 'w']
        ]
        print(f"Initialized Feld with Misty at position ({self.curI}, {self.curJ}), direction: {self.rotation}")
    
    def get_position(self):
        """Return current position as string 'row,col'"""
        return f"{self.curI}{self.curJ}"
    
    def get_next_position(self):
        """Calculate and return the next position based on current position and direction"""
        newI, newJ = self.curI, self.curJ
        
        if self.rottable[self.rotation] == 0:  # East
            newJ += 1
        elif self.rottable[self.rotation] == 1:  # South
            newI += 1
        elif self.rottable[self.rotation] == 2:  # West
            newJ -= 1
        elif self.rottable[self.rotation] == 3:  # North
            newI -= 1
            
        return f"{newI}{newJ}"
    
    def print_position(self):
        """Print current position and direction for debugging"""
        directions = ["East", "South", "West", "North"]
        print(f"Current position: ({self.curI}, {self.curJ}), Direction: {directions[self.rotation]}")
    
    def print_grid(self):
        """Print current grid state with Misty's position"""
        grid = deepcopy(self.field)
        grid[self.curI][self.curJ] = 'M'
        for row in grid:
            print(row)
        print()
    
    def rotate(self):
        """Rotate Misty counter-clockwise (left turn)"""
        prev_pos = self.get_position()
        self.rotation = (self.rotation + 3) % 4  # Left turn is -1 or +3 in modulo 4
        
        print(f"Rotating left, new direction: {self.rotation}")
        
        # If connected to real Misty, send turn command
        if self.misty and hasattr(self.misty, 'turnLeft'):
            try:
                self.misty.turnLeft()
                print("Command sent to Misty: turnLeft")
            except Exception as e:
                print(f"Failed to send command to Misty: {e}")
        
        self.print_position()
        return True
    
    def forward(self):
        """Move Misty forward one cell in the current direction"""
        prev_pos = self.get_position()
        newI, newJ = self.curI, self.curJ
        
        # Calculate new position based on direction
        if self.rottable[self.rotation] == 0:  # East
            newJ += 1
        elif self.rottable[self.rotation] == 1:  # South
            newI += 1
        elif self.rottable[self.rotation] == 2:  # West
            newJ -= 1
        elif self.rottable[self.rotation] == 3:  # North
            newI -= 1
        
        # Check if the new position is valid
        if 0 <= newI < len(self.field) and 0 <= newJ < len(self.field[0]) and self.field[newI][newJ] != 'w':
            self.curI, self.curJ = newI, newJ
            
            # If connected to real Misty, send drive command
            if self.misty and hasattr(self.misty, 'driveGrid'):
                try:
                    self.misty.driveGrid()
                    print("Command sent to Misty: driveGrid")
                except Exception as e:
                    print(f"Failed to send command to Misty: {e}")
                    
            print(f"Moved from {prev_pos} to {self.get_position()}")
            self.print_grid()
            return True
        else:
            print("Cannot move forward - either at edge of field or wall in the way")
            self.print_grid()
            return False
    
    def getKorn(self):
        """Pick up grain at current position if available"""
        if self.field[self.curI][self.curJ] == 'k':
            print(f"Grain picked up at position ({self.curI}, {self.curJ})")
            self.field[self.curI][self.curJ] = ' '
            
            # If connected to real Misty, send play sound command
            if self.misty and hasattr(self.misty, 'playSound'):
                try:
                    self.misty.playSound("s_Joy")
                    print("Command sent to Misty: playSound")
                except Exception as e:
                    print(f"Failed to send command to Misty: {e}")
                    
            return True
        else:
            print(f"No grain at position ({self.curI}, {self.curJ})")
            return False
    
    def misty_drive(self, steps):
        """Move forward multiple steps"""
        success = True
        steps_taken = 0
        
        for _ in range(int(steps)):
            if self.forward():
                steps_taken += 1
            else:
                success = False
                break
        
        print(f"Moved {steps_taken} steps out of {steps} requested")
        return success

if __name__ == "__main__":
    # Test with no actual Misty robot
    field = Feld(None)
    field.print_grid()
    field.forward()
    field.forward()
    field.print_grid()
    field.rotate()
    field.forward()
    field.getKorn()