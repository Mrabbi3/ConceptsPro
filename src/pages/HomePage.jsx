import React from 'react';

const HomePage = ({ setCurrentPage, setChatOpen }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">Welcome to ConceptsPro</h1>
          <p className="text-2xl text-gray-600 mb-8">Master Computer Science Through Interactive Visuals</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => setCurrentPage('directory')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
              Start Learning
            </button>
            <button onClick={() => setChatOpen(true)} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg">
              Talk to AI Assistant
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div 
            onClick={() => setCurrentPage('directory')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105"
          >
            <div className="text-5xl mb-4">📡</div>
            <h3 className="text-xl font-bold mb-2">Data Communication Framework</h3>
            <p className="text-gray-600">Interactive frameworks for encryption, encoding, modulation & multiplexing</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition opacity-50">
            <div className="text-5xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">Computer Science</h3>
            <p className="text-gray-600">Coming Soon</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition opacity-50">
            <div className="text-5xl mb-4">🔢</div>
            <h3 className="text-xl font-bold mb-2">Mathematics</h3>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Why ConceptsPro?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex space-x-3">
              <div className="text-blue-600 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Interactive Visualizations</h4>
                <p className="text-gray-600">Watch animated frameworks in action</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="text-blue-600 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold mb-1">AI-Powered Assistant</h4>
                <p className="text-gray-600">Get instant help navigating to any concept</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="text-blue-600 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Track Your Progress</h4>
                <p className="text-gray-600">Monitor your learning journey</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="text-blue-600 text-2xl">✓</div>
              <div>
                <h4 className="font-semibold mb-1">100% Free</h4>
                <p className="text-gray-600">All content available at no cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
