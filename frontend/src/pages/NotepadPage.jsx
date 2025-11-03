import React from 'react';
import { Download } from 'lucide-react';

const NotepadPage = ({ 
  notes, 
  setNotes, 
  calculateProgress, 
  completedConcepts, 
  dataCommunicationFramework, 
  downloadNotes 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Learning Notepad</h1>
          <button onClick={downloadNotes} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Download className="w-5 h-5" />
            <span>Download as TXT</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{calculateProgress()}%</div>
            <div className="text-gray-600">Overall Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedConcepts.length}/{dataCommunicationFramework.topics.length}</div>
            <div className="text-gray-600">Frameworks Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">{notes.split('\n').filter(line => line.trim()).length}</div>
            <div className="text-gray-600">Notes Lines</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes as you learn... Your notes are automatically saved!"
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500 mt-2">📝 Notes are automatically saved to your browser. Download for backup!</p>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold mb-2">💡 Coming Soon: Cloud Sync</h3>
          <p className="text-gray-700">We're working on Google Drive integration so you can access your notes from anywhere!</p>
        </div>
      </div>
    </div>
  );
};

export default NotepadPage;
