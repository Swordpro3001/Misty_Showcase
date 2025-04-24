let field = [
    [' ', ' ', ' ', 'k', 'w'], 
    ['w', 'w', ' ', 'w', 'w'], 
    ['k', 'w', ' ', ' ', 'k'], 
    [' ', ' ', ' ', 'w', 'w'], 
    [' ', ' ', ' ', 'k', 'w']
]

let misty;

document.addEventListener("DOMContentLoaded", function(){
    createField(field);
    placeMisty();
    test();
});

function createField(field){
    console.log(field.length)
    const feld = document.createElement("div");
    feld.className = "field";
    let newDiv;
    for(let i = 0; i < field.length; i++){
        newDiv = document.createElement("div");
        newDiv.className = "row";
        for(let j = 0; j < field[i].length; j++){
            const newElement = document.createElement("div");
            newElement.className = "element"
            let id = i+""+j;
            console.log(id);
            newElement.id = id;
            if(field[i][j] == 'w'){
                newElement.style.backgroundColor = "#DD614A";
            } else if (field[i][j] == 'k'){
                console.log("hier");
                const grain = document.createElement("div");
                grain.className = "grain"
                newElement.append(grain);
            } else {
                newElement.style.backgroundColor = "#9E8576";
            }
            newDiv.append(newElement);
        }
        feld.append(newDiv);
    }
    
    console.log(document);
    document.getElementById("feld").append(feld);
}

function pickUp(id){
    document.getElementById(id).removeChild(document.getElementById(id).firstElementChild);
}

function placeMisty(){
    misty = document.createElement("img");
    misty.className = "misty";
    misty.src = "misty.avif";
    document.getElementById("00").append(misty);
}

function moveMisty(from, to){
      move(from, to);
}

function move(from, to){
    document.getElementById(from).removeChild(misty);
    document.getElementById(to).append(misty);
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
 