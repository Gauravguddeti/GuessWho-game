import React, { useState } from 'react';

const SimpleMenu = ({ onCreateGame, onJoinGame, error, setError }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateGame = (e) => {
    e.preventDefault();
    console.log('Create game clicked with name:', playerName);
    if (playerName.trim()) {
      setError('');
      onCreateGame(playerName.trim());
    } else {
      setError('Please enter your name');
    }
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    console.log('Join game clicked with name:', playerName, 'code:', roomCode);
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '3px solid #000000',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#000000',
          marginBottom: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          🎯 Guess Who?
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#333333',
          marginBottom: '30px'
        }}>
          Challenge a friend in the classic guessing game!
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '8px',
            textAlign: 'left'
          }}>
            Your Name:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #000000',
              borderRadius: '5px',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        {showJoinForm && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '8px',
              textAlign: 'left'
            }}>
              Room Code:
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #000000',
                borderRadius: '5px',
                backgroundColor: '#ffffff',
                color: '#000000'
              }}
              placeholder="Enter room code"
              maxLength={6}
            />
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#ffcccc',
            border: '2px solid #ff0000',
            borderRadius: '5px',
            padding: '15px',
            color: '#cc0000',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div>
          {!showJoinForm ? (
            <>
              <button
                onClick={handleCreateGame}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  border: '2px solid #004499',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#004499'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
              >
                🎮 Create New Game
              </button>
              
              <button
                onClick={() => setShowJoinForm(true)}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  backgroundColor: '#009933',
                  color: '#ffffff',
                  border: '2px solid #006622',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#006622'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#009933'}
              >
                🚪 Join Existing Game
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleJoinGame}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  backgroundColor: '#009933',
                  color: '#ffffff',
                  border: '2px solid #006622',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#006622'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#009933'}
              >
                🚀 Join Room
              </button>
              
              <button
                onClick={() => setShowJoinForm(false)}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  backgroundColor: '#666666',
                  color: '#ffffff',
                  border: '2px solid #444444',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#666666'}
              >
                ← Back
              </button>
            </>
          )}
        </div>

        <p style={{
          fontSize: '14px',
          color: '#666666',
          marginTop: '25px'
        }}>
          💡 Tip: Create a game to get a room code, or join with a friend's code!
        </p>
      </div>
    </div>
  );
};

export default SimpleMenu;
