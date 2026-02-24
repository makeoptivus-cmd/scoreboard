import React, { useState } from 'react';
import TeamForm from './TeamForm';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { deleteTeam } from '../api';

const AdminPanel = ({ teams, onTeamUpdated, onTeamDeleted }) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const [editingTeam, setEditingTeam] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [filterRound, setFilterRound] = useState('all');

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        const checkServer = async () => {
            try {
                const res = await fetch('http://localhost:3001/health');
                const data = await res.json();
                if (data.version !== 2) setServerError(true);
            } catch (e) {
                setServerError(true);
            }
        };
        checkServer();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            await deleteTeam(id);
            onTeamDeleted();
        }
    };

    const handleScoreChange = async (team, delta) => {
        const newScore = (team.score || 0) + delta;
        await onTeamUpdated({ ...team, score: newScore }, team.id);
    };

    const handleRoundChange = async (team, newRound) => {
        await onTeamUpdated({ ...team, round: Number(newRound) }, team.id);
    };

    const filteredTeams = filterRound === 'all'
        ? teams
        : teams.filter(t => (t.round || 1) === Number(filterRound));

    if (isAdding || editingTeam) {
        return (
            <div className="container">
                <button className="btn btn-outline" style={{ marginBottom: '1rem' }} onClick={() => { setIsAdding(false); setEditingTeam(null); }}>
                    &larr; Back to List
                </button>
                <TeamForm
                    initialData={editingTeam}
                    onSubmit={async (data) => {
                        await onTeamUpdated(data, editingTeam?.id);
                        setEditingTeam(null);
                        setIsAdding(false);
                    }}
                    onCancel={() => { setIsAdding(false); setEditingTeam(null); }}
                />
            </div>
        );
    }

    return (
        <div className="container">
            {serverError && (
                <div style={{ background: 'var(--danger)', color: 'white', padding: isMobile ? '0.75rem' : '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    ⚠️ CRITICAL: Server update required. Please STOP the terminal (Ctrl+C) and run `npm run dev` again to enable Round features.
                </div>
            )}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                marginBottom: '2rem',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '1rem' : '0'
            }}>
                <h2 style={{ marginTop: 0, fontSize: isMobile ? '1.5rem' : '2rem' }}>Manage Teams</h2>
                <div style={{ 
                    display: 'flex', 
                    gap: isMobile ? '0.5rem' : '1rem', 
                    alignItems: 'center',
                    width: isMobile ? '100%' : 'auto',
                    flexWrap: 'wrap'
                }}>
                    <select
                        value={filterRound}
                        onChange={(e) => setFilterRound(e.target.value)}
                        className="btn btn-outline"
                        style={{ 
                            background: 'transparent', 
                            color: 'white',
                            flex: isMobile ? 1 : 'auto',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem'
                        }}
                    >
                        <option value="all" style={{ background: '#333' }}>All Rounds</option>
                        {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r} style={{ background: '#333' }}>Round {r}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => setIsAdding(true)} style={{ flex: isMobile ? 1 : 'auto', fontSize: isMobile ? '0.9rem' : '1rem', padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem' }}>
                        <Plus size={16} /> {isMobile ? 'Add' : 'Add Team'}
                    </button>
                </div>
            </div>

            {isMobile ? (
                // Mobile: Card view
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredTeams.map(team => (
                        <div key={team.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{team.name}</h4>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        <strong>Round:</strong>
                                        <select
                                            value={team.round || 1}
                                            onChange={(e) => handleRoundChange(team, e.target.value)}
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                padding: '4px 6px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                marginLeft: '0.5rem',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <option key={r} value={r} style={{ background: '#333' }}>R{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => setEditingTeam(team)}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDelete(team.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                <strong>Members:</strong> {team.members.map((m, i) => (
                                    <span key={i}>
                                        {typeof m === 'string' ? m : m.name}
                                        {i < team.members.length - 1 ? ', ' : ''}
                                    </span>
                                )) || 'None'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                                    onClick={() => handleScoreChange(team, -1)}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold', minWidth: '50px', textAlign: 'center' }}>
                                    {team.score}
                                </span>
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                                    onClick={() => handleScoreChange(team, 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredTeams.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                            {filterRound === 'all' ? 'No teams found. Add one to get started.' : `No teams in Round ${filterRound}.`}
                        </div>
                    )}
                </div>
            ) : (
                // Desktop: Table view
                <div className="card" style={{ padding: 0, overflow: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Round</th>
                                <th>Members</th>
                                <th>Score</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeams.map(team => (
                                <tr key={team.id}>
                                    <td style={{ fontWeight: 'bold' }}>{team.name}</td>
                                    <td>
                                        <select
                                            value={team.round || 1}
                                            onChange={(e) => handleRoundChange(team, e.target.value)}
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <option key={r} value={r} style={{ background: '#333', color: 'white' }}>R{r}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>
                                        {team.members.map((m, i) => (
                                            <span key={i}>
                                                {typeof m === 'string' ? m : `${m.name}${m.phone ? ` (${m.phone})` : ''}`}
                                                {i < team.members.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </td>
                                    <td style={{ fontSize: '1.2rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '2px 8px', marginRight: '8px', fontSize: '0.9rem' }}
                                            onClick={() => handleScoreChange(team, -1)}
                                        >
                                            -
                                        </button>
                                        {team.score}
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '2px 8px', marginLeft: '8px', fontSize: '0.9rem' }}
                                            onClick={() => handleScoreChange(team, 1)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ padding: '0.5rem', marginRight: '0.5rem' }} onClick={() => setEditingTeam(team)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDelete(team.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTeams.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                        {filterRound === 'all' ? 'No teams found. Add one to get started.' : `No teams in Round ${filterRound}.`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
