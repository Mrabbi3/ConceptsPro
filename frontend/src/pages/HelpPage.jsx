import React from 'react';

const HelpPage = ({ dataCommunicationFramework }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Help & Guide</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
            <ol className="space-y-3 list-decimal list-inside text-gray-700">
              <li>Navigate to the <strong>Directory</strong> to see all Data Communication Frameworks</li>
              <li>Click on any framework to see interactive visualizations</li>
              <li>Click <strong>Start Animation</strong> to watch the framework in action</li>
              <li>Mark frameworks as complete using the checkbox</li>
              <li>Take notes in the <strong>Notepad</strong> section</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Using the AI Assistant</h2>
            <p className="text-gray-700 mb-3">Our AI chatbot helps you navigate directly to any framework. Click the chat icon and ask:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="bg-blue-50 p-3 rounded">"Show me encryption"</li>
              <li className="bg-blue-50 p-3 rounded">"I want to learn about encoding"</li>
              <li className="bg-blue-50 p-3 rounded">"Take me to modulation"</li>
              <li className="bg-blue-50 p-3 rounded">"What's my progress?"</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Frameworks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {dataCommunicationFramework.topics.map((topic) => (
                <div key={topic.id} className="border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Is ConceptsPro free?</h3>
                <p className="text-gray-600">Yes! All content is 100% free.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Are my notes saved?</h3>
                <p className="text-gray-600">Yes, notes and progress are automatically saved to your browser's local storage.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">How do animations work?</h3>
                <p className="text-gray-600">Click "Start Animation" on any framework page to see the step-by-step visualization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
