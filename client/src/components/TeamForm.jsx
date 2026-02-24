import React, { useState, useEffect } from 'react';

const TeamForm = ({ onSubmit, initialData = null, onCancel }) => {
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
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ marginTop: 0 }}>{initialData ? 'Edit Team' : 'Add New Team'}</h3>

            <div className="input-group">
                <label>Team Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Rockstars"
                    required
                />
            </div>

            <div className="input-group">
                <label>Round</label>
                <select
                    value={round}
                    onChange={(e) => setRound(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                >
                    {[1, 2, 3, 4, 5].map(r => (
                        <option key={r} value={r} style={{ background: '#333' }}>Round {r}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {members.map((member, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Member {i + 1} Name</label>
                            <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                                placeholder={`Name`}
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone (Optional)</label>
                            <input
                                type="text"
                                value={member.phone}
                                onChange={(e) => handleMemberChange(i, 'phone', e.target.value)}
                                placeholder={`Phone`}
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
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

export default TeamForm;
