import { updateTeam, deleteTeam } from '../_supabase.js';

// Main handler
export default async function handler(req, res) {
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
            const updated = await updateTeam(id, {
                name,
                members,
                score: Number(score),
                round: Number(round) || 1
            });
            if (!updated) {
                return res.status(404).json({ error: 'Team not found' });
            }
            return res.status(200).json(updated);
        } catch (error) {
            console.error('PUT team error:', error);
            return res.status(500).json({ error: 'Failed to update team' });
        }
    }

    // DELETE team
    if (req.method === 'DELETE') {
        try {
            await deleteTeam(id);
            return res.status(200).json({ message: 'Team deleted' });
        } catch (error) {
            console.error('DELETE team error:', error);
            return res.status(500).json({ error: 'Failed to delete team' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
