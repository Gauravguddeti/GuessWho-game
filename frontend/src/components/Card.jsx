import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Card = ({ character, isEliminated, isGuessMode, onClick, isSecret }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // Animate card entrance
    gsap.from(cardRef.current, {
      duration: 0.6,
      scale: 0,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: Math.random() * 0.5
    });
  }, []);

  useEffect(() => {
    // Animate card flip when eliminated
    if (cardRef.current) {
      if (isEliminated) {
        gsap.to(cardRef.current, {
          duration: 0.5,
          rotateY: 180,
          opacity: 0.3,
          ease: 'power2.inOut'
        });
      } else {
        gsap.to(cardRef.current, {
          duration: 0.5,
          rotateY: 0,
          opacity: 1,
          ease: 'power2.inOut'
        });
      }
    }
  }, [isEliminated]);

  const handleClick = () => {
    if (onClick) {
      // Add click animation
      gsap.to(cardRef.current, {
        duration: 0.1,
        scale: 0.95,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
      onClick(character.id);
    }
  };

  const handleMouseEnter = () => {
    if (!isEliminated) {
      gsap.to(cardRef.current, {
        duration: 0.2,
        scale: 1.05,
        y: -5,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isEliminated) {
      gsap.to(cardRef.current, {
        duration: 0.2,
        scale: 1,
        y: 0,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        character-card relative w-full aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-2xl
        ${isEliminated ? 'flipped transform rotateY-180 opacity-70' : ''}
        ${isGuessMode ? 'ring-4 ring-yellow-400 ring-opacity-90 shadow-yellow-300/50' : ''}
        ${isSecret ? 'ring-4 ring-green-400 shadow-green-300/50' : ''}
        transition-all duration-500 ease-in-out transform-gpu
        border-4 border-amber-800 bg-gradient-to-br from-amber-50 to-amber-100
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Character Image */}
      <div className="w-full h-full relative overflow-hidden bg-white">
        <img 
          src={`/characters/character${character.id}.png`}
          alt={character.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-2 absolute inset-0" style={{display: 'none'}}>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white font-bold text-lg md:text-xl">
              {character.name.split(' ')[0].charAt(0)}
            </span>
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
              {character.name.length > 30 
                ? character.name.substring(0, 30) + '...'
                : character.name
              }
            </p>
          </div>
        </div>
        
        {/* Character Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/90 via-amber-800/70 to-transparent text-white p-2">
          <p className="text-sm font-bold text-center truncate drop-shadow-lg">
            {character.name}
          </p>
        </div>
      </div>

      {/* Flipped Overlay */}
      {isEliminated && (
        <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
          <div className="relative">
            <div className="text-red-800 text-6xl font-bold transform rotate-45">✕</div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-2 text-center shadow-lg">
              FLIPPED
            </div>
          </div>
        </div>
      )}

      {/* Secret Character Indicator */}
      {isSecret && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            YOUR CHARACTER
          </div>
        </div>
      )}

      {/* Guess Mode Indicator */}
      {isGuessMode && !isEliminated && (
        <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
            CLICK TO GUESS
          </div>
        </div>
      )}

      {/* Card Number */}
      <div className="absolute top-1 left-1 bg-black/30 text-white text-xs px-1 rounded">
        #{character.id}
      </div>
    </div>
  );
};

export default Card;
