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
        const { password } = req.body;
        if (password === 'admin123optivus1') {
            return res.status(200).json({ success: true, token: 'admin-authorized' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
