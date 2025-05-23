// Global variables
let pyodideReady = false;
let pyodide = null;
let currentCode = "";
let workspace = null;
let useRealAPI = "False"; // New variable to track if we should use real API
const statusContainer = document.getElementById('statusContainer');
const outputContainer = document.getElementById('outputContainer');

// This function will fetch and insert the toolbox XML
async function loadToolbox() {
  try {
    const response = await fetch('structure.xml');
    if (!response.ok) {
      throw new Error('Failed to load toolbox XML');
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const toolboxXML = xmlDoc.documentElement;
    
    // Create a hidden container for the toolbox if it doesn't exist
    let toolboxContainer = document.getElementById('toolbox-container');
    if (!toolboxContainer) {
      toolboxContainer = document.createElement('div');
      toolboxContainer.id = 'toolbox-container';
      toolboxContainer.style.display = 'none';
      document.body.appendChild(toolboxContainer);
    }
    
    // Add an id to the toolbox if it doesn't have one
    if (!toolboxXML.id) {
      toolboxXML.id = 'toolbox';
    }
    
    // Insert the toolbox into the document
    toolboxContainer.appendChild(toolboxXML);
    
    // Initialize Blockly after the toolbox is loaded
    initBlockly();
  } catch (error) {
    console.error('Error loading toolbox:', error);
    // Fallback to embedded toolbox if available
    const embeddedToolbox = document.getElementById('toolbox');
    if (embeddedToolbox) {
      initBlockly();
    } else {
      statusContainer.textContent = 'Status: Error loading toolbox!';
      console.error('No toolbox found, cannot initialize Blockly');
    }
  }
}

// Define custom blocks
function defineCustomBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "scope",
      "message0": "Scope with IP %1",
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
      "tooltip": "Creates a new scope with an IP address.",
      "helpUrl": ""
    },
    {
      "type": "custom_function",
      "message0": "call my function",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200
    },
    {
      "type": "forward_fuer",
      "message0": "Move %1 blocks forward",
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
      "message0": "turn 90 degrees left",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 300
    },
    {
      "type": "forward",
      "message0": "move one block forward",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 300
    },
    {
      "type": "getKorn",
      "message0": "pick up the grain",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 300
    }
  ]);
}

// Define Python generators for custom blocks
function definePythonGenerators() {
  var pythonGenerator = Blockly.Python;
  
  pythonGenerator.forBlock['scope'] = function(block) {
    var ip = block.getFieldValue('IP_ADDRESS');
    var code = pythonGenerator.statementToCode(block, 'CODE');
    // Add field simulation interface with API toggle
    return `from Misty import Misty
from Feld import Feld
import js

# Initialize field simulation in the browser
def updateField(command, from_pos=None, to_pos=None):
    if command == "move" and from_pos and to_pos:
        js.window.fieldFunctions.move(from_pos, to_pos)
    elif command == "pickup" and from_pos:
        js.window.fieldFunctions.pickUp(from_pos)
    elif command == "reset":
        js.window.fieldFunctions.reset()

if __name__ == "__main__": 
  use_real_api = ${useRealAPI}  # Pass the toggle state to Python
  misty = Misty("${ip}", use_real_api)
  feld = Feld(misty)
  # Reset field simulation
  updateField("reset")
${code}`;
  };
  
  pythonGenerator.forBlock['custom_function'] = function(block) {
    return 'print("Hello World")\n';
  };
  
  pythonGenerator.forBlock['rotate'] = function(block) {
    return 'feld.rotate()\nprint("Rotating left 90 degrees")\n';
  };
  
  pythonGenerator.forBlock['forward'] = function(block) {
    return `feld.forward()
print("Moving forward one block")
# Update simulation
from_pos = feld.get_position()
to_pos = feld.get_next_position()
print(f"Updating field: move from {from_pos} to {to_pos}")
updateField("move", from_pos, to_pos)
  \n`;
  };
  
  pythonGenerator.forBlock['forward_fuer'] = function(block) {
    var value = block.getFieldValue('Blocks');
    return `feld.misty_drive(${value})
print(f"Moving forward {${value}} blocks")
\n`;
  };
  
  pythonGenerator.forBlock['getKorn'] = function(block) {
    return `feld.getKorn()
print("Picking up grain")
current_pos = feld.get_position()
updateField("pickup", current_pos)
\n`;
  };
}

// Initialize Blockly workspace
function initBlockly() {
  defineCustomBlocks();
  definePythonGenerators();
  
  const toolbox = document.getElementById('toolbox');
  if (!toolbox) {
    console.error('Toolbox element not found! Cannot initialize Blockly.');
    statusContainer.textContent = 'Status: Error - Toolbox not found!';
    return;
  }
  
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox
  });
  
  // Enable code generation
  document.getElementById('generateButton').addEventListener('click', generatePythonCode);
  document.getElementById('runButton').addEventListener('click', runPythonCode);
  
  // Add the new API toggle button event listener
  document.getElementById('apiToggle').addEventListener('change', function(e) {
    useRealAPI = e.target.checked ? "True" : "False";  // Store as string
    statusContainer.textContent = "Status: " + (useRealAPI === "True" ? "Using real Misty API" : "Using simulation only");
    generatePythonCode();
  });
  
  // Add template handlers
  setupTemplates();
}

// Generate Python code from blocks
function generatePythonCode() {
  var pythonGenerator = Blockly.Python;
  var code = "";
  
  let blocklyCode = pythonGenerator.workspaceToCode(workspace);
  if (!blocklyCode || blocklyCode.trim() === "") {
    blocklyCode = "if __name__ == '__main__': \n     print(\"Hello World\")\n";
  }
  
  code += blocklyCode;
  document.getElementById('pythonCode').textContent = code;
  currentCode = code;
  
  let apiStatus = useRealAPI ? "Using real Misty API. " : "Using simulation only. ";
  statusContainer.textContent = "Status: Code generated. " + apiStatus + 
    (pyodideReady ? "Ready to run." : "Waiting for Python interpreter...");
  
  if (pyodideReady) {
    document.getElementById('runButton').disabled = false;
  }
}

// Initialize Pyodide (Python in the browser)
async function initPyodide() {
  try {
    statusContainer.textContent = "Status: Loading Python interpreter...";
    outputContainer.textContent = "Initializing Python...";
    
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
    });
    
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install("requests");
    
    
    const response = await fetch('/static/Misty.py');
    const mistyPyCode = await response.text();
    // Modify the Misty class to handle the toggle
    const modifiedMistyCode = mistyPyCode.replace(
      /def __init__\(self, ip\):[\s\S]+?self.setLEDHex\("000000"\)/,
      `def __init__(self, ip, use_real_api=False):
            self.ip = ip
            self.api_url = f"http://{self.ip}/api/"
            self.use_real_api = use_real_api
            self.setLEDHex("000000")`
    ).replace(
      /def mistyResponse\(self, command, parameters\):[\s\S]+?print\(parameters\)/,
      `def mistyResponse(self, command, parameters):
            if not self.use_real_api:
                print(f"SIMULATION: Would call API: {command}")
                print(f"SIMULATION: With parameters: {parameters}")
                return
            response = rq.post(f"{self.api_url}{command}", params=parameters)
            print(f"{self.api_url}{command}\\n{response}\\n{response.text}")
            print(parameters)`
    );
      

    
      
    pyodide.FS.writeFile("Misty.py", modifiedMistyCode);
    
    const response2 = await fetch('/static/feld.py');
    
    
    const feldPyCode = await response2.text();
    pyodide.FS.writeFile("Feld.py", feldPyCode);
    
    
    // Configure stdout capture
    await pyodide.runPythonAsync(`
      import sys
      import micropip
      await micropip.install("requests")
      import requests
      from io import StringIO
      from pyodide.http import pyfetch
      import js
      
      try:
        from Misty import Misty
        from Feld import Feld
      except Exception as e:
        print(f"Error importing modules: {e}")

      class StdoutCatcher:
        def __init__(self):
            self.value = ""
        
        def write(self, text):
            self.value += text
        
        def flush(self):
            pass

      sys.stdout = StdoutCatcher()
      
      print("Python environment ready!")
    `);
    
    pyodideReady = true;
    statusContainer.textContent = "Status: Python interpreter ready!";
    outputContainer.textContent = "Python interpreter ready! Generate code and run it.";
    document.getElementById('runButton').disabled = false;
    
    // Generate initial code
    generatePythonCode();
    
  } catch (error) {
    console.error("Pyodide initialization error:", error);
    statusContainer.textContent = "Status: Error during initialization!";
    outputContainer.textContent = "Error loading Python interpreter: " + error.message;
  }
}

// Run the generated Python code
async function runPythonCode() {
  if (!pyodideReady) {
    outputContainer.textContent = "Python interpreter is still loading or could not be initialized.";
    return;
  }
  
  let apiStatus = useRealAPI === "True" ? "with real API" : "in simulation mode";
  statusContainer.textContent = `Status: Running code ${apiStatus}...`;
  outputContainer.textContent = `Running code ${apiStatus}...`;
  
  try {
    // Reset output
    await pyodide.runPythonAsync("sys.stdout.value = ''");

    // Make sure the field simulation is reset before running
    document.getElementById('feld').innerHTML = '';
    initializeField();
    
    // Execute code with a small delay to ensure UI is updated
    setTimeout(async () => {
      try {
        await pyodide.runPythonAsync(currentCode);
        
        // Get and display output
        const stdout = await pyodide.runPythonAsync("sys.stdout.value");
        if (stdout && stdout.trim() !== "") {
          outputContainer.textContent = stdout;
        } else {
          outputContainer.textContent = "Code executed, but no output was generated. Check your code.";
        }
        
        statusContainer.textContent = `Status: Code execution completed ${apiStatus}.`;
      } catch (error) {
        console.error("Execution error:", error);
        outputContainer.textContent = "Error during execution: " + error.message;
        statusContainer.textContent = "Status: Error during execution!";
      }
    }, 100);
  } catch (error) {
    console.error("Execution error:", error);
    outputContainer.textContent = "Error during execution: " + error.message;
    statusContainer.textContent = "Status: Error during execution!";
  }
}

// Configure template examples
function setupTemplates() {
  document.getElementById('templateBasic').addEventListener('click', function() {
    workspace.clear();
    const basicBlock = workspace.newBlock('scope');
    basicBlock.initSvg();
    basicBlock.render();
    generatePythonCode();
  });
  
  document.getElementById('templateMaze').addEventListener('click', function() {
    workspace.clear();
    const scopeBlock = workspace.newBlock('scope');
    scopeBlock.initSvg();
    scopeBlock.render();
    
    // Add a simple maze-solving pattern
    const forwardBlock = workspace.newBlock('forward');
    const rotateBlock = workspace.newBlock('rotate');
    const forwardBlock2 = workspace.newBlock('forward');
    const getKornBlock = workspace.newBlock('getKorn');
    
    // Connect blocks
    const scopeConnection = scopeBlock.getInput('CODE').connection;
    scopeConnection.connect(forwardBlock.previousConnection);
    forwardBlock.nextConnection.connect(rotateBlock.previousConnection);
    rotateBlock.nextConnection.connect(forwardBlock2.previousConnection);
    forwardBlock2.nextConnection.connect(getKornBlock.previousConnection);
    
    // Render the new blocks
    forwardBlock.initSvg();
    rotateBlock.initSvg();
    forwardBlock2.initSvg();
    getKornBlock.initSvg();
    
    forwardBlock.render();
    rotateBlock.render();
    forwardBlock2.render();
    getKornBlock.render();
    
    generatePythonCode();
  });
  
  document.getElementById('templateAdvanced').addEventListener('click', function() {
    workspace.clear();
    const scopeBlock = workspace.newBlock('scope');
    scopeBlock.initSvg();
    scopeBlock.render();
    
  // Create a simple loop example
  const loopBlock = workspace.newBlock('controls_repeat_ext');
  const numberBlock = workspace.newBlock('math_number');
  numberBlock.setFieldValue('4', 'NUM');
  
  const forwardBlock = workspace.newBlock('forward');
  const rotateBlock = workspace.newBlock('rotate');
  
  // Connect blocks
  const scopeConnection = scopeBlock.getInput('CODE').connection;
  scopeConnection.connect(loopBlock.previousConnection);
  
  loopBlock.getInput('TIMES').connection.connect(numberBlock.outputConnection);
  loopBlock.getInput('DO').connection.connect(forwardBlock.previousConnection);
  forwardBlock.nextConnection.connect(rotateBlock.previousConnection);
  
  // Render all blocks
  loopBlock.initSvg();
  numberBlock.initSvg();
  forwardBlock.initSvg();
  rotateBlock.initSvg();
  
  loopBlock.render();
  numberBlock.render();
  forwardBlock.render();
  rotateBlock.render();
  
  generatePythonCode();
});
}

// Initialize everything when the page loads
window.addEventListener('DOMContentLoaded', function() {
// Load the toolbox from external file
loadToolbox();

// Initialize Pyodide
initPyodide();
});