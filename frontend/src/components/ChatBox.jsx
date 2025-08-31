import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ChatBox = ({ 
  chatHistory, 
  onAskQuestion, 
  onAnswerQuestion, 
  isMyTurn, 
  myPlayerId 
}) => {
  const [question, setQuestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    // Animate chat entrance
    gsap.from('.chat-container', {
      duration: 0.6,
      y: 100,
      opacity: 0,
      ease: 'power2.out'
    });
  }, []);

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (question.trim() && isMyTurn) {
      onAskQuestion(question.trim());
      setQuestion('');
    }
  };

  const handleAnswer = (messageId, answer) => {
    onAnswerQuestion(messageId, answer);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Animate expansion
    if (!isExpanded) {
      gsap.to('.chat-messages', {
        duration: 0.3,
        height: 'auto',
        maxHeight: '300px',
        ease: 'power2.out'
      });
    } else {
      gsap.to('.chat-messages', {
        duration: 0.3,
        height: '60px',
        maxHeight: '60px',
        ease: 'power2.out'
      });
    }
  };

  const pendingQuestion = chatHistory.find(msg => 
    msg.type === 'question' && 
    msg.playerId !== myPlayerId &&
    !chatHistory.find(answer => answer.type === 'answer' && answer.questionId === msg.id)
  );

  return (
    <div className="chat-container fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-300 z-50">
      {/* Chat Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-semibold text-gray-800">💬 Game Chat</h3>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          {isExpanded ? '🔽' : '🔼'}
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesRef}
        className={`chat-messages overflow-y-auto p-3 space-y-2 transition-all duration-300 ${
          isExpanded ? 'max-h-60' : 'max-h-16'
        }`}
      >
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <p>No messages yet. Start asking questions!</p>
          </div>
        ) : (
          chatHistory.map((message) => (
            <div
              key={message.id}
              className={`speech-bubble max-w-xs ${
                message.playerId === myPlayerId ? 'own-message ml-auto' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold opacity-75">
                  {message.playerName}
                </span>
                <span className="text-xs opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <p className="text-sm">
                {message.type === 'question' ? '❓ ' : '💬 '}
                {message.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Answer Pending Question */}
      {pendingQuestion && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>{pendingQuestion.playerName}</strong> asked:
          </p>
          <p className="text-sm font-medium mb-3">"{pendingQuestion.content}"</p>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAnswer(pendingQuestion.id, 'Yes')}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              ✅ Yes
            </button>
            <button
              onClick={() => handleAnswer(pendingQuestion.id, 'No')}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              ❌ No
            </button>
          </div>
        </div>
      )}

      {/* Question Input */}
      {isMyTurn && !pendingQuestion && (
        <form onSubmit={handleSendQuestion} className="p-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a yes/no question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ask questions about physical traits, clothing, accessories, etc.
          </p>
        </form>
      )}

      {/* Turn Indicator */}
      {!isMyTurn && !pendingQuestion && (
        <div className="p-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {pendingQuestion ? 'Answer the question above' : "Opponent's turn..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
