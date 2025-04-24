let pyodideReady = false;
let pyodide = null;
let currentCode = "";
const statusContainer = document.getElementById('statusContainer');
const outputContainer = document.getElementById('outputContainer');
// 1. Eigene Blöcke definieren
Blockly.defineBlocksWithJsonArray([
    {
        "type": "scope",
        "message0": "Scope mit IP %1",
        "args0": [
            {
                "type": "field_input",
                "name": "IP_ADDRESS",
                "text": "10.200.0.40"
            }
        ],
        "message1": "%1",
        "args1": [
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ],
        "colour": 230,
        "tooltip": "Erstellt einen neuen Scope mit einer IP-Adresse.",
        "helpUrl": ""
    },
    {
        "type": "custom_function",
        "message0": "rufe meine Funktion auf",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 200
    },
    {
        "type": "forward_fuer",
        "message0": "Fahre %1 Bl\xf6cke nach vorne",
        "args0": [
            {
                "type": "field_input",
                "name": "Blocks",
                "Check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    },
    {
        "type": "rotate",
        "message0": "drehe 90 Grad nach links",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    },
    {
        "type": "forward",
        "message0": "fahre einen Block nach vorne",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    },
    {
        "type": "getKorn",
        "message0": "nimm das Korn",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    }, 
    {
        "type": "setVolume", 
        "message0": "setzt die Lautstärke",
        "args0": [
            {
                "type": "field_input",
                "name": "Volume",
                "Check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    }, 
    {
        "type": "setDisplayText", 
        "message0": "setzt den Text auf dem Display",
        "args0": [
            {
                "type": "field_input",
                "name": "Text",
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    }, 
    {
        "type": "setDisplayTextSettings", 
        "message0": "Einstellungen für den Text auf dem Display",
        "args0": [
            {
                "type": "field_input",
                "name": "Text",
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    }, 
    {
        "type": "speak", 
        "message0": "Spricht",
        "args0": [
            {
                "type": "field_input",
                "name": "Text",
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 300
    }
]);
// 2. Python-Generator
var pythonGenerator = Blockly.Python;
// 3. Definiere die Codegenerierung für den benutzerdefinierten Block
pythonGenerator.forBlock['scope'] = function(block) {
    var ip = block.getFieldValue('IP_ADDRESS');
    var code = pythonGenerator.statementToCode(block, 'CODE');
    return 'from Misty import Misty\nfrom Feld import Feld\n\nif __name__ == "__main__": \n  misty = Misty( "'+ ip +'" )\n  feld = Feld(misty)\n' + code;
};
pythonGenerator.forBlock['custom_function'] = function(block) {
    return 'print("hallo World")\n';
};
pythonGenerator.forBlock['rotate'] = function(block) {
    return 'feld.rotate()\n';
};
pythonGenerator.forBlock['forward'] = function(block) {
    return 'feld.forward()\n';
};
pythonGenerator.forBlock['forward_fuer'] = function(block) {
    var value = block.getFieldValue('Blocks');
    return 'feld.misty_drive(' + value + ')\n';
};
pythonGenerator.forBlock['getKorn'] = function(block) {
    return 'feld.getKorn()\n';
};

pythonGenerator.forBlock['setVolume'] = function(block) {
    var value = block.getFieldValue('Volume')
    return 'misty.setVolume('+value+')\n';
};

pythonGenerator.forBlock['setDisplayText'] = function(block) {
    var value = block.getFieldValue('Text')
    return 'misty.setDisplayText('+value+')\n';
};

pythonGenerator.forBlock['speak'] = function(block) {
    var value = block.getFieldValue('Text')
    return 'misty.say('+value+')\n';
};
// 4. Erstelle den Workspace
var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});
function generatePythonCode() {
    // Basiscode, der die Funktion definiert und einen direkten Aufruf hinzufügt
    var code = "";
    // Wenn keine Blöcke im Workspace sind, fügen wir einen Funktionsaufruf manuell hinzu
    let blocklyCode = pythonGenerator.workspaceToCode(workspace);
    if (!blocklyCode || blocklyCode.trim() === "") blocklyCode = "if __name__ == \'__main__\': \n     print(\"Hello World\")\n";
    code += blocklyCode;
    document.getElementById('pythonCode').textContent = code;
    currentCode = code;
    // Zeige Status-Nachricht an
    statusContainer.textContent = "Status: Code generiert. " + (pyodideReady ? "Bereit zum Ausf\xfchren." : "Warte auf Python-Interpreter...");
    // Aktiviere den Ausführen-Button, wenn Pyodide bereit ist
    if (pyodideReady) document.getElementById('runButton').disabled = false;
}
// Vorbereitung für Pyodide (Python im Browser)
async function initPyodide() {
    try {
        statusContainer.textContent = "Status: Lade Python-Interpreter...";
        outputContainer.textContent = "Initialisiere Python...";
        // Korrekte Initialisierung von Pyodide
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        });
        await pyodide.loadPackage("micropip"); // Lade das micropip-Modul
        const micropip = pyodide.pyimport("micropip");
        await micropip.install("requests"); // Installiert die Bibliothek 'requests'

        const response = await fetch('/static/Misty.py');
        if (!response.ok) throw new Error(`HTTP error Misty! status: ${response.status}`);
        const mistyPyCode = await response.text();
        //console.log(mistyPyCode);
        pyodide.FS.writeFile("Misty.py", mistyPyCode);
        const response2 = await fetch('/static/Feld.py');
        if (!response2.ok) throw new Error(`HTTP error Feld! status: ${response.status}`);
        const feldPyCode = await response2.text();
        //console.log(feldPyCode);
        pyodide.FS.writeFile("Feld.py", feldPyCode);
        // Die Datei in das virtuelle Dateisystem schreiben
        //pyodide.FS.writeFile("Misty.py", mistyPyCode);
        // Konfiguration für Std-Out-Umleitung
        await pyodide.runPythonAsync(`
          import sys
          import micropip
          await micropip.install("requests")
          import requests
          from io import StringIO
          from pyodide.http import pyfetch
          from Misty import Misty
          from Feld import Feld

          async def fetch_data():
              response = await pyfetch("https://jsonplaceholder.typicode.com/todos/1")
              data = await response.json()
              print(data)

          await fetch_data()

          class StdoutCatcher:
              def __init__(self):
                  self.value = ""
              
              def write(self, text):
                  self.value += text
              
              def flush(self):
                  pass

          sys.stdout = StdoutCatcher()  
        `);
        pyodideReady = true;
        statusContainer.textContent = "Status: Python-Interpreter bereit!";
        outputContainer.textContent = "Python-Interpreter bereit! Generieren Sie Code und f\xfchren Sie ihn aus.";
        document.getElementById('runButton').disabled = false;
        // Generiere Standard-Code
        generatePythonCode();
    } catch (error) {
        console.error("Pyodide-Initialisierungsfehler:", error);
        statusContainer.textContent = "Status: Fehler bei der Initialisierung!";
        outputContainer.textContent = "Fehler beim Laden des Python-Interpreters: " + error.message;
    }
}
async function runPythonCode() {
    if (!pyodideReady) {
        outputContainer.textContent = "Python-Interpreter wird noch geladen oder konnte nicht initialisiert werden.";
        return;
    }
    statusContainer.textContent = "Status: F\xfchre Code aus...";
    outputContainer.textContent = "F\xfchre Code aus...";
    try {
        // Ausgabe zurücksetzen
        await pyodide.runPythonAsync("sys.stdout.value = ''");
        // Code ausführen
        await pyodide.runPythonAsync(currentCode);
        // Ausgabe abrufen und anzeigen
        const stdout = await pyodide.runPythonAsync("sys.stdout.value");
        if (stdout && stdout.trim() !== "") outputContainer.textContent = stdout;
        else outputContainer.textContent = "Code ausgef\xfchrt, aber es wurde keine Ausgabe erzeugt. \xdcberpr\xfcfen Sie den Code.";
        statusContainer.textContent = "Status: Code-Ausf\xfchrung abgeschlossen.";
    } catch (error) {
        console.error("Ausf\xfchrungsfehler:", error);
        outputContainer.textContent = "Fehler bei der Ausf\xfchrung: " + error.message;
        statusContainer.textContent = "Status: Fehler bei der Ausf\xfchrung!";
    }
}
// Event-Listener hinzufügen
document.getElementById('generateButton').addEventListener('click', generatePythonCode);
document.getElementById('runButton').addEventListener('click', runPythonCode);
// Pyodide beim Laden der Seite initialisieren
window.addEventListener('DOMContentLoaded', function() {
    initPyodide();
});
