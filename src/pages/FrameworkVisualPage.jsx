import React from 'react';
import { ChevronRight, CheckCircle, Circle, Play, Pause, RotateCcw } from 'lucide-react';
import EncryptionVisual from '../components/visuals/EncryptionVisual';
import EncodingVisual from '../components/visuals/EncodingVisual';
import ModulationVisual from '../components/visuals/ModulationVisual';
import MultiplexingVisual from '../components/visuals/MultiplexingVisual';

const FrameworkVisualPage = ({ 
  selectedTopic, 
  setCurrentPage, 
  completedConcepts, 
  toggleConceptCompletion, 
  isAnimating, 
  setIsAnimating, 
  animationStep, 
  resetAnimation 
}) => {
  if (!selectedTopic) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => setCurrentPage('directory')} className="flex items-center text-blue-600 mb-6 hover:text-blue-700">
          <ChevronRight className="w-5 h-5 transform rotate-180" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedTopic.title}</h1>
              <p className="text-lg text-gray-600">{selectedTopic.description}</p>
            </div>
            <button 
              onClick={() => toggleConceptCompletion(selectedTopic.id)}
              className={`p-3 rounded-full transition ${
                completedConcepts.includes(selectedTopic.id)
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {completedConcepts.includes(selectedTopic.id) ? <CheckCircle className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm mb-6">
            <span className={`px-3 py-1 rounded-full font-semibold ${
              selectedTopic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
              selectedTopic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {selectedTopic.difficulty}
            </span>
            <span className="text-gray-600">{selectedTopic.duration}</span>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center justify-center gap-4 border-2 border-gray-200">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isAnimating ? 'Pause' : 'Start'} Animation
            </button>
            <button
              onClick={resetAnimation}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {selectedTopic.conceptId === 'encryption' && <EncryptionVisual isAnimating={isAnimating} animationStep={animationStep} />}
          {selectedTopic.conceptId === 'encoding' && <EncodingVisual isAnimating={isAnimating} animationStep={animationStep} />}
          {selectedTopic.conceptId === 'modulation' && <ModulationVisual isAnimating={isAnimating} animationStep={animationStep} />}
          {selectedTopic.conceptId === 'multiplexing' && <MultiplexingVisual isAnimating={isAnimating} animationStep={animationStep} />}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Excellent work exploring {selectedTopic.title}!</h3>
          <p className="mb-4">Ready to learn more frameworks?</p>
          <button onClick={() => setCurrentPage('directory')} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore All Frameworks
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameworkVisualPage;
