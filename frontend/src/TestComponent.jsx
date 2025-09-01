import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '2px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            🎯 Who's That?
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            fontSize: '1.125rem',
            fontWeight: '500'
          }}>
            Challenge a friend in the classic guessing game!
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#1f2937',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#f9fafb',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              color: '#111827',
              fontSize: '16px',
              fontWeight: '500'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            🎮 Create Game
          </button>
          
          <button style={{
            width: '100%',
            backgroundColor: '#059669',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
          >
            🚪 Join Game
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            💡 Tip: Create a game to get a room code, or join with a friend's code!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
