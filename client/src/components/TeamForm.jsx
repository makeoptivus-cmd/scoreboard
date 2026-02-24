import React, { useState, useEffect } from 'react';

const TeamForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [name, setName] = useState('');
    const [members, setMembers] = useState([
        { name: '', phone: '' },
        { name: '', phone: '' },
        { name: '', phone: '' },
        { name: '', phone: '' }
    ]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            // Ensure we have exactly 4 slots
            const m = initialData.members.map(member => {
                if (typeof member === 'string') {
                    return { name: member, phone: '' };
                }
                return member;
            });
            while (m.length < 4) m.push({ name: '', phone: '' });
            setMembers(m.slice(0, 4));
            setScore(initialData.score);
            setRound(initialData.round || 1);
        }
    }, [initialData]);

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setMembers(newMembers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            members: members.filter(m => m.name.trim() !== ''),
            score,
            round
        });
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: isMobile ? '1rem' : '1.5rem' }}>
            <h3 style={{ marginTop: 0, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>{initialData ? 'Edit Team' : 'Add New Team'}</h3>

            <div className="input-group">
                <label>Team Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Rockstars"
                    required
                    style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
            </div>

            <div className="input-group">
                <label>Round</label>
                <select
                    value={round}
                    onChange={(e) => setRound(Number(e.target.value))}
                    style={{ 
                        width: '100%', 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        background: 'rgba(255,255,255,0.05)', 
                        color: 'white',
                        fontSize: isMobile ? '16px' : '1rem'
                    }}
                >
                    {[1, 2, 3, 4, 5].map(r => (
                        <option key={r} value={r} style={{ background: '#333' }}>Round {r}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                {members.map((member, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.5rem' }}>
                        <div className="input-group">
                            <label>Member {i + 1}</label>
                            <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                                placeholder="Name"
                                style={{ fontSize: isMobile ? '16px' : '1rem' }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={member.phone}
                                onChange={(e) => handleMemberChange(i, 'phone', e.target.value)}
                                placeholder="Phone"
                                style={{ fontSize: isMobile ? '16px' : '1rem' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-group">
                <label>Initial Score</label>
                <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    style={{ fontSize: isMobile ? '16px' : '1rem' }}
                />
            </div>

            <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1rem', marginTop: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: isMobile ? '0.75rem' : '0.75rem 1.5rem' }}>
                    {initialData ? 'Update' : 'Add'} Team
                </button>
                {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel} style={{ flex: 1, padding: isMobile ? '0.75rem' : '0.75rem 1.5rem' }}>Cancel</button>}
            </div>
        </form>
    );
};

export default TeamForm;
