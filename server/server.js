const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readTeams, writeTeams } = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Debug logging
app.use((req, res, next) => {
    console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ version: 2, status: 'ok' });
});

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/dist');
console.log(`[DEBUG] Client Build Path: ${CLIENT_BUILD_PATH}`);


// Helper to sort teams
const sortTeams = (teams) => {
    return teams.sort((a, b) => b.score - a.score);
};

// GET all teams
app.get('/teams', (req, res) => {
    const teams = readTeams();
    res.json(sortTeams(teams));
});

// POST new team
app.post('/teams', (req, res) => {
    const { name, members, score, round } = req.body;
    const newTeam = {
        id: Date.now().toString(),
        name,
        members: members || [], // Array of strings or objects
        score: Number(score) || 0,
        round: Number(round) || 1
    };
    const teams = readTeams();
    teams.push(newTeam);
    writeTeams(teams);
    res.json(newTeam);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// PUT update team
app.put('/teams/:id', (req, res) => {
    const { id } = req.params;
    const { name, members, score, round } = req.body;
    console.log(`[DEBUG] PUT /teams/${id}`, { name, score, round });
    let teams = readTeams();
    const index = teams.findIndex(t => t.id === id);

    if (index !== -1) {
        teams[index] = {
            ...teams[index],
            name,
            members,
            score: Number(score),
            round: Number(round) || teams[index].round || 1
        };
        writeTeams(teams);
        res.json(teams[index]);
    } else {
        res.status(404).json({ message: 'Team not found' });
    }
});

// DELETE team
app.delete('/teams/:id', (req, res) => {
    const { id } = req.params;
    let teams = readTeams();
    teams = teams.filter(t => t.id !== id);
    writeTeams(teams);
    res.json({ message: 'Team deleted' });
});

// POST reset all (Clear all teams)
app.post('/reset', (req, res) => {
    writeTeams([]);
    res.json({ message: 'All teams reset' });
});

// Admin Login (Simple)
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123optivus') {
        res.json({ success: true, token: 'admin-authorized' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Explicit root handler
app.get('/', (req, res) => {
    const indexPath = path.join(CLIENT_BUILD_PATH, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('[DEBUG] Root SendFile Error:', err);
            res.status(500).send(`Error loading root index.html: ${err.message}`);
        }
    });
});

// Catch-all handler
app.get(/.*/, (req, res) => {
    const indexPath = path.join(CLIENT_BUILD_PATH, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('[DEBUG] SendFile Error:', err);
            res.status(500).send(`Error loading index.html: ${err.message}`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
