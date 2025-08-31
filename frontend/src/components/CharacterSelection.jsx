import React, { useState, useEffect } from 'react';

const CharacterSelection = ({ 
  characters, 
  players, 
  myPlayerId,
  onSelectCharacter,
  selectedCharacter,
  readyCount
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const currentPlayer = players.find(p => p.id === myPlayerId);
  const hasSelected = !!selectedCharacter;

  return (
    <div className="min-h-screen wood-texture menu-background flex items-center justify-center p-4">
      <div className={`
        bg-amber-50/95 backdrop-blur-sm rounded-3xl p-8 max-w-6xl w-full
        shadow-2xl border-8 border-amber-800 game-board
        transform transition-all duration-1000 ease-out
        ${isAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
      `}>
        <div className="text-center mb-8">
          <h1 className="title-font text-6xl font-bold mb-4 text-amber-100 drop-shadow-2xl">
            Choose Your Secret Character
          </h1>
          <p className="elegant-font text-amber-200 text-xl font-medium drop-shadow-lg mb-4">
            Select the character your opponent must guess!
          </p>
          
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="bg-amber-100 border-3 border-amber-700 rounded-xl px-6 py-3 character-slot">
              <span className="body-font text-amber-900 font-bold text-lg">
                Players Ready: {readyCount}/2
              </span>
            </div>
            {hasSelected && (
              <div className="bg-green-100 border-3 border-green-700 rounded-xl px-6 py-3 character-slot">
                <span className="body-font text-green-800 font-bold text-lg">
                  ✓ Character Selected!
                </span>
              </div>
            )}
          </div>
        </div>

        {hasSelected ? (
          <div className="text-center">
            <div className="mb-8">
              <h3 className="elegant-font text-3xl font-bold text-amber-900 mb-4 drop-shadow-lg">Your Secret Character:</h3>
              <div className="inline-block character-slot rounded-xl p-6 border-4 border-green-600 bg-green-50">
                <img 
                  src={`/characters/${selectedCharacter.image}`}
                  alt={selectedCharacter.name}
                  className="w-32 h-32 rounded-xl object-cover border-2 border-green-400 mb-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <p className="body-font text-2xl font-bold text-green-800 drop-shadow-sm">{selectedCharacter.name}</p>
              </div>
            </div>
            <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 text-blue-800">
              <p className="font-semibold">Waiting for other player to select their character...</p>
            </div>
          </div>
        ) : (
          <div className="character-grid">
            <h3 className="elegant-font text-2xl font-bold text-amber-900 text-center mb-6 drop-shadow-lg">
              Click on a character to select them as your secret:
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="character-slot rounded-xl p-3 cursor-pointer transform transition-all duration-300 hover:scale-105 btn-hover-lift border-4 border-amber-700 bg-amber-50"
                  onClick={() => onSelectCharacter(character.id)}
                >
                  <img 
                    src={`/characters/${character.image}`}
                    alt={character.name}
                    className="w-full aspect-square rounded-lg object-cover border-2 border-amber-600 mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="body-font text-base font-bold text-amber-900 text-center truncate drop-shadow-sm">
                    {character.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
