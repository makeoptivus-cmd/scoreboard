import { getTeams, updateTeam as updateTeamInStore, deleteTeam as deleteTeamFromStore } from '../_data.js';

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
            const teams = getTeams();
            const existing = teams.find(t => t.id === id);

            if (existing) {
                const updated = updateTeamInStore(id, {
                    name,
                    members,
                    score: Number(score),
                    round: Number(round) || existing.round || 1
                });
                return res.status(200).json(updated);
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
            deleteTeamFromStore(id);
            return res.status(200).json({ message: 'Team deleted' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete team' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
