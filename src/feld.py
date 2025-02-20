koerner = [['', '', '', 'k', 'w'], 
            ['w', 'w', '', 'w', 'w'], 
            ['k', 'w', '', '', 'k'], 
            ['', '', '', 'w', 'w'], 
            ['', '', '', 'k', 'w']]

curI = 0 
curJ = 0  
rotation = 0 

def print_position():
    print(f"Aktuelle Position: ({curI}, {curJ}), Richtung: {rotation}°")

def rotate(direction):
    global rotation
    if direction == 'left':
        rotation = (rotation - 90) % 360
    elif direction == 'right':
        rotation = (rotation + 90) % 360
    print_position()

def forward():
    global curI, curJ
    newI, newJ = curI, curJ
    
    if rotation == 0:  
        newJ += 1
    elif rotation == 90: 
        newI += 1
    elif rotation == 180:  
        newJ -= 1
    elif rotation == 270:
        newI -= 1
    
    if 0 <= newI < len(koerner) and 0 <= newJ < len(koerner[0]) and koerner[newI][newJ] != 'w':
        curI, curJ = newI, newJ
    print_position()

def getKorn():
    if koerner[curI][curJ] == 'k':
        print("Korn aufgesammelt!")
        koerner[curI][curJ] = ''
    else:
        print("Kein Korn hier.")
    print_position()

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