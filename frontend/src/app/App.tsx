import React from 'react';
import SongForm from '../components/SongForm';
import SongList from '../components/SongList';
import StatsDashboard from '../features/stats/StatsDashboard';

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: '#fff', padding: '32px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 800, textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
          🎵 MERN Song Management System
        </h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '18px', fontWeight: 300 }}>
          CRUD Operations + Live Stats with Redux Toolkit & Sagas
        </p>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <h2 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '24px', fontWeight: 600 }}>
              ➕ Manage Songs
            </h2>
            <SongForm />
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <SongList />
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <StatsDashboard />
        </div>
      </main>
    </div>
  );
};

export default App;
