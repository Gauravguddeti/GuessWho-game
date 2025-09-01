import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import CharacterSelection from './components/CharacterSelection';
import BoardInline from './components/BoardInline';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, lobby, character_selection, playing, finished
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [secretCharacter, setSecretCharacter] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [eliminatedCharacters, setEliminatedCharacters] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [selectedSecretCharacter, setSelectedSecretCharacter] = useState(null);
  const [readyCount, setReadyCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [connectingToServer, setConnectingToServer] = useState(true);

  // Wake up server function
  const wakeUpServer = async () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    try {
      setNotification('Waking up server... ☕');
      const response = await fetch(`${serverUrl}/health`, { 
        method: 'GET',
        timeout: 30000 
      });
      if (response.ok) {
        setNotification('Server is ready! 🚀');
        setTimeout(() => setNotification(''), 2000);
      }
    } catch (error) {
      console.log('Server wake-up ping failed:', error);
      setNotification('Server starting... This may take a moment ⏳');
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    
    // Wake up server first (for Render free tier)
    wakeUpServer();
    
    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (connectingToServer) {
        setNotification('Server is starting up... This may take 30-60 seconds on first load ⏳');
      }
    }, 5000);

    const newSocket = io(serverUrl, {
      timeout: 60000, // 60 second timeout
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });
    
    setSocket(newSocket);

    // Connection status handlers
    newSocket.on('connect', () => {
      clearTimeout(connectionTimeout);
      setConnectingToServer(false);
      setLoading(false);
      setError('');
      setNotification('Connected! 🎮');
      setTimeout(() => setNotification(''), 2000);
    });

    newSocket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server disconnected us, don't auto-reconnect
        setNotification('Server disconnected 🔌');
      } else {
        // Client disconnected, will auto-reconnect
        setNotification('Reconnecting... 🔄');
      }
    });

    newSocket.on('connect_error', (error) => {
      setNotification('Connection failed. Retrying... ⚠️');
      console.log('Connection error:', error);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setNotification('Reconnected! 🎉');
      setTimeout(() => setNotification(''), 2000);
    });

    newSocket.on('reconnect_failed', () => {
      setConnectingToServer(false);
      setError('Unable to connect to server. Please refresh the page.');
      setNotification('Connection failed ❌');
    });

    // Keep server alive with periodic pings (prevent Render sleep)
    const keepAliveInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 10 * 60 * 1000); // Ping every 10 minutes

    // Socket event listeners
    newSocket.on('gameCreated', ({ roomCode, playerName }) => {
      setRoomCode(roomCode);
      setPlayerName(playerName);
      setGameState('lobby');
      setIsHost(true);
      setError('');
      setLoading(false);
      setNotification(`Game created! Room code: ${roomCode} 🎯`);
      setTimeout(() => setNotification(''), 5000);
    });

    newSocket.on('gameJoined', ({ roomCode, playerName }) => {
      setRoomCode(roomCode);
      setPlayerName(playerName);
      setGameState('lobby');
      setIsHost(false);
      setError('');
      setLoading(false);
      setNotification('Successfully joined the game! 🎉');
      setTimeout(() => setNotification(''), 3000);
    });

    newSocket.on('joinError', (errorMsg) => {
      setError(errorMsg);
    });

    newSocket.on('playerJoined', ({ players }) => {
      setPlayers(players);
    });

    newSocket.on('characterSelectionStarted', ({ characters, players }) => {
      setCharacters(characters);
      setPlayers(players);
      setGameState('character_selection');
      setSelectedSecretCharacter(null);
      setReadyCount(0);
    });
    
    newSocket.on('secretCharacterSelected', ({ character }) => {
      setSelectedSecretCharacter(character);
    });
    
    newSocket.on('characterSelectionUpdate', ({ readyCount, totalPlayers }) => {
      setReadyCount(readyCount);
    });

    newSocket.on('gameStarted', ({ characters, secretCharacter, currentTurn, players }) => {
      setCharacters(characters);
      setSecretCharacter(secretCharacter);
      setCurrentTurn(currentTurn);
      setPlayers(players);
      setGameState('playing');
      setChatHistory([]);
      setEliminatedCharacters([]);
    });

    newSocket.on('questionAsked', (message) => {
      setChatHistory(prev => [...prev, message]);
    });

    newSocket.on('answerGiven', ({ answer, currentTurn }) => {
      setChatHistory(prev => [...prev, answer]);
      setCurrentTurn(currentTurn);
    });

    newSocket.on('characterEliminated', ({ characterId, eliminatedCharacters }) => {
      setEliminatedCharacters(eliminatedCharacters);
    });
    
    newSocket.on('turnChanged', ({ currentTurn, action, actionPlayer, characterFlipped }) => {
      setCurrentTurn(currentTurn);
      // Optionally add a chat message about the action
      if (action === 'flip' && characterFlipped) {
        const actionMessage = {
          id: `action-${Date.now()}`,
          playerId: 'system',
          playerName: 'Game',
          type: 'system',
          content: `${actionPlayer} flipped ${characterFlipped}`,
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, actionMessage]);
      }
    });

    newSocket.on('gameEnded', (result) => {
      setGameResult(result);
      setGameState('finished');
    });

    newSocket.on('playerDisconnected', ({ remainingPlayers }) => {
      if (remainingPlayers.length === 1) {
        setGameResult({
          winner: newSocket.id,
          winnerName: playerName,
          isCorrectGuess: false,
          disconnection: true
        });
        setGameState('finished');
      }
      setPlayers(remainingPlayers);
    });

    newSocket.on('error', (errorMsg) => {
      setError(errorMsg);
      setLoading(false);
      setNotification(`Error: ${errorMsg} ❌`);
      setTimeout(() => setNotification(''), 5000);
    });

    return () => {
      clearInterval(keepAliveInterval);
      clearTimeout(connectionTimeout);
      newSocket.close();
    };
  }, [playerName]); // Add playerName to dependencies

  const createGame = (name) => {
    if (!socket || !socket.connected) {
      setNotification('Not connected to server. Please wait... ⏳');
      return;
    }
    
    setLoading(true);
    setPlayerName(name);
    setError('');
    setNotification('Creating game... 🎮');
    
    // Add timeout for game creation
    const timeout = setTimeout(() => {
      setLoading(false);
      setNotification('Game creation taking too long. Please try again. ⏰');
      setTimeout(() => setNotification(''), 3000);
    }, 10000); // 10 second timeout
    
    socket.emit('createGame', name);
    
    // Clear timeout when game is created (handled in gameCreated event)
    socket.once('gameCreated', () => {
      clearTimeout(timeout);
    });
  };

  const joinGame = (name, code) => {
    if (!socket || !socket.connected) {
      setNotification('Not connected to server. Please wait... ⏳');
      return;
    }
    
    setLoading(true);
    setPlayerName(name);
    setError('');
    setNotification('Joining game... 🎯');
    
    // Add timeout for game joining
    const timeout = setTimeout(() => {
      setLoading(false);
      setNotification('Join taking too long. Check room code and try again. ⏰');
      setTimeout(() => setNotification(''), 3000);
    }, 10000); // 10 second timeout
    
    socket.emit('joinGame', { roomCode: code, playerName: name });
    
    // Clear timeout when game is joined
    socket.once('gameJoined', () => {
      clearTimeout(timeout);
    });
  };

  const startGame = () => {
    socket.emit('startGame', roomCode);
  };

  const askQuestion = (question) => {
    socket.emit('askQuestion', { roomCode, question });
  };

  const answerQuestion = (messageId, answer) => {
    socket.emit('answerQuestion', { roomCode, messageId, answer });
  };

  const eliminateCharacter = (characterId) => {
    socket.emit('eliminateCharacter', { roomCode, characterId });
  };

  const makeGuess = (characterId) => {
    socket.emit('makeGuess', { roomCode, characterId });
  };
  
  const selectSecretCharacter = (characterId) => {
    socket.emit('selectSecretCharacter', { roomCode, characterId });
  };

  const resetGame = () => {
    setGameState('menu');
    setPlayerName('');
    setRoomCode('');
    setPlayers([]);
    setCharacters([]);
    setSecretCharacter(null);
    setCurrentTurn(null);
    setEliminatedCharacters([]);
    setChatHistory([]);
    setGameResult(null);
    setError('');
    setIsHost(false);
    setSelectedSecretCharacter(null);
    setReadyCount(0);
  };

  const restartGame = () => {
    // Keep the same room and players, just reset game state
    setGameState('lobby');
    setCharacters([]);
    setSecretCharacter(null);
    setCurrentTurn(null);
    setEliminatedCharacters([]);
    setChatHistory([]);
    setGameResult(null);
    setError('');
    setSelectedSecretCharacter(null);
    setReadyCount(0);
    // Keep playerName, roomCode, players, and isHost
  };

  const isMyTurn = currentTurn === socket?.id;
  const myPlayerId = socket?.id;

  // Debug information
  console.log('App rendering, gameState:', gameState);

  return (
    <div>
      {/* Loading Overlay */}
      {(connectingToServer || loading) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '40px',
              animation: 'spin 1s linear infinite',
              marginBottom: '15px'
            }}>🎮</div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px'
            }}>
              {connectingToServer ? 'Connecting to server...' : 'Loading...'}
            </div>
            {connectingToServer && (
              <div style={{
                fontSize: '14px',
                color: '#666',
                maxWidth: '300px'
              }}>
                First time may take 30-60 seconds as the server starts up ⏳
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1001,
          animation: 'slideDown 0.3s ease-out'
        }}>
          {notification}
        </div>
      )}

      {/* Debug info */}
      <div style={{
        position: 'fixed',
        top: '8px',
        right: '8px',
        backgroundColor: 'black',
        color: 'white',
        padding: '8px',
        fontSize: '12px',
        zIndex: 50,
        borderRadius: '4px'
      }}>
        State: {gameState} | Socket: {socket?.connected ? 'Connected' : 'Disconnected'}
      </div>
      
      {gameState === 'menu' && (
        <Menu 
          onCreateGame={createGame}
          onJoinGame={joinGame}
          error={error}
          setError={setError}
        />
      )}
      
      {gameState === 'lobby' && (
        <Lobby
          roomCode={roomCode}
          players={players}
          isHost={isHost}
          onStartGame={startGame}
          onBackToMenu={resetGame}
        />
      )}
      
      {gameState === 'character_selection' && (
        <CharacterSelection
          characters={characters}
          players={players}
          myPlayerId={myPlayerId}
          onSelectCharacter={selectSecretCharacter}
          selectedCharacter={selectedSecretCharacter}
          readyCount={readyCount}
        />
      )}
      
      {(gameState === 'playing' || gameState === 'finished') && (
        <BoardInline
          characters={characters}
          secretCharacter={secretCharacter}
          eliminatedCharacters={eliminatedCharacters}
          chatHistory={chatHistory}
          currentTurn={currentTurn}
          isMyTurn={isMyTurn}
          myPlayerId={myPlayerId}
          players={players}
          gameResult={gameResult}
          gameState={gameState}
          onAskQuestion={askQuestion}
          onAnswerQuestion={answerQuestion}
          onEliminateCharacter={eliminateCharacter}
          onMakeGuess={makeGuess}
          onBackToMenu={resetGame}
          onRestartGame={restartGame}
        />
      )}
    </div>
  );
}

export default App;
