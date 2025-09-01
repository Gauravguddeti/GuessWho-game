import React, { useState, useEffect } from 'react';

const MenuInline = ({ onCreateGame, onJoinGame, error, setError }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    // Temporarily disable animations for debugging
    console.log('MenuInline component mounted');
  }, []);

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setError('');
      onCreateGame(playerName.trim());
    } else {
      setError('Please enter your name');
    }
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    setError('');
    onJoinGame(playerName.trim(), roomCode.trim());
  };

  const toggleJoinForm = () => {
    setShowJoinForm(!showJoinForm);
    setError('');
    setRoomCode('');
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  };

  const formContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '2px solid #e5e7eb'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#1f2937',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#6b7280',
    marginBottom: '32px',
    fontSize: '1.125rem',
    fontWeight: '500',
    textAlign: 'center'
  };

  const labelStyle = {
    display: 'block',
    color: '#1f2937',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#f9fafb',
    border: '2px solid #d1d5db',
    borderRadius: '12px',
    color: '#111827',
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    marginBottom: '12px'
  };

  const createButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: 'white'
  };

  const joinButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#059669',
    color: 'white'
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    border: '2px solid #fca5a5',
    borderRadius: '8px',
    padding: '16px',
    color: '#991b1b',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '24px'
  };

  const tipStyle = {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginTop: '24px'
  };

  return (
    <div style={containerStyle}>
      <div className="menu-container" style={formContainerStyle}>
        <div>
          <h1 className="menu-title" style={titleStyle}>
            🎯 Who's That?
          </h1>
          <p style={subtitleStyle}>
            Challenge a friend in the classic guessing game!
          </p>
        </div>

        <form className="menu-form">
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={inputStyle}
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          {showJoinForm && (
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                style={inputStyle}
                placeholder="Enter 4-6 digit code"
                maxLength={6}
              />
            </div>
          )}

          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}

          <div className="menu-buttons">
            {!showJoinForm ? (
              <>
                <button
                  type="submit"
                  onClick={handleCreateGame}
                  style={createButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  🎮 Create Game
                </button>
                <button
                  type="button"
                  onClick={toggleJoinForm}
                  style={joinButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  🚪 Join Game
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={handleJoinGame}
                  style={joinButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  🚀 Join Room
                </button>
                <button
                  type="button"
                  onClick={toggleJoinForm}
                  style={backButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </form>

        <div style={tipStyle}>
          <p>💡 Tip: Create a game to get a room code, or join with a friend's code!</p>
        </div>
      </div>
    </div>
  );
};

export default MenuInline;
