import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data.json');

const writeTeams = (teams) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(teams, null, 2));
    } catch (error) {
        console.error('Error writing teams:', error);
    }
};

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

    if (req.method === 'POST') {
        try {
            writeTeams([]);
            return res.status(200).json({ message: 'All teams reset' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to reset teams' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
