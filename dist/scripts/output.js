// Field state will be loaded from XML
let field = [];
let misty;
let mistyDirection = 0; // 0: East, 1: South, 2: West, 3: North
let isInitialized = false;
let mistyPosition = { row: 0, column: 0 }; // To store Misty's initial position

document.addEventListener("DOMContentLoaded", function(){
    // Initialize the field when the page loads
    if (!isInitialized) {
        loadFieldFromXML();
    }
});

function loadFieldFromXML() {
    // Get the XML file
    const xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', 'test.xml', true);
    xmlRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const xmlDoc = this.responseXML;
            
            // Parse field data from XML
            parseFieldXML(xmlDoc);
            
            // Create the field UI
            initializeField();
        }
    };
    xmlRequest.send();
}

function parseFieldXML(xmlDoc) {
    // Reset field
    field = [];
    
    // Get all rows from XML
    const rows = xmlDoc.querySelectorAll('field > row');
    
    // Process each row
    rows.forEach((row, rowIndex) => {
        const rowArray = [];
        const columns = row.querySelectorAll('column');
        
        // Process each column in the row
        columns.forEach((column, colIndex) => {
            let cellContent = ' ';
            
            // Check for wall
            if (column.getAttribute('wall') === 'true') {
                cellContent = 'w';
            }
            // Check for corn/grain
            else if (column.getAttribute('corn') === 'true') {
                cellContent = 'k';
            }
            
            // Check if this is Misty's position
            const mistyElement = column.querySelector('misty');
            if (mistyElement) {
                mistyPosition.row = rowIndex;
                mistyPosition.column = colIndex;
                mistyDirection = getDirectionFromRotation(mistyElement.getAttribute('rotation') || 'east');
            }
            
            rowArray.push(cellContent);
        });
        
        field.push(rowArray);
    });
    
    console.log("Loaded field from XML:", field);
    console.log("Misty position:", mistyPosition);
}

function getDirectionFromRotation(rotation) {
    // Convert string direction to numeric direction
    switch(rotation.toLowerCase()) {
        case 'east': return 0;
        case 'south': return 1;
        case 'west': return 2;
        case 'north': return 3;
        default: return 0; // Default to East
    }
}

function saveFieldToXML() {
    // This would update the XML file with the current state
    // Note: This would require server-side support to actually save the file
    console.log("Field state would be saved to XML");
    
    // For now, we'll just log what would be saved
    const xmlOutput = createFieldXML();
    console.log("XML representation:", xmlOutput);
}

function createFieldXML() {
    // Create XML representation of current field state
    let xmlContent = '<xml version="1.0" id="fieldsim">\n    <field>\n';
    
    for (let i = 0; i < field.length; i++) {
        xmlContent += `        <row name="${i+1}">\n`;
        
        for (let j = 0; j < field[i].length; j++) {
            const hasCorn = field[i][j] === 'k';
            const hasWall = field[i][j] === 'w';
            
            xmlContent += `            <column nr="${j+1}" corn="${hasCorn}" wall="${hasWall}">`;
            
            // Add Misty if this is her position
            if (i === mistyPosition.row && j === mistyPosition.column) {
                const directionNames = ['east', 'south', 'west', 'north'];
                xmlContent += `\n                <misty rotation="${directionNames[mistyDirection]}">\n            `;
            }
            
            xmlContent += '</column>\n';
        }
        
        xmlContent += '        </row>\n';
    }
    
    xmlContent += '    </field>\n</xml>';
    return xmlContent;
}

function initializeField() {
    // Clear previous field if it exists
    const feldContainer = document.getElementById("feld");
    if (feldContainer) {
        feldContainer.innerHTML = '';
        createField(field);
        placeMisty();
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
        
        // Update our field data structure
        const row = parseInt(id[0]);
        const col = parseInt(id[1]);
        if (field[row] && field[row][col] === 'k') {
            field[row][col] = ' ';
        }
        
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
    
    // Place at starting position from XML
    const startPosition = document.getElementById(`${mistyPosition.row}${mistyPosition.column}`);
    if (startPosition) {
        startPosition.appendChild(misty);
    } else {
        // Fallback to position 0,0 if the specified position doesn't exist
        const fallbackPosition = document.getElementById("00");
        if (fallbackPosition) {
            mistyPosition = { row: 0, column: 0 };
            fallbackPosition.appendChild(misty);
        }
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
    
    // Update misty position in data model
    mistyPosition.direction = mistyDirection;
    
    return true;
}

function move(from, to) {
    console.log(`Moving from ${from} to ${to}`);
    const fromElement = document.getElementById(from);
    const toElement = document.getElementById(to);
    
    if (fromElement && toElement && fromElement.contains(misty)) {
        fromElement.removeChild(misty);
        toElement.appendChild(misty);
        
        // Update our Misty position in data model
        const row = parseInt(to[0]);
        const col = parseInt(to[1]);
        mistyPosition.row = row;
        mistyPosition.column = col;
        
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
        loadFieldFromXML();
        return true;
    },
    saveState: function() {
        saveFieldToXML();
        return true;
    }
};