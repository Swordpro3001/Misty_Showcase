// Initial field state
let field =  [
    [' ', ' ', ' ', 'w'], 
    ['w', 'w', ' ', 'w'], 
    ['k', 'w', ' ', 'k'], 
    [' ', ' ', 'k', 'w']
]

let misty;
let mistyDirection = 0; // 0: East, 1: South, 2: West, 3: North
let isInitialized = false;

document.addEventListener("DOMContentLoaded", function(){
    // Initialize the field when the page loads
    if (!isInitialized) {
        initializeField();
    }
});

function initializeField() {
    // Clear previous field if it exists
    const feldContainer = document.getElementById("feld");
    if (feldContainer) {
        feldContainer.innerHTML = '';
        createField(field);
        placeMisty();
        mistyDirection = 0; // Reset direction to East
        isInitialized = true;
        console.log("Field initialized successfully");
    } else {
        console.error("Field container not found!");
    }
}

function createField(field){
    const feld = document.createElement("div");
    feld.className = "field";
    
    for(let i = 0; i < field.length; i++){
        const newDiv = document.createElement("div");
        newDiv.className = "row";
        
        for(let j = 0; j < field[i].length; j++){
            let newElement = document.createElement("div");
            newElement.className = "element";
            let id = i+""+j;
            newElement.id = id;
            
            if(field[i][j] === 'w'){
                const wall = document.createElement("img");
                wall.className = "wall";
                wall.src = "./pictures/bricks.jpg";
                wall.alt = "Wall";
                newElement.appendChild(wall); // Füge das Bild in das bestehende element-Div ein
                newElement.style.backgroundColor = "#9E8576"; // optional Bodenfarbe
            } else if (field[i][j] === 'k'){
                const grain = document.createElement("img");
                grain.className = "grain";
                grain.src = "./pictures/Akku.png"
                newElement.appendChild(grain);
                newElement.style.backgroundColor = "#cfc19d"; // Floor color
            } else {
                newElement.style.backgroundColor = "#cfc19d"; // Floor color
            }
            
            newDiv.appendChild(newElement);
        }
        
        feld.appendChild(newDiv);
    }
    
    document.getElementById("feld").appendChild(feld);
    console.log("Field created with dimensions:", field.length, "x", field[0].length);
}

function pickUp(id) {
    console.log(`Trying to pick up at ${id}`);
    const element = document.getElementById(id);
    if (element && element.querySelector('.grain')) {
        const grain = element.querySelector('.grain');
        element.removeChild(grain);
        console.log(`Picked up grain at ${id}`);
        return true;
    }
    console.log(`No grain found at ${id}`);
    return false;
}

function placeMisty() {
    // Create Misty image element if it doesn't exist
    if (!misty) {
        misty = document.createElement("img");
        misty.className = "misty";
        misty.src = "./pictures/Bild1.png";
        misty.style.transition = "transform 0.5s";
        misty.alt = "Misty robot"; // Add alt text for accessibility
    }
    
    // Update Misty's direction
    updateMistyDirection();
    
    // Place at starting position
    const startPosition = document.getElementById("00");
    if (startPosition) {
        startPosition.appendChild(misty);
        console.log("Misty placed at position 00");
    } else {
        console.error("Starting position element not found!");
    }
}

function updateMistyDirection() {
    if (!misty) return;
    
    // Rotate Misty's image based on direction
    switch(mistyDirection) {
        case 0: // East (default)
            misty.style.transform = "rotate(0deg)";
            break;
        case 1: // South
            misty.style.transform = "rotate(90deg)";
            break;
        case 2: // West
            misty.style.transform = "rotate(180deg)";
            break;
        case 3: // North
            misty.style.transform = "rotate(270deg)";
            break;
    }
    console.log("Misty direction updated to:", mistyDirection);
}

function rotateMisty() {
    mistyDirection = (mistyDirection + 3) % 4; // Rotate counterclockwise
    updateMistyDirection();
    console.log(`Rotated misty to direction: ${mistyDirection}`);
    return true;
}

function move(from, to) {
    console.log(`Moving from ${from} to ${to}`);
    const fromElement = document.getElementById(from);
    const toElement = document.getElementById(to);
    
    if (!fromElement) {
        console.error(`Source element ${from} not found`);
        return false;
    }
    
    if (!toElement) {
        console.error(`Target element ${to} not found`);
        return false;
    }
    
    if (!fromElement.contains(misty)) {
        console.error(`Misty not found in element ${from}`);
        return false;
    }
    
    // Check if target is a wall
    if (toElement.style.backgroundColor === "rgb(221, 97, 74)") { // Wall color in RGB
        console.error(`Can't move to ${to} - it's a wall`);
        return false;
    }
    
    // Perform the move
    try {
        fromElement.removeChild(misty);
        toElement.appendChild(misty);
        console.log(`Successfully moved Misty from ${from} to ${to}`);
        return true;
    } catch (error) {
        console.error("Error during move:", error);
        return false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add functions that can be called from Python via Pyodide
window.fieldFunctions = {
    move: function(from, to) {
        console.log(`Python called move from ${from} to ${to}`);
        return move(from, to);
    },
    pickUp: function(pos) {
        console.log(`Python called pickUp at ${pos}`);
        return pickUp(pos);
    },
    rotate: function() {
        console.log(`Python called rotate`);
        return rotateMisty();
    },
    reset: function() {
        console.log(`Python called reset`);
        initializeField();
        return true;
    }
};