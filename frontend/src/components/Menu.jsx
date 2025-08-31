import React, { useState, useEffect } from 'react';

const Menu = ({ onCreateGame, onJoinGame, error, setError }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger CSS animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen wood-texture menu-background flex flex-col items-center justify-center p-4">
      {/* Main Title Above the Card */}
      <div className="text-center mb-8">
        <h1 className="title-font text-7xl font-bold text-amber-100 drop-shadow-2xl mb-4">
          Guess Who?
        </h1>
        <p className="elegant-font text-2xl text-amber-200 drop-shadow-lg font-medium">
          Challenge a friend in the classic guessing game!
        </p>
      </div>
      
      <div className={`
        bg-amber-50/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full
        shadow-2xl border-8 border-amber-800
        transform transition-all duration-1000 ease-out game-board
        ${isAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
      `}>
        <div className="text-center mb-6">
          <h2 className="elegant-font text-2xl font-semibold text-amber-900 drop-shadow-sm">
            Game Setup
          </h2>
        </div>

        <form className="menu-form space-y-6">
          <div>
            <label className="body-font block text-amber-900 text-base font-bold mb-2 drop-shadow-sm">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="body-font w-full px-4 py-4 bg-amber-50 border-3 border-amber-700 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm font-medium character-slot"
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          {showJoinForm && (
            <div className="transition-all duration-300 ease-in-out">
              <label className="body-font block text-amber-900 text-base font-bold mb-2 drop-shadow-sm">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="body-font w-full px-4 py-4 bg-amber-50 border-3 border-amber-700 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm font-medium character-slot"
                placeholder="Enter 4-6 digit code"
                maxLength={6}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 text-red-800 text-sm text-center font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="menu-buttons space-y-3">
            {!showJoinForm ? (
              <>
                <button
                  type="submit"
                  onClick={handleCreateGame}
                  className="body-font elegant-button w-full bg-amber-700 hover:bg-amber-800 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-300 border-2 border-amber-900"
                >
                  Create Game
                </button>
                <button
                  type="button"
                  onClick={toggleJoinForm}
                  className="body-font elegant-button w-full bg-green-700 hover:bg-green-800 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 border-2 border-green-900"
                >
                  Join Game
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={handleJoinGame}
                  className="body-font elegant-button w-full bg-green-700 hover:bg-green-800 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 border-2 border-green-900"
                >
                  Join Room
                </button>
                <button
                  type="button"
                  onClick={toggleJoinForm}
                  className="body-font elegant-button w-full bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 border-2 border-gray-800"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 text-center text-amber-900 text-sm font-medium">
          <p className="body-font drop-shadow-sm high-contrast-text">Tip: Create a game to get a room code, or join with a friend's code!</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
