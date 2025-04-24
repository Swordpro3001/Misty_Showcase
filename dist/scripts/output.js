let field = [
    [' ', ' ', ' ', 'k', 'w'], 
    ['w', 'w', ' ', 'w', 'w'], 
    ['k', 'w', ' ', ' ', 'k'], 
    [' ', ' ', ' ', 'w', 'w'], 
    [' ', ' ', ' ', 'k', 'w']
]

let misty;
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
        // Only run the test animation if in development mode
        // test();
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
                newElement.style.backgroundColor = "#DD614A";
            } else if (field[i][j] === 'k'){
                const grain = document.createElement("div");
                grain.className = "grain";
                newElement.appendChild(grain);
                newElement.style.backgroundColor = "#9E8576";
            } else {
                newElement.style.backgroundColor = "#9E8576";
            }
            
            newDiv.appendChild(newElement);
        }
        
        feld.appendChild(newDiv);
    }
    
    document.getElementById("feld").appendChild(feld);
}

function pickUp(id){
    const element = document.getElementById(id);
    if (element && element.firstElementChild && element.firstElementChild.className === "grain") {
        element.removeChild(element.firstElementChild);
        return true;
    }
    return false;
}

function placeMisty(){
    misty = document.createElement("img");
    misty.className = "misty";
    misty.src = "./pictures/Bild1.png";
    const startPosition = document.getElementById("00");
    if (startPosition) {
        startPosition.appendChild(misty);
    }
}

function moveMisty(from, to){
    const fromElement = document.getElementById(from);
    const toElement = document.getElementById(to);
    
    if (fromElement && toElement && fromElement.contains(misty)) {
        move(from, to);
        return true;
    }
    return false;
}

function move(from, to){
    const fromElement = document.getElementById(from);
    const toElement = document.getElementById(to);
    
    if (fromElement && toElement && fromElement.contains(misty)) {
        fromElement.removeChild(misty);
        toElement.appendChild(misty);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(){
    await sleep(1000);
    moveMisty("00", "01");
    await sleep(1000);
    moveMisty("01", "02");
    await sleep(1000);
    moveMisty("02", "03");
    await sleep(1000);
    pickUp("03");
    await sleep(1000);
    moveMisty("03", "02");
    await sleep(1000);
    moveMisty("02", "12");
    await sleep(1000);
    moveMisty("12", "22");
}

// Add functions that can be called from Python via Pyodide
window.fieldFunctions = {
    move: moveMisty,
    pickUp: pickUp,
    reset: initializeField
};