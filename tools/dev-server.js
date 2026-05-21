const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

const COMMENTS_FILE = path.join(__dirname, '../comments.json');
const IMAGE_MAP_FILE = path.join(__dirname, '../image_map.json');
const PORTFOLIO_DIR = path.join(__dirname, '../assets/images/portfolio');

// Ensure files exist
if (!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
if (!fs.existsSync(IMAGE_MAP_FILE)) fs.writeFileSync(IMAGE_MAP_FILE, JSON.stringify({}));

// API: List all portfolio images
app.get('/api/images', (req, res) => {
    fs.readdir(PORTFOLIO_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Could not read portfolio directory' });
        const images = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
        res.json(images);
    });
});

// API: Comments
app.get('/api/comments', (req, res) => {
    const data = fs.readFileSync(COMMENTS_FILE);
    res.json(JSON.parse(data));
});

app.post('/api/comments', (req, res) => {
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
    comments.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...req.body
    });
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    res.json({ success: true });
});

// API: Image Map
app.get('/api/image-map', (req, res) => {
    const data = fs.readFileSync(IMAGE_MAP_FILE);
    res.json(JSON.parse(data));
});

app.post('/api/image-map', (req, res) => {
    fs.writeFileSync(IMAGE_MAP_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Dev server running at http://localhost:${PORT}`);
});
