import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import ChatBox from './ChatBox';

const Board = ({
  characters,
  secretCharacter,
  eliminatedCharacters,
  chatHistory,
  currentTurn,
  isMyTurn,
  myPlayerId,
  players,
  gameResult,
  gameState,
  onAskQuestion,
  onAnswerQuestion,
  onEliminateCharacter,
  onMakeGuess,
  onBackToMenu
}) => {
  const [isGuessMode, setIsGuessMode] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger CSS animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show game result
    if (gameResult && !showResult) {
      setShowResult(true);
    }
  }, [gameResult, showResult]);

  const handleCardClick = (characterId) => {
    if (isGuessMode) {
      // Making final guess
      onMakeGuess(characterId);
      setIsGuessMode(false);
    } else {
      // Toggle elimination
      onEliminateCharacter(characterId);
    }
  };

  const toggleGuessMode = () => {
    setIsGuessMode(!isGuessMode);
  };

  const getPlayerByTurn = () => {
    return players.find(p => p.id === currentTurn);
  };

  const opponent = players.find(p => p.id !== myPlayerId);
  const currentPlayer = getPlayerByTurn();

  return (
    <div className="min-h-screen p-4">
      <div className="board-container max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="board-header mb-6">
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Who's That?</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">
                    🎮 Playing
                  </span>
                  <span className={`px-3 py-1 rounded-full font-bold ${
                    isMyTurn ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {isMyTurn ? '✨ Your Turn' : `⏳ ${currentPlayer?.name}'s Turn`}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Secret Character Display */}
                {secretCharacter && (
                  <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-700 mb-1 font-bold">Your Secret Character</p>
                    <p className="text-sm font-bold text-green-800">
                      #{secretCharacter.id} - {secretCharacter.name.split(',')[0]}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={toggleGuessMode}
                    disabled={!isMyTurn || gameState === 'finished'}
                    className={`w-full px-4 py-2 rounded-lg font-bold transition-all ${
                      isGuessMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isGuessMode ? '❌ Cancel Guess' : '🎯 Make Final Guess'}
                  </button>
                  
                  <button
                    onClick={onBackToMenu}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
                  >
                    🚪 Leave Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="character-grid">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {characters.map((character) => (
                <Card
                  key={character.id}
                  character={character}
                  isEliminated={eliminatedCharacters.includes(character.id)}
                  isGuessMode={isGuessMode}
                  isSecret={secretCharacter?.id === character.id}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Guess Mode Indicator */}
        {isGuessMode && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-pulse z-40">
            🎯 Click on a character to make your final guess!
          </div>
        )}

        {/* Player Info */}
        <div className="mt-6">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-bold">You</p>
                <p className="font-bold text-gray-800">{players.find(p => p.id === myPlayerId)?.name}</p>
                <p className="text-xs text-gray-600 font-medium">
                  Eliminated: {eliminatedCharacters.length}/24
                </p>
              </div>
              
              <div className="text-2xl">⚔️</div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 font-bold">Opponent</p>
                <p className="font-bold text-gray-800">{opponent?.name || 'Waiting...'}</p>
                <p className="text-xs text-gray-600 font-medium">
                  Secret Character: ???
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <ChatBox
        chatHistory={chatHistory}
        onAskQuestion={onAskQuestion}
        onAnswerQuestion={onAnswerQuestion}
        isMyTurn={isMyTurn}
        myPlayerId={myPlayerId}
      />

      {/* Game Result Modal */}
      {showResult && gameResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={resultRef}
            className="result-modal bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            <div className="mb-6">
              {gameResult.winner === myPlayerId ? (
                <div>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">You Won!</h2>
                  <p className="text-gray-600">
                    {gameResult.disconnection 
                      ? 'Your opponent disconnected' 
                      : `Congratulations! You correctly guessed their character.`
                    }
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">😞</div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">You Lost!</h2>
                  <p className="text-gray-600">
                    {gameResult.disconnection 
                      ? 'You disconnected from the game' 
                      : `${gameResult.winnerName} guessed correctly!`
                    }
                  </p>
                </div>
              )}
            </div>

            {gameResult.correctCharacter && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">The secret character was:</p>
                <p className="font-semibold text-gray-800">
                  #{gameResult.correctCharacter.id} - {gameResult.correctCharacter.name}
                </p>
                {gameResult.guessedCharacter && !gameResult.isCorrectGuess && (
                  <p className="text-sm text-red-600 mt-2">
                    You guessed: #{gameResult.guessedCharacter.id} - {gameResult.guessedCharacter.name}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={onBackToMenu}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
