const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the tileset image
app.get('/roguelikeSheet_transparent.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../sources/Roguelike pack/Spritesheet/roguelikeSheet_transparent.png'));
});

// API endpoint to serve the map data
app.get('/api/map', (req, res) => {
    res.sendFile(path.join(__dirname, '../Town Map Test.tmj'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
