import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const DirectoryPage = ({ 
  dataCommunicationFramework, 
  completedConcepts, 
  setSelectedTopic, 
  setCurrentPage, 
  resetAnimation, 
  calculateProgress 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Learning Directory</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="text-4xl mr-3">{dataCommunicationFramework.icon}</span>
                {dataCommunicationFramework.title}
              </h2>
              <p className="text-gray-600 mt-2">{dataCommunicationFramework.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{calculateProgress()}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dataCommunicationFramework.topics.map((topic) => {
              const isCompleted = completedConcepts.includes(topic.id);

              return (
                <div 
                  key={topic.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => { 
                    setSelectedTopic(topic); 
                    setCurrentPage('framework-visual');
                    resetAnimation();
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{topic.duration}</span>
                    <span className="flex items-center">
                      {isCompleted ? (
                        <><CheckCircle className="w-4 h-4 text-green-600 mr-1" /> Completed</>
                      ) : (
                        <><Circle className="w-4 h-4 mr-1" /> Not Started</>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">More Subjects Coming Soon!</h3>
          <p className="text-gray-700">Computer Science, Mathematics, and Physics modules are in development</p>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
