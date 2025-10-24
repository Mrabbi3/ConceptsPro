import React from 'react';
import { MessageSquare, X } from 'lucide-react';

const ChatBot = ({ 
  chatOpen, 
  setChatOpen, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleChat 
}) => {
  return (
    <>
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition z-50">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px', maxHeight: 'calc(100vh-2rem)' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Hi! I'm your learning assistant.</p>
                <p className="text-sm mt-2">Ask me about any framework!</p>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && handleChat(chatInput)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => chatInput.trim() && handleChat(chatInput)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
