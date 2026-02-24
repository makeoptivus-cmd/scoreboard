const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export const getTeams = async () => {
    try {
        const res = await fetch(`${API_URL}/teams`);
        if (!res.ok) throw new Error('Failed to fetch teams');
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

export const addTeam = async (team) => {
    const res = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
    });
    return res.json();
};

export const updateTeam = async (id, team) => {
    const res = await fetch(`${API_URL}/teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
    });
    return res.json();
};

export const deleteTeam = async (id) => {
    const res = await fetch(`${API_URL}/teams/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

export const resetTeams = async () => {
    const res = await fetch(`${API_URL}/reset`, {
        method: 'POST',
    });
    return res.json();
};

export const loginAdmin = async (password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    if (res.ok) {
        return res.json();
    }
    throw new Error('Invalid password');
};
