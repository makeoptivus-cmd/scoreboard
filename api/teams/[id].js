import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../data.json');

// Helper functions
const readTeams = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams:', error);
        return [];
    }
};

const writeTeams = (teams) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(teams, null, 2));
    } catch (error) {
        console.error('Error writing teams:', error);
    }
};

// Main handler
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { id } = req.query;

    // PUT update team
    if (req.method === 'PUT') {
        try {
            const { name, members, score, round } = req.body;
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
                return res.status(200).json(teams[index]);
            } else {
                return res.status(404).json({ error: 'Team not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update team' });
        }
    }

    // DELETE team
    if (req.method === 'DELETE') {
        try {
            let teams = readTeams();
            teams = teams.filter(t => t.id !== id);
            writeTeams(teams);
            return res.status(200).json({ message: 'Team deleted' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete team' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
