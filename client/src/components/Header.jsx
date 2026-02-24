import React from 'react';
import { Music } from 'lucide-react';

const Header = ({ onAdminClick, showAdmin, onLogout, isAdminLoggedIn }) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
            backgroundColor: 'rgba(13, 13, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem' }}>
                <Music size={isMobile ? 24 : 32} color="var(--accent-primary)" />
                <h1 style={{
                    margin: 0,
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(to right, #fff, #a0a0b0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    True Sight
                </h1>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {showAdmin && isAdminLoggedIn && (
                    <button className="btn btn-outline" onClick={onLogout} style={{ fontSize: isMobile ? '0.85rem' : '1rem', padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem' }}>
                        Logout
                    </button>
                )}
                <button className={`btn ${showAdmin ? 'btn-danger' : 'btn-outline'}`} onClick={onAdminClick} style={{ fontSize: isMobile ? '0.85rem' : '1rem', padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem' }}>
                    {isMobile ? (showAdmin ? 'Close' : 'Admin') : (showAdmin ? 'Close Admin' : 'Admin Login')}
                </button>
            </div>
        </header>
    );
};

export default Header;
