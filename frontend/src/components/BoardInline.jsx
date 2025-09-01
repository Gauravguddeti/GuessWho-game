import React, { useState, useRef, useEffect } from 'react';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

const BoardInline = ({
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
  onBackToMenu,
  onRestartGame
}) => {
  const [question, setQuestion] = useState('');
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const chatEndRef = useRef(null);
  
  // Initialize mobile detection first
  const isMobile = useIsMobile();

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  console.log('Board rendering with:', { 
    characters: characters?.length, 
    secretCharacter, 
    gameState, 
    isMyTurn,
    chatHistory: chatHistory?.length 
  });

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)',
    padding: '10px'
  };

  const headerStyle = {
    backgroundColor: '#F5DEB3',
    border: '4px solid #8B4513',
    borderRadius: '15px',
    padding: isMobile ? '12px' : '20px',
    marginBottom: '15px',
    textAlign: 'center',
    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
  };

  const titleStyle = {
    fontSize: isMobile ? '24px' : '32px',
    color: '#654321',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    fontFamily: 'Cinzel, Georgia, serif',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const gameInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: isMobile ? '14px' : '16px',
    color: '#333333',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '10px' : '0'
  };

  const turnIndicatorStyle = {
    padding: isMobile ? '6px 12px' : '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: isMobile ? '12px' : '14px'
  };

  const myTurnStyle = {
    ...turnIndicatorStyle,
    backgroundColor: '#00cc44',
    color: '#ffffff'
  };

  const theirTurnStyle = {
    ...turnIndicatorStyle,
    backgroundColor: '#ffcc00',
    color: '#000000'
  };

  const secretCharacterStyle = {
    backgroundColor: '#e6f3ff',
    border: '2px solid #0066cc',
    borderRadius: '8px',
    padding: isMobile ? '6px 10px' : '8px 12px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 'bold',
    color: '#0066cc'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1.2fr',
    gap: '15px',
    height: isMobile ? 'auto' : 'calc(100vh - 200px)'
  };

  const characterGridStyle = {
    backgroundColor: '#F5DEB3',
    border: '4px solid #8B4513',
    borderRadius: '15px',
    padding: isMobile ? '12px' : '20px',
    minHeight: isMobile ? 'auto' : 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(100px, 1fr))' : 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: isMobile ? '4px' : '8px',
    padding: isMobile ? '6px' : '8px',
    justifyContent: 'center',
    maxWidth: '100%',
    overflowY: 'auto'
  };

  const characterCardStyle = {
    backgroundColor: '#ffffff',
    border: '3px solid #8B4513',
    borderRadius: '12px',
    padding: isMobile ? '4px' : '6px',
    paddingBottom: isMobile ? '35px' : '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    position: 'relative',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
    background: 'linear-gradient(145deg, #ffffff, #f8f8f8)',
    transform: 'perspective(1000px) rotateX(0deg)',
    transformStyle: 'preserve-3d',
    minHeight: isMobile ? '160px' : '200px',
    maxHeight: isMobile ? '180px' : '220px'
  };

  const eliminatedCardStyle = {
    ...characterCardStyle,
    opacity: '0.3',
    backgroundColor: '#f0f0f0',
    borderColor: '#999999',
    cursor: 'not-allowed'
  };

  const characterImageStyle = {
    width: '100%',
    height: isMobile ? '100px' : '120px',
    borderRadius: '8px',
    marginBottom: '5px',
    border: '2px solid #ddd',
    objectFit: 'cover'
  };

  const characterNameStyle = {
    fontSize: isMobile ? '11px' : '13px',
    fontWeight: 'bold',
    color: '#2D1810',
    textAlign: 'center',
    marginTop: '5px',
    marginBottom: isMobile ? '6px' : '8px',
    lineHeight: '1.2',
    height: isMobile ? '16px' : '20px',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 5,
    fontFamily: 'Crimson Text, Georgia, serif',
    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
  };

  const sidebarStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: isMobile ? '300px' : 'none',
    marginTop: isMobile ? '10px' : '0'
  };

  const chatSectionStyle = {
    background: 'linear-gradient(145deg, #FFF8DC, #F5DEB3)',
    border: '4px solid #8B4513',
    borderRadius: '15px',
    padding: '18px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 2px 2px 8px rgba(255,255,255,0.3)',
    minHeight: isMobile ? '200px' : '350px'
  };

  const chatHeaderStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#654321',
    marginBottom: '12px',
    textAlign: 'center',
    fontFamily: 'Playfair Display, Georgia, serif',
    textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
    borderBottom: '2px solid #8B4513',
    paddingBottom: '8px'
  };

  const chatMessagesStyle = {
    flex: '1',
    border: '3px solid #8B4513',
    borderRadius: '12px',
    padding: '12px',
    background: 'linear-gradient(145deg, #FFFEF7, #FFF8DC)',
    maxHeight: isMobile ? '200px' : '280px',
    overflow: 'auto',
    marginBottom: '12px',
    boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.1), inset -2px -2px 6px rgba(255,255,255,0.8)'
  };

  const messageStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: isMobile ? '8px' : '12px',
    margin: '8px 0',
    fontSize: isMobile ? '12px' : '14px',
    fontFamily: 'Crimson Text, Georgia, serif',
    color: '#2D1810',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
  };

  const questionStyle = {
    ...messageStyle,
    background: 'linear-gradient(145deg, #e6f3ff, #cce7ff)',
    borderColor: '#1e40af',
    borderWidth: '3px',
    boxShadow: '0 4px 8px rgba(30, 64, 175, 0.2)'
  };

  const answerStyle = {
    ...messageStyle,
    background: 'linear-gradient(145deg, #f0fff0, #e6ffe6)',
    borderColor: '#16a34a',
    borderWidth: '3px',
    boxShadow: '0 4px 8px rgba(22, 163, 74, 0.2)'
  };
  
  const systemStyle = {
    ...messageStyle,
    background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
    borderColor: '#6b7280',
    borderWidth: '2px',
    fontStyle: 'italic',
    color: '#4b5563',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(107, 114, 128, 0.2)'
  };

  const controlsStyle = {
    background: 'linear-gradient(145deg, #FFF8DC, #F5DEB3)',
    border: '4px solid #8B4513',
    borderRadius: '15px',
    padding: isMobile ? '12px' : '18px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 2px 2px 8px rgba(255,255,255,0.3)',
    minHeight: isMobile ? 'auto' : '200px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '3px solid #8B4513',
    borderRadius: '10px',
    marginBottom: '12px',
    fontFamily: 'Crimson Text, Georgia, serif',
    backgroundColor: '#FFFEF7',
    color: '#2D1810',
    boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    minWidth: '100px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1e40af',
    color: '#ffffff',
    borderColor: '#1e3a8a',
    fontFamily: 'Crimson Text, Georgia, serif',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(30, 64, 175, 0.3)',
    transition: 'all 0.3s ease'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc2626',
    color: '#ffffff',
    borderColor: '#991b1b',
    fontFamily: 'Crimson Text, Georgia, serif',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
    transition: 'all 0.3s ease'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    borderColor: '#9ca3af',
    cursor: 'not-allowed',
    fontFamily: 'Crimson Text, Georgia, serif',
    borderRadius: '10px'
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    border: '3px solid #000000',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '400px',
    textAlign: 'center'
  };

  const handleAskQuestion = () => {
    if (question.trim() && isMyTurn) {
      onAskQuestion(question.trim());
      setQuestion('');
    }
  };

  const handleAnswerQuestion = (messageId, answer) => {
    onAnswerQuestion(messageId, answer);
  };

  const handleCharacterClick = (character) => {
    if (eliminatedCharacters.includes(character.id)) return;
    
    if (isMyTurn) {
      setSelectedCharacter(character);
      setShowGuessModal(true);
    }
  };

  const handleEliminate = () => {
    if (selectedCharacter) {
      onEliminateCharacter(selectedCharacter.id);
      setShowGuessModal(false);
      setSelectedCharacter(null);
    }
  };

  const handleGuess = () => {
    if (selectedCharacter) {
      onMakeGuess(selectedCharacter.id);
      setShowGuessModal(false);
      setSelectedCharacter(null);
    }
  };

  const currentPlayer = players.find(p => p.id === currentTurn);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Who's That? - Game Board</h1>
        <div style={gameInfoStyle}>
          <div>
            <span style={secretCharacterStyle}>
              🤫 Your Secret: {secretCharacter?.name}
            </span>
          </div>
          <div>
            <span style={{
              ...isMyTurn ? myTurnStyle : theirTurnStyle,
              animation: isMyTurn ? 'turnPulse 1.5s ease-in-out infinite' : 'none'
            }}>
              {isMyTurn ? '🟢 Your Turn' : `🟡 ${currentPlayer?.name || 'Opponent'}'s Turn`}
            </span>
          </div>
        </div>
      </div>

      <div style={mainContentStyle}>
        {/* Character Grid */}
        <div style={characterGridStyle}>
          <h3 style={{ fontSize: '24px', color: '#654321', marginBottom: '15px', textAlign: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            Characters ({characters?.length || 0}) - Flipped: {eliminatedCharacters?.length || 0}
          </h3>
          <div style={{ flex: 1, maxHeight: 'calc(100vh - 300px)' }}>
            <div style={gridStyle}>
            {characters?.map((character) => {
              const isEliminated = eliminatedCharacters.includes(character.id);
              return (
                <div
                  key={character.id}
                  style={isEliminated ? eliminatedCardStyle : characterCardStyle}
                  onMouseOver={(e) => {
                    if (!isEliminated) {
                      e.currentTarget.style.borderColor = isMyTurn ? '#1e40af' : '#d97706';
                      e.currentTarget.style.transform = 'scale(1.08) rotateX(5deg)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isEliminated) {
                      e.currentTarget.style.borderColor = '#8B4513';
                      e.currentTarget.style.transform = 'scale(1) rotateX(0deg)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
                    }
                  }}
                  onClick={() => handleCharacterClick(character)}
                >
                  <img
                    src={`/characters/${character.image}`}
                    alt={character.name}
                    style={characterImageStyle}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div style={characterNameStyle}>{character.name}</div>
                  
                  {/* Action Buttons - Always Active */}
                  {!isEliminated && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '4px',
                      zIndex: 10,
                      transition: 'all 0.3s ease'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEliminateCharacter(character.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: '#ff6600',
                          color: '#ffffff',
                          border: '2px solid #cc5500',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontFamily: 'Crimson Text, Georgia, serif',
                          textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#cc5500';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#ff6600';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                        }}
                      >
                        FLIP
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMakeGuess(character.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          border: '2px solid #991b1b',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontFamily: 'Crimson Text, Georgia, serif',
                          textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#991b1b';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                        }}
                      >
                        GUESS
                      </button>
                    </div>
                  )}
                  
                  {isEliminated && (
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      backgroundColor: 'rgba(255, 0, 0, 0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        fontSize: '48px',
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        transform: 'rotate(45deg)'
                      }}>
                        ✕
                      </div>
                      <div style={{
                        backgroundColor: '#cc0000',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        marginTop: '8px',
                        border: '2px solid #ffffff'
                      }}>
                        FLIPPED
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={sidebarStyle}>
          {/* Chat Section */}
          <div style={chatSectionStyle}>
            <div style={chatHeaderStyle}>💬 Game Chat</div>
            <div style={chatMessagesStyle}>
              {chatHistory?.map((message, index) => {
                let messageStyle = answerStyle;
                if (message.type === 'question') messageStyle = questionStyle;
                if (message.type === 'system') messageStyle = systemStyle;
                
                return (
                  <div
                    key={index}
                    style={messageStyle}
                  >
                    {message.type !== 'system' && (
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {message.playerName}:
                      </div>
                    )}
                    <div>{message.content}</div>
                    {message.type === 'question' && message.playerId !== myPlayerId && !message.answered && (
                      <div style={{ marginTop: '8px' }}>
                        <button
                          onClick={() => handleAnswerQuestion(message.id, 'yes')}
                          style={{
                            ...primaryButtonStyle,
                            padding: '5px 10px',
                            fontSize: '12px',
                            margin: '2px'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleAnswerQuestion(message.id, 'no')}
                          style={{
                            ...dangerButtonStyle,
                            padding: '5px 10px',
                            fontSize: '12px',
                            margin: '2px'
                          }}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Controls Section */}
          <div style={controlsStyle}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2D1810', marginBottom: '10px', fontFamily: 'Playfair Display, Georgia, serif' }}>
              🎮 Game Controls
            </div>
            
            {isMyTurn ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', fontFamily: 'Crimson Text, Georgia, serif', color: '#2D1810' }}>
                    Ask a Question:
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Does your character wear glasses?"
                    style={inputStyle}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={!question.trim()}
                    style={question.trim() ? primaryButtonStyle : disabledButtonStyle}
                  >
                    📤 Ask Question
                  </button>
                </div>
                
                <div style={{ 
                  background: 'linear-gradient(145deg, #fef3c7, #fed7aa)',
                  border: '3px solid #d97706',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#92400e',
                  marginBottom: '12px',
                  fontFamily: 'Crimson Text, Georgia, serif',
                  fontWeight: '600',
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)',
                  boxShadow: '0 4px 8px rgba(217, 119, 6, 0.2)'
                }}>
                  💡 Use the FLIP and GUESS buttons on each character card!
                </div>
              </>
            ) : (
              <div style={{
                background: 'linear-gradient(145deg, #fee2e2, #fecaca)',
                border: '3px solid #dc2626',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                color: '#991b1b',
                textAlign: 'center',
                fontFamily: 'Crimson Text, Georgia, serif',
                fontWeight: '600',
                textShadow: '1px 1px 1px rgba(255,255,255,0.8)',
                boxShadow: '0 4px 8px rgba(220, 38, 38, 0.2)'
              }}>
                ⏳ Waiting for {currentPlayer?.name || 'opponent'} to make their move...
              </div>
            )}

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                onClick={onBackToMenu}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#666666',
                  color: '#ffffff',
                  borderColor: '#444444'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#666666'}
              >
                ← Exit Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Character Action Modal */}
      {showGuessModal && selectedCharacter && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ fontSize: '20px', color: '#000000', marginBottom: '15px' }}>
              Character: {selectedCharacter.name}
            </h3>
            <img
              src={`/characters/${selectedCharacter.image}`}
              alt={selectedCharacter.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '2px solid #cccccc'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <p style={{ fontSize: '14px', color: '#333333', marginBottom: '20px' }}>
              What would you like to do with this character?
            </p>
            <div>
              <button
                onClick={handleEliminate}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#ff6600',
                  color: '#ffffff',
                  borderColor: '#cc5500',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#cc5500'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff6600'}
              >
                🔄 FLIP
              </button>
              <button
                onClick={handleGuess}
                style={{
                  ...dangerButtonStyle,
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#990000'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#cc0000'}
              >
                🎯 Final Guess
              </button>
              <button
                onClick={() => {
                  setShowGuessModal(false);
                  setSelectedCharacter(null);
                }}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#666666',
                  color: '#ffffff',
                  borderColor: '#444444'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#666666'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Result Modal */}
      {gameResult && gameState === 'finished' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '28px', color: '#000000', marginBottom: '20px' }}>
              🎉 Game Over!
            </h2>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>
              {gameResult.winner === myPlayerId ? (
                <div style={{ color: '#00cc44' }}>
                  🏆 You Won! 
                  {gameResult.isCorreectGuess ? ' Correct guess!' : ' Opponent disconnected.'}
                </div>
              ) : (
                <div style={{ color: '#cc0000' }}>
                  😔 You Lost. 
                  {gameResult.isCorreectGuess ? ` ${gameResult.winnerName} guessed correctly!` : ''}
                </div>
              )}
            </div>
            <div>
              <button
                onClick={onRestartGame}
                style={{
                  ...primaryButtonStyle,
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#004499'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
              >
                🔄 Play Again
              </button>
              <button
                onClick={onBackToMenu}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#666666',
                  color: '#ffffff',
                  borderColor: '#444444'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#444444'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#666666'}
              >
                🏠 Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardInline;
