// Initial field state
let field = [
    [' ', ' ', ' ', 'k', 'w'], 
    ['w', 'w', ' ', 'w', 'w'], 
    ['k', 'w', ' ', ' ', 'k'], 
    [' ', ' ', ' ', 'w', 'w'], 
    [' ', ' ', ' ', 'k', 'w']
];

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
    }
}

function createField(field){
    const feld = document.createElement("div");
    feld.className = "field";
    
    for(let i = 0; i < field.length; i++){
        const newDiv = document.createElement("div");
        newDiv.className = "row";
        
        for(let j = 0; j < field[i].length; j++){
            const newElement = document.createElement("div");
            newElement.className = "element";
            let id = i+""+j;
            newElement.id = id;
            
            if(field[i][j] === 'w'){
                newElement.style.backgroundColor = "#DD614A"; // Wall color
            } else if (field[i][j] === 'k'){
                const grain = document.createElement("div");
                grain.className = "grain";
                newElement.appendChild(grain);
                newElement.style.backgroundColor = "#9E8576"; // Floor color
            } else {
                newElement.style.backgroundColor = "#9E8576"; // Floor color
            }
            
            newDiv.appendChild(newElement);
        }
        
        feld.appendChild(newDiv);
    }
    
    document.getElementById("feld").appendChild(feld);
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
    }
    
    // Update Misty's direction
    updateMistyDirection();
    
    // Place at starting position
    const startPosition = document.getElementById("00");
    if (startPosition) {
        startPosition.appendChild(misty);
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
    
    if (fromElement && toElement && fromElement.contains(misty)) {
        fromElement.removeChild(misty);
        toElement.appendChild(misty);
        return true;
    }
    console.log("Move failed: Elements not found or misty not in fromElement");
    return false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add functions that can be called from Python via Pyodide
window.fieldFunctions = {
    move: function(from, to) {
        return move(from, to);
    },
    pickUp: function(pos) {
        return pickUp(pos);
    },
    rotate: function() {
        return rotateMisty();
    },
    reset: function() {
        initializeField();
        return true;
    }
};