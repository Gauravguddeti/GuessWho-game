# 🎯 Who's That? - Online Multiplayer Game

A modern, web-based version of the classic guessing game built with React and Node.js. Play against friends in real-time with beautiful animations and responsive design.

🚀 **Live at:** https://whos-that-game.vercel.app

## ✨ Features

- **Real-time Multiplayer**: Play against friends using WebSocket connections
- **Beautiful UI**: Modern design with custom CSS and smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Room System**: Create or join games with simple 4-6 digit codes
- **Interactive Chat**: Ask questions and get yes/no answers in real-time
- **Character Elimination**: Click to eliminate characters with smooth flip animations
- **Win/Loss Detection**: Automatic game ending with celebration effects

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Running the Game

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```
   The server will run on http://localhost:3001

2. **Start the Frontend (in a new terminal)**:
   ```bash
   cd frontend
   npm start
   ```
   The game will open at http://localhost:3000

## 🎮 How to Play

1. **Create or Join a Game**:
   - Enter your name
   - Click "Create Game" to get a room code, or "Join Game" to enter a friend's code

2. **Game Setup**:
   - Wait for both players to join
   - Host clicks "Start Game" to begin

3. **Gameplay**:
   - Each player gets a secret character
   - Take turns asking yes/no questions about physical traits
   - Click on character cards to eliminate them (they'll flip over)
   - Use the chat system to communicate

4. **Winning**:
   - Click "Make Final Guess" when ready
   - Click on the character you think is your opponent's secret character
   - Win by guessing correctly, or lose if you guess wrong!

## 🏗️ Project Structure

```
GuessWho-game/
├── backend/                 # Node.js + Express + Socket.IO server
│   ├── server.js           # Main server file with game logic
│   ├── characters.js       # Character data and definitions
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── public/
│   │   ├── characters/     # Character images (PNG format)
│   │   ├── favicon.png     # Custom game favicon
│   │   └── index.html      # Main HTML template
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── App.js      # Main app component
│   │   │   ├── Menu.jsx    # Game menu and room creation
│   │   │   ├── Lobby.jsx   # Waiting room component
│   │   │   └── BoardInline.jsx # Main game board with inline styles
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🎨 Characters

The game includes 24 diverse characters with different:
- Genders and ages
- Skin tones
- Hair styles and colors
- Accessories (glasses, hats, jewelry)
- Clothing styles

*Note: Character images should be placed in the `/frontend/public/characters/` folder as PNG files.*

## 🛠️ Technical Details

### Backend
- **Node.js + Express**: RESTful API server
- **Socket.IO**: Real-time WebSocket communication
- **Room Management**: In-memory game state storage
- **Turn-based Logic**: Server-side validation

### Frontend
- **React 18**: Modern React with hooks and custom mobile detection
- **CSS-in-JS**: Inline styles with responsive breakpoints
- **Socket.IO Client**: Real-time communication
- **Custom Hooks**: Mobile detection and responsive design
- **Responsive Design**: Mobile-first approach with conditional styling

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Runs with hot reload
```

## 📝 Game Rules

1. Each player has a secret character
2. Players take turns asking yes/no questions
3. Questions should be about physical appearance (hair, clothing, accessories, etc.)
4. Use answers to eliminate characters that don't match
5. Make a final guess when you think you know the opponent's character
6. Guess correctly to win, or lose if you guess wrong!

## 🌟 Future Enhancements

- [ ] Add actual character illustrations
- [ ] Implement user accounts and game history
- [ ] Add spectator mode
- [ ] Create tournament brackets
- [ ] Add sound effects and music
- [ ] Implement AI opponents
- [ ] Add custom character sets

## 🤝 Contributing

Feel free to contribute to this project! Some areas that could use improvement:

- Character artwork (24 diverse illustrations needed)
- Additional animations and transitions
- Mobile UX improvements
- Performance optimizations
- Additional game modes

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Playing!

Have fun challenging your friends to see who can guess the secret character first! 🎯
