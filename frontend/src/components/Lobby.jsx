import React, { useEffect, useState } from 'react';

const Lobby = ({ roomCode, players, isHost, onStartGame, onBackToMenu }) => {
  const [, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger CSS animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const canStart = players.length === 2;

  return (
    <div className="min-h-screen wood-texture menu-background flex items-center justify-center p-4">
      <div className="lobby-container bg-amber-50/95 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-8 border-amber-800 game-board backdrop-blur-sm">
        <div className="lobby-header text-center mb-8">
          <h1 className="title-font text-5xl font-bold text-amber-900 mb-4 drop-shadow-2xl">
            Game Lobby
          </h1>
          <div className="room-code-display bg-amber-100 rounded-2xl p-6 mb-6 border-4 border-amber-700 character-slot">
            <p className="body-font text-amber-900 text-base mb-2 font-bold drop-shadow-sm">Room Code</p>
            <p className="title-font text-5xl font-bold text-amber-900 tracking-wider drop-shadow-lg">
              {roomCode}
            </p>
            <p className="body-font text-amber-800 text-base mt-2 font-semibold drop-shadow-sm">
              Share this code with your friend to join!
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="elegant-font text-3xl font-semibold text-amber-900 mb-4 text-center drop-shadow-lg">
            Players ({players.length}/2)
          </h2>
          
          <div className="space-y-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="player-card bg-amber-50 rounded-xl p-4 border-4 border-amber-700 flex items-center justify-between shadow-lg character-slot"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="body-font text-amber-900 font-bold text-xl drop-shadow-sm">
                      {player.name}
                      {player.isHost && (
                        <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold border-2 border-yellow-600 shadow-sm">
                          Host
                        </span>
                      )}
                    </p>
                    <p className="body-font text-amber-700 text-base font-semibold">
                      {index === 0 ? 'Player 1' : 'Player 2'}
                    </p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            ))}

          {/* Empty slot for second player */}
            {players.length === 1 && (
              <div className="player-card bg-amber-100 rounded-xl p-4 border-2 border-dashed border-amber-400 flex items-center justify-center character-slot">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-amber-700 rounded-full mx-auto mb-2 animate-spin"></div>
                  <p className="body-font text-amber-800 font-semibold">Waiting for player 2...</p>
                  <p className="body-font text-amber-600 text-sm">Share the room code above</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isHost && canStart && (
            <button
              onClick={onStartGame}
              className="body-font elegant-button w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 border-2 border-green-800"
            >
              Start Game
            </button>
          )}

          {isHost && !canStart && (
            <div className="body-font w-full bg-amber-100 text-amber-800 py-4 px-6 rounded-xl font-semibold text-lg text-center border-2 border-amber-600 character-slot">
              Waiting for second player...
            </div>
          )}

          {!isHost && (
            <div className="body-font w-full bg-blue-100 text-blue-800 py-4 px-6 rounded-xl font-semibold text-lg text-center border-2 border-blue-600 character-slot">
              {canStart ? 'Waiting for host to start...' : 'Waiting for another player...'}
            </div>
          )}

          <button
            onClick={onBackToMenu}
            className="body-font elegant-button w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl btn-hover-lift transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 border-2 border-gray-800"
          >
            ← Back to Menu
          </button>
        </div>

        <div className="mt-6 text-center text-amber-700 text-sm">
          <p className="body-font font-medium drop-shadow-sm">💡 Once both players join, the host can start the game!</p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
