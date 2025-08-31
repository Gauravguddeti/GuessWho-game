import React from 'react';

const LobbyInline = ({ roomCode, players, isHost, onStartGame, onBackToMenu }) => {
  console.log('Lobby rendering with:', { roomCode, players, isHost });

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '3px solid #000000',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    fontSize: '36px',
    color: '#000000',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold'
  };

  const roomCodeStyle = {
    fontSize: '48px',
    color: '#0066cc',
    fontWeight: 'bold',
    backgroundColor: '#e6f3ff',
    border: '2px solid #0066cc',
    borderRadius: '10px',
    padding: '15px',
    margin: '20px 0',
    letterSpacing: '8px',
    fontFamily: 'monospace'
  };

  const sectionStyle = {
    backgroundColor: '#f9f9f9',
    border: '2px solid #cccccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px 0'
  };

  const playerItemStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #0066cc',
    borderRadius: '8px',
    padding: '12px',
    margin: '8px 0',
    fontSize: '16px',
    color: '#000000',
    fontWeight: '500'
  };

  const hostBadgeStyle = {
    backgroundColor: '#ff6600',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '12px',
    marginLeft: '10px'
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '10px',
    minWidth: '150px'
  };

  const startButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#00cc44',
    color: '#ffffff',
    borderColor: '#009933'
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#666666',
    color: '#ffffff',
    borderColor: '#444444'
  };

  const instructionStyle = {
    fontSize: '16px',
    color: '#333333',
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '8px',
    padding: '15px',
    margin: '20px 0'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🎮 Game Lobby</h1>
        
        <div style={roomCodeStyle}>
          {roomCode}
        </div>
        
        <p style={{ fontSize: '16px', color: '#666666', marginBottom: '20px' }}>
          Share this code with your friend to join the game!
        </p>

        <div style={sectionStyle}>
          <h3 style={{ fontSize: '20px', color: '#000000', marginBottom: '15px' }}>
            👥 Players ({players.length}/2)
          </h3>
          
          {players.map((player, index) => (
            <div key={player.id} style={playerItemStyle}>
              🎯 {player.name}
              {player.isHost && (
                <span style={hostBadgeStyle}>HOST</span>
              )}
            </div>
          ))}
          
          {players.length < 2 && (
            <div style={{
              ...playerItemStyle,
              backgroundColor: '#f0f0f0',
              color: '#999999',
              fontStyle: 'italic',
              borderStyle: 'dashed'
            }}>
              Waiting for player 2...
            </div>
          )}
        </div>

        {players.length < 2 && (
          <div style={instructionStyle}>
            ⏳ Waiting for another player to join. Share the room code above!
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          {isHost && players.length >= 2 && (
            <button
              onClick={onStartGame}
              style={startButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#009933'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#00cc44'}
            >
              🚀 Start Game
            </button>
          )}
          
          <button
            onClick={onBackToMenu}
            style={backButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#666666'}
          >
            ← Back to Menu
          </button>
        </div>

        <div style={{
          fontSize: '14px',
          color: '#666666',
          marginTop: '20px',
          fontStyle: 'italic'
        }}>
          💡 Need exactly 2 players to start the game
        </div>
      </div>
    </div>
  );
};

export default LobbyInline;
