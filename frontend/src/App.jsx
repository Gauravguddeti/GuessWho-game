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

  // Initialize socket connection
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('gameCreated', ({ roomCode, playerName }) => {
      setRoomCode(roomCode);
      setPlayerName(playerName);
      setGameState('lobby');
      setIsHost(true);
      setError('');
    });

    newSocket.on('gameJoined', ({ roomCode, playerName }) => {
      setRoomCode(roomCode);
      setPlayerName(playerName);
      setGameState('lobby');
      setIsHost(false);
      setError('');
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
    });

    return () => {
      newSocket.close();
    };
  }, [playerName]); // Add playerName to dependencies

  const createGame = (name) => {
    setPlayerName(name);
    socket.emit('createGame', name);
  };

  const joinGame = (name, code) => {
    setPlayerName(name);
    socket.emit('joinGame', { roomCode: code, playerName: name });
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
