import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'https://hybrid-quantumclassical-brain-tumor.onrender.com';

export function BackendStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${BACKEND_URL}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      setStatus('offline');
    }
  };

  const wakeUp = async () => {
    setStatus('waking');
    try {
      await fetch(`${BACKEND_URL}/health`);
      setTimeout(() => checkStatus(), 3000);
    } catch (error) {
      setStatus('offline');
    }
  };

  const statusConfig = {
    checking: { bg: '#6B7280', text: 'Checking...', icon: '🔄' },
    online: { bg: '#22C55E', text: 'Backend Online', icon: '✓' },
    offline: { bg: '#EF4444', text: 'Backend Offline', icon: '✗' },
    waking: { bg: '#EAB308', text: 'Waking up...', icon: '⏳' }
  };

  const config = statusConfig[status];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '1rem auto', 
      padding: '0 1rem' 
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        background: `${config.bg}33`,
        border: `1px solid ${config.bg}`,
        fontWeight: '600',
        fontSize: '0.875rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{config.icon}</span>
        <span>{config.text}</span>
      </div>

      {status === 'offline' && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px dashed #EF4444',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#FCA5A5', marginBottom: '0.5rem' }}>
            ⚠️ Backend Server Sleeping
          </p>
          <p style={{ color: '#CBD5E1', marginBottom: '1rem', lineHeight: '1.6' }}>
            The backend is hosted on Render's free tier and goes to sleep after 15 minutes of inactivity.
          </p>
          <button 
            onClick={wakeUp}
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Wake Up Backend
          </button>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.5rem' }}>
            This may take 30-60 seconds
          </p>
        </div>
      )}

      {status === 'waking' && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(234, 179, 8, 0.1)',
          border: '2px dashed #EAB308',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(234, 179, 8, 0.3)',
            borderTopColor: '#EAB308',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#CBD5E1' }}>Waking up the backend server...</p>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.5rem' }}>
            Please wait 30-60 seconds
          </p>
        </div>
      )}
    </div>
  );
}

// Add this CSS to your global styles or App.css
const styles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;