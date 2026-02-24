const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'teams.json');

const readTeams = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, '[]', 'utf8');
        return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeTeams = (teams) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(teams, null, 2), 'utf8');
};

module.exports = { readTeams, writeTeams };
