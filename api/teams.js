import { getTeams, addTeam as addTeamToStore } from './_data.js';

const sortTeams = (teams) => {
    return [...teams].sort((a, b) => b.score - a.score);
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

    // GET all teams
    if (req.method === 'GET') {
        try {
            const teams = getTeams();
            return res.status(200).json(sortTeams(teams));
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch teams' });
        }
    }

    // POST new team
    if (req.method === 'POST') {
        try {
            const { name, members, score, round } = req.body;
            const newTeam = {
                id: Date.now().toString(),
                name,
                members: members || [],
                score: Number(score) || 0,
                round: Number(round) || 1
            };
            addTeamToStore(newTeam);
            return res.status(201).json(newTeam);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to add team' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
