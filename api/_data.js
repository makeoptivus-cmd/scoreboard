// In-memory data store for Vercel (read-only filesystem)
// Data persists while function instances are warm

let teams = [];

export const getTeams = () => teams;

export const setTeams = (newTeams) => {
    teams = newTeams;
};

export const addTeam = (team) => {
    teams.push(team);
    return team;
};

export const updateTeam = (id, updates) => {
    const index = teams.findIndex(t => t.id === id);
    if (index !== -1) {
        teams[index] = { ...teams[index], ...updates };
        return teams[index];
    }
    return null;
};

export const deleteTeam = (id) => {
    teams = teams.filter(t => t.id !== id);
};

export const resetTeams = () => {
    teams = [];
};
