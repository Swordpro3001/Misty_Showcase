const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3000;

// CORS aktivieren, damit der Client auf den Server zugreifen kann
app.use(cors());
app.use(express.static("src")); // Serviert hochgeladene Dateien

// Speicherort für hochgeladene Dateien definieren
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/");
  },
  filename: function (req, file, cb) {
    cb(null, "Misty.py"); // Datei wird immer mit gleichem Namen gespeichert
  }
});

const upload = multer({ storage: storage });

// Endpunkt für den automatischen Upload
app.post("/src", upload.single("file"), (req, res) => {
  console.log("Datei hochgeladen:", req.file);
  res.json({ message: "Upload erfolgreich", filename: req.file.filename });
});

// Endpunkt zum Abrufen der Datei
app.get("/Misty.py", (req, res) => {
  const filePath = "src/Misty.py";
  if (fs.existsSync(filePath)) {
    res.sendFile(__dirname + "/" + filePath);
  } else {
    res.status(404).send("Datei nicht gefunden");
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
