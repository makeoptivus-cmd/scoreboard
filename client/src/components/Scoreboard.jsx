import React from 'react';
import { Trophy, Medal, Music } from 'lucide-react';

const Scoreboard = ({ teams }) => {
    const getRankIcon = (index) => {
        if (index === 0) return <Trophy size={48} color="var(--gold)" fill="var(--gold)" fillOpacity={0.2} />;
        if (index === 1) return <Medal size={40} color="var(--silver)" />;
        if (index === 2) return <Medal size={32} color="var(--bronze)" />;
        return <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{index + 1}</span>;
    };

    const getRowStyle = (index) => {
        if (index === 0) return { transform: 'scale(1.02)', borderColor: 'var(--gold)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)' };
        if (index === 1) return { borderColor: 'var(--silver)' };
        if (index === 2) return { borderColor: 'var(--bronze)' };
        return {};
    };

    const [selectedRound, setSelectedRound] = React.useState(1);

    const filteredTeams = teams.filter(t => (t.round || 1) === selectedRound);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem' }} className="glow-text">
                Live Scores
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5].map(round => (
                    <button
                        key={round}
                        onClick={() => setSelectedRound(round)}
                        className={`btn ${selectedRound === round ? 'btn-primary' : 'btn-outline'}`}
                        style={{ minWidth: '80px' }}
                    >
                        Round {round}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTeams.map((team, index) => (
                    <div
                        key={team.id}
                        className="card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease',
                            ...getRowStyle(index)
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                                {getRankIcon(index)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: index === 0 ? '2rem' : '1.5rem', color: index === 0 ? 'var(--gold)' : 'white' }}>
                                    {team.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    {team.members.map((member, i) => {
                                        const memberName = typeof member === 'string' ? member : member.name;
                                        const memberPhone = typeof member === 'string' ? '' : member.phone;
                                        return (
                                            (member && (typeof member === 'string' ? member : member.name)) && (
                                                <span key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {memberName}
                                                    {memberPhone && <span style={{ opacity: 0.7, fontSize: '0.8em' }}>{memberPhone}</span>}
                                                </span>
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: index === 0 ? '3rem' : '2.5rem', fontWeight: '800', fontFamily: 'monospace', color: index === 0 ? 'var(--accent-secondary)' : 'white' }}>
                                {team.score}
                            </span>
                        </div>
                    </div>
                ))}

                {filteredTeams.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <Music size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No teams in Round {selectedRound} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scoreboard;
