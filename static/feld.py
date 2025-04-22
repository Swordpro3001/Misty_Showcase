import Misty
from copy import deepcopy

class Feld:
    koerner = [
        [' ', ' ', ' ', 'k', 'w'], 
        ['w', 'w', ' ', 'w', 'w'], 
        ['k', 'w', ' ', ' ', 'k'], 
        [' ', ' ', ' ', 'w', 'w'], 
        [' ', ' ', ' ', 'k', 'w']
    ]
  
    def __init__(self, Misty):
        self.curI = 0 
        self.curJ = 0
        self.rotation = 0
        self.mist = Misty
        self.rottable = [0, 1, 2, 3]

    def print_position(self):
        print(f"Aktuelle Position: ({self.curI}, {self.curJ}), Richtung: {self.rottable[self.rotation]}")

    def print_grid(self):
        grid = deepcopy(self.koerner)
        grid[self.curI][self.curJ] = 'M'
        for i in grid:
            print(i)
        print()

    def rotate(self):
        """
        if direction == 'left':
            self.rotation -= 1
            self.rotation %= 4
        elif direction == 'right':
            self.rotation += 1
            self.rotation %= 4
        """
        self.rotation -= 1
        self.rotation %= 4
        if self.mist != None:
            self.mist.turnLeft()
        self.print_position()

    def forward(self):
        newI, newJ = self.curI, self.curJ
    
        if self.rottable[self.rotation] == 0:  
            newJ += 1
        elif self.rottable[self.rotation] == 1:     
            newI += 1
        elif self.rottable[self.rotation] == 2:  
            newJ -= 1
        elif self.rottable[self.rotation] == 3:
            newI -= 1
    
        if 0 <= newI < len(self.koerner) and 0 <= newJ < len(self.koerner[0]) and self.koerner[newI][newJ] != 'w':
            self.curI, self.curJ = newI, newJ
            if self.mist != None:
                self.mist.driveGrid()
        #self.print_position()
        self.print_grid()

    def getKorn(self):
        if self.koerner[self.curI][self.curJ] == 'k':
            print("Korn aufgesammelt!")
            self.koerner[self.curI][self.curJ] = ''
        else:
            print("Kein Korn hier.")
        self.print_position()

if __name__ == "__main__":
    fld = Feld(None)
    """
    test_moves = ['forward', 'forward', 'forward', 'getKorn', 'rotate_left', 'rotate_left', 'forward', 
              'rotate_left', 'forward', 'forward', 'rotate_left', 'forward', 'forward', 'getKorn',
              'rotate_left', 'rotate_left', 'forward', 'forward', 'rotate_left', 'forward', 'forward', 
              'rotate_left', 'forward', 'getKorn']

    for move in test_moves:
        if move == 'forward':
            forward()
        elif move == 'rotate_right':
            rotate('right')
        elif move == 'rotate_left':
            rotate('left')
        elif move == 'getKorn':
            getKorn()
    """
    fld.print_grid()
    fld.forward()
    fld.forward()
    fld.print_grid()
    fld.rotate()
    fld.rotate()
    fld.rotate()
    fld.forward()
