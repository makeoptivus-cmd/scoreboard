import React from 'react';
import { Trophy, Medal, Music } from 'lucide-react';

const Scoreboard = ({ teams }) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getRankIcon = (index) => {
        const size = isMobile ? (index === 0 ? 32 : 24) : (index === 0 ? 48 : index === 1 ? 40 : 32);
        if (index === 0) return <Trophy size={size} color="var(--gold)" fill="var(--gold)" fillOpacity={0.2} />;
        if (index === 1) return <Medal size={size} color="var(--silver)" />;
        if (index === 2) return <Medal size={size} color="var(--bronze)" />;
        return <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{index + 1}</span>;
    };

    const getRowStyle = (index) => {
        if (index === 0) return { transform: isMobile ? 'scale(1.01)' : 'scale(1.02)', borderColor: 'var(--gold)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)' };
        if (index === 1) return { borderColor: 'var(--silver)' };
        if (index === 2) return { borderColor: 'var(--bronze)' };
        return {};
    };

    const [selectedRound, setSelectedRound] = React.useState(1);

    const filteredTeams = teams.filter(t => (t.round || 1) === selectedRound);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: isMobile ? '1.75rem' : '2.5rem', 
                marginBottom: '2rem',
                margin: isMobile ? '1rem 0' : '2rem 0'
            }} className="glow-text">
                Live Scores
            </h2>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: isMobile ? '0.5rem' : '1rem', 
                marginBottom: '2rem' 
            }}>
                {[1, 2, 3, 4, 5].map(round => (
                    <button
                        key={round}
                        onClick={() => setSelectedRound(round)}
                        className={`btn ${selectedRound === round ? 'btn-primary' : 'btn-outline'}`}
                        style={{ 
                            minWidth: isMobile ? '65px' : '80px',
                            padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem',
                            fontSize: isMobile ? '0.85rem' : '1rem'
                        }}
                    >
                        R{isMobile ? '' : 'ound '}{round}
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
                            alignItems: isMobile ? 'flex-start' : 'center',
                            justifyContent: 'space-between',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '1rem' : '2rem',
                            transition: 'all 0.3s ease',
                            ...getRowStyle(index)
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            gap: isMobile ? '1rem' : '2rem',
                            width: isMobile ? '100%' : 'auto'
                        }}>
                            <div style={{ width: isMobile ? '40px' : '60px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                                {getRankIcon(index)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ 
                                    margin: 0, 
                                    fontSize: isMobile ? (index === 0 ? '1.3rem' : '1.1rem') : (index === 0 ? '2rem' : '1.5rem'), 
                                    color: index === 0 ? 'var(--gold)' : 'white',
                                    wordBreak: 'break-word'
                                }}>
                                    {team.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    {team.members.map((member, i) => {
                                        const memberName = typeof member === 'string' ? member : member.name;
                                        const memberPhone = typeof member === 'string' ? '' : member.phone;
                                        return (
                                            (member && (typeof member === 'string' ? member : member.name)) && (
                                                <span key={i} style={{ 
                                                    fontSize: isMobile ? '0.75rem' : '0.9rem', 
                                                    color: 'var(--text-secondary)', 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    padding: isMobile ? '2px 6px' : '2px 8px', 
                                                    borderRadius: '4px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {memberName}
                                                    {memberPhone && !isMobile && <span style={{ opacity: 0.7, fontSize: '0.8em' }}>{memberPhone}</span>}
                                                </span>
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div style={{ 
                            textAlign: isMobile ? 'left' : 'right',
                            minWidth: isMobile ? '80px' : 'auto'
                        }}>
                            <span style={{ 
                                fontSize: isMobile ? (index === 0 ? '2rem' : '1.75rem') : (index === 0 ? '3rem' : '2.5rem'), 
                                fontWeight: '800', 
                                fontFamily: 'monospace', 
                                color: index === 0 ? 'var(--accent-secondary)' : 'white' 
                            }}>
                                {team.score}
                            </span>
                        </div>
                    </div>
                ))}

                {filteredTeams.length === 0 && (
                    <div style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '4rem', color: 'var(--text-secondary)' }}>
                        <Music size={isMobile ? 48 : 64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ fontSize: isMobile ? '0.95rem' : '1rem' }}>No teams in Round {selectedRound} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scoreboard;
