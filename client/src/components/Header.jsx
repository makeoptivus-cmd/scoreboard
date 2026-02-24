import React from 'react';
import { Music } from 'lucide-react';

const Header = ({ onAdminClick, showAdmin, onLogout, isAdminLoggedIn }) => {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(13, 13, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Music size={32} color="var(--accent-primary)" />
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #fff, #a0a0b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    True Sight
                </h1>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {showAdmin && isAdminLoggedIn && (
                    <button className="btn btn-outline" onClick={onLogout}>
                        Logout
                    </button>
                )}
                <button className={`btn ${showAdmin ? 'btn-danger' : 'btn-outline'}`} onClick={onAdminClick}>
                    {showAdmin ? 'Close Admin' : 'Admin Login'}
                </button>
            </div>
        </header>
    );
};

export default Header;
