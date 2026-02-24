import { useState, useEffect } from 'react';
import Header from './components/Header';
import Scoreboard from './components/Scoreboard';
import AdminPanel from './components/AdminPanel';
import { getTeams, addTeam, updateTeam, loginAdmin } from './api';
import './index.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchTeams = async () => {
    const data = await getTeams();
    setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
    // Poll for updates every 5 seconds if not in admin mode (for projector view)
    const interval = setInterval(() => {
      if (!showAdmin) {
        fetchTeams();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [showAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(password);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Invalid Password');
    }
  };

  const handleTeamUpdate = async (teamData, id) => {
    if (id) {
      await updateTeam(id, teamData);
    } else {
      await addTeam(teamData);
    }
    fetchTeams();
  };

  return (
    <>
      <Header
        onAdminClick={() => setShowAdmin(!showAdmin)}
        showAdmin={showAdmin}
        isAdminLoggedIn={isAuthenticated}
        onLogout={() => { setIsAuthenticated(false); setPassword(''); setShowAdmin(false); }}
      />

      <main style={{ flex: 1 }}>
        {showAdmin ? (
          isAuthenticated ? (
            <AdminPanel
              teams={teams}
              onTeamUpdated={handleTeamUpdate}
              onTeamDeleted={fetchTeams}
            />
          ) : (
            <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
              <div className="card">
                <h2 style={{ textAlign: 'center', marginTop: 0 }}>Admin Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                    />
                  </div>
                  {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
              </div>
            </div>
          )
        ) : (
          <Scoreboard teams={teams} />
        )}
      </main>
    </>
  );
}

export default App;
