const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Allow multiple origins for production
const allowedOrigins = [
  "http://localhost:3000",
  "https://whos-that-game.vercel.app",
  /https:\/\/.*\.vercel\.app$/,  // Allow all Vercel preview deployments
  process.env.FRONTEND_URL
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Basic route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
  res.json({ message: 'Who\'s That? Game Server Running', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', rooms: Object.keys(gameRooms).length });
});

// Game state storage
const gameRooms = {};

// Character data - all 24 characters with proper names and gender
const characters = [
  { id: 1, name: "Amara", description: "Young woman, dark skin, curly hair, red shirt", image: "character1.png", gender: "female" },
  { id: 2, name: "Harold", description: "Elderly man, bald, glasses, blue sweater", image: "character2.png", gender: "male" },
  { id: 3, name: "Tommy", description: "Teen boy, light skin, freckles, baseball cap", image: "character3.png", gender: "male" },
  { id: 4, name: "Linda", description: "Middle-aged woman, blonde hair, green dress", image: "character4.png", gender: "female" },
  { id: 5, name: "Raj", description: "Man with beard, turban, yellow shirt", image: "character5.png", gender: "male" },
  { id: 6, name: "Fatima", description: "Woman with hijab, purple clothing", image: "character6.png", gender: "female" },
  { id: 7, name: "Kenji", description: "Asian man, short black hair, gray hoodie", image: "character7.png", gender: "male" },
  { id: 8, name: "Zoe", description: "Woman with pink dyed hair, nose ring, denim jacket", image: "character8.png", gender: "female" },
  { id: 9, name: "Tex", description: "Man with mustache, cowboy hat, plaid shirt", image: "character9.png", gender: "male" },
  { id: 10, name: "Maya", description: "Woman with braids, hoop earrings, orange blouse", image: "character10.png", gender: "female" },
  { id: 11, name: "Marcus", description: "Man with afro, sunglasses, leather jacket", image: "character11.png", gender: "male" },
  { id: 12, name: "Eleanor", description: "Elderly woman, white hair bun, floral dress", image: "character12.png", gender: "female" },
  { id: 13, name: "Sophie", description: "Young girl, ponytail, striped shirt", image: "character13.png", gender: "female" },
  { id: 14, name: "Rex", description: "Man with buzzcut, tattoo on neck, black t-shirt", image: "character14.png", gender: "male" },
  { id: 15, name: "Claire", description: "Woman with short bob haircut, glasses, cardigan", image: "character15.png", gender: "female" },
  { id: 16, name: "DJ", description: "Man with spiky hair, headphones around neck", image: "character16.png", gender: "male" },
  { id: 17, name: "River", description: "Person with green hair, piercings, hoodie", image: "character17.png", gender: "neutral" },
  { id: 18, name: "Aurora", description: "Woman with hat, scarf, and coat", image: "character18.png", gender: "female" },
  { id: 19, name: "Jamal", description: "Man with dreadlocks, casual t-shirt", image: "character19.png", gender: "male" },
  { id: 20, name: "Blake", description: "Young man, messy blonde hair, hoodie", image: "character20.png", gender: "male" },
  { id: 21, name: "Victoria", description: "Woman with long straight hair, red lipstick, formal blouse", image: "character21.png", gender: "female" },
  { id: 22, name: "Bear", description: "Man with long beard, beanie, casual jacket", image: "character22.png", gender: "male" },
  { id: 23, name: "Sunny", description: "Woman with curly short hair, yellow dress", image: "character23.png", gender: "female" },
  { id: 24, name: "Oliver", description: "Man with medium-length hair, suit and tie", image: "character24.png", gender: "male" }
];

// Generate a random 4-6 digit room code
function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 900000).toString();
}

// Initialize a new game room
function createGameRoom(roomCode, hostId, hostName) {
  return {
    roomCode,
    players: {
      [hostId]: {
        id: hostId,
        name: hostName,
        isHost: true,
        secretCharacter: null,
        eliminatedCharacters: [],
        isReady: false
      }
    },
    gameState: 'lobby', // lobby, playing, finished
    currentTurn: null,
    winner: null,
    chatHistory: []
  };
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new game room
  socket.on('createGame', (playerName) => {
    const roomCode = generateRoomCode();
    const room = createGameRoom(roomCode, socket.id, playerName);
    gameRooms[roomCode] = room;
    
    socket.join(roomCode);
    socket.emit('gameCreated', { roomCode, playerName });
    console.log(`Game created: ${roomCode} by ${playerName}`);
  });

  // Join an existing game room
  socket.on('joinGame', ({ roomCode, playerName }) => {
    console.log(`Join attempt: ${playerName} trying to join ${roomCode}`);
    const room = gameRooms[roomCode];
    
    if (!room) {
      console.log(`Join failed: Room ${roomCode} not found`);
      socket.emit('joinError', 'Room not found');
      return;
    }

    if (Object.keys(room.players).length >= 2) {
      console.log(`Join failed: Room ${roomCode} is full`);
      socket.emit('joinError', 'Room is full');
      return;
    }

    room.players[socket.id] = {
      id: socket.id,
      name: playerName,
      isHost: false,
      secretCharacter: null,
      eliminatedCharacters: [],
      isReady: false
    };

    socket.join(roomCode);
    socket.emit('gameJoined', { roomCode, playerName });
    
    // Notify all players in the room
    const playersArray = Object.values(room.players);
    console.log(`Player joined successfully. Room ${roomCode} now has ${playersArray.length} players:`, playersArray.map(p => p.name));
    
    io.to(roomCode).emit('playerJoined', {
      players: playersArray
    });

    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Start secret character selection phase
  socket.on('startGame', (roomCode) => {
    const room = gameRooms[roomCode];
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    const players = Object.values(room.players);
    if (players.length !== 2) {
      socket.emit('error', 'Need exactly 2 players to start');
      return;
    }

    // Start character selection phase
    room.gameState = 'character_selection';
    
    // Send all characters to players for selection
    io.to(roomCode).emit('characterSelectionStarted', {
      characters,
      players: Object.values(room.players)
    });

    console.log(`Character selection started in room ${roomCode}`);
  });
  
  // Handle secret character selection
  socket.on('selectSecretCharacter', ({ roomCode, characterId }) => {
    const room = gameRooms[roomCode];
    
    if (!room || room.gameState !== 'character_selection') {
      socket.emit('error', 'Invalid game state for character selection');
      return;
    }
    
    const player = room.players[socket.id];
    if (!player) {
      socket.emit('error', 'Player not found');
      return;
    }
    
    // Find the character
    const character = characters.find(char => char.id === characterId);
    if (!character) {
      socket.emit('error', 'Character not found');
      return;
    }
    
    // Set the secret character for this player
    player.secretCharacter = character;
    player.isReady = true;
    
    // Notify the player
    socket.emit('secretCharacterSelected', { character });
    
    // Check if both players have selected their characters
    const players = Object.values(room.players);
    const readyPlayers = players.filter(p => p.isReady && p.secretCharacter);
    
    if (readyPlayers.length === 2) {
      // Both players ready, start the actual game
      room.gameState = 'playing';
      
      // Randomly assign first player
      const playerIds = Object.keys(room.players);
      const firstPlayerIndex = Math.floor(Math.random() * 2);
      room.currentTurn = playerIds[firstPlayerIndex];
      
      // Send game start event to all players
      playerIds.forEach(playerId => {
        io.to(playerId).emit('gameStarted', {
          characters,
          secretCharacter: room.players[playerId].secretCharacter,
          currentTurn: room.currentTurn,
          players: Object.values(room.players)
        });
      });
      
      console.log(`Game started in room ${roomCode}, first turn: ${room.players[room.currentTurn].name}`);
    } else {
      // Notify all players about selection progress
      io.to(roomCode).emit('characterSelectionUpdate', {
        readyCount: readyPlayers.length,
        totalPlayers: players.length
      });
    }
  });

  // Handle questions
  socket.on('askQuestion', ({ roomCode, question }) => {
    const room = gameRooms[roomCode];
    
    if (!room || room.currentTurn !== socket.id) {
      socket.emit('error', 'Not your turn');
      return;
    }

    const message = {
      id: uuidv4(),
      playerId: socket.id,
      playerName: room.players[socket.id].name,
      type: 'question',
      content: question,
      timestamp: new Date().toISOString()
    };

    room.chatHistory.push(message);
    
    // Send to all players in room
    io.to(roomCode).emit('questionAsked', message);
  });

  // Handle answers
  socket.on('answerQuestion', ({ roomCode, messageId, answer }) => {
    const room = gameRooms[roomCode];
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    // Find the question message
    const questionMessage = room.chatHistory.find(msg => msg.id === messageId);
    if (!questionMessage) {
      socket.emit('error', 'Question not found');
      return;
    }

    // Create answer message
    const answerMessage = {
      id: uuidv4(),
      playerId: socket.id,
      playerName: room.players[socket.id].name,
      type: 'answer',
      content: answer,
      questionId: messageId,
      timestamp: new Date().toISOString()
    };

    room.chatHistory.push(answerMessage);

    // Switch turns
    const playerIds = Object.keys(room.players);
    room.currentTurn = playerIds.find(id => id !== room.currentTurn);

    // Send to all players in room
    io.to(roomCode).emit('answerGiven', {
      answer: answerMessage,
      currentTurn: room.currentTurn
    });
  });

  // Handle character elimination
  socket.on('eliminateCharacter', ({ roomCode, characterId }) => {
    const room = gameRooms[roomCode];
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    const player = room.players[socket.id];
    if (!player.eliminatedCharacters.includes(characterId)) {
      player.eliminatedCharacters.push(characterId);
    } else {
      // Remove from eliminated if clicking again (toggle)
      player.eliminatedCharacters = player.eliminatedCharacters.filter(id => id !== characterId);
    }

    // Switch turns after flipping a character
    const playerIds = Object.keys(room.players);
    room.currentTurn = playerIds.find(id => id !== room.currentTurn);

    // Notify the player about their board state update
    socket.emit('characterEliminated', {
      characterId,
      eliminatedCharacters: player.eliminatedCharacters
    });
    
    // Notify all players about the turn change
    io.to(roomCode).emit('turnChanged', {
      currentTurn: room.currentTurn,
      action: 'flip',
      actionPlayer: room.players[socket.id].name,
      characterFlipped: characters.find(char => char.id === characterId)?.name
    });
  });

  // Handle final guess
  socket.on('makeGuess', ({ roomCode, characterId }) => {
    const room = gameRooms[roomCode];
    
    if (!room || room.currentTurn !== socket.id) {
      socket.emit('error', 'Not your turn or room not found');
      return;
    }

    const playerIds = Object.keys(room.players);
    const opponentId = playerIds.find(id => id !== socket.id);
    const opponentSecretCharacter = room.players[opponentId].secretCharacter;

    // Check if guess is correct
    const isCorrect = characterId === opponentSecretCharacter.id;
    
    room.gameState = 'finished';
    room.winner = isCorrect ? socket.id : opponentId;

    // Send game result to all players
    io.to(roomCode).emit('gameEnded', {
      winner: room.winner,
      winnerId: room.winner,
      winnerName: room.players[room.winner].name,
      guessedCharacter: characters.find(char => char.id === characterId),
      correctCharacter: opponentSecretCharacter,
      isCorrectGuess: isCorrect
    });

    console.log(`Game ended in room ${roomCode}. Winner: ${room.players[room.winner].name}`);
  });

  // Handle keep-alive ping
  socket.on('ping', () => {
    socket.emit('pong');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up any rooms this player was in
    Object.keys(gameRooms).forEach(roomCode => {
      const room = gameRooms[roomCode];
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        
        // If room becomes empty, delete it
        if (Object.keys(room.players).length === 0) {
          delete gameRooms[roomCode];
        } else {
          // Notify remaining player that opponent disconnected
          io.to(roomCode).emit('playerDisconnected', {
            disconnectedPlayer: socket.id,
            remainingPlayers: Object.values(room.players)
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
