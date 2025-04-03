import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const listen=8764;

fs.readFile('./dist/index.html',function(err, html){
    if(err) throw err;
    
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(listen);
});

// Statischen Ordner bereitstellen
app.use('/static', express.static(path.join(__dirname, 'static')));

// Parcel-Bundle bereitstellen (für index.html und JS)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
