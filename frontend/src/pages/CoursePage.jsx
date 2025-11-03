import React, { useState } from 'react';
import { BookOpen, FileText, Video, Play, ChevronRight, Bell, Calendar, Clipboard } from 'lucide-react';
import { dataCommunicationFramework } from '../config/data/frameworks';

const CoursePage = ({ course, setCurrentPage, setSelectedTopic, setSelectedCourse }) => {
  const [selectedModule, setSelectedModule] = useState(course.modules[0] || null);
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'assignments', 'grades', 'announcements'

  const handleContentClick = (content) => {
    if (content.type === 'interactive') {
      // Find the topic from dataCommunicationFramework
      const topic = dataCommunicationFramework.topics.find(t => t.conceptId === content.conceptId);
      if (topic) {
        setSelectedCourse(course); // Maintain course context
        setSelectedTopic(topic);
        setCurrentPage('framework-visual');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{course.code}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.instructor.name} • {course.term}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'grades'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Grades
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Announcements
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
                </div>
                <div className="p-6">
                  {selectedModule ? (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedModule.title}</h3>
                      <div className="space-y-3">
                        {selectedModule.content.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleContentClick(item)}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {item.type === 'video' && <Video className="w-5 h-5 text-red-600" />}
                                {item.type === 'document' && <FileText className="w-5 h-5 text-blue-600" />}
                                {item.type === 'interactive' && <Play className="w-5 h-5 text-purple-600" />}
                                <div>
                                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                  {item.duration && (
                                    <p className="text-sm text-gray-500">{item.duration}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No modules available</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {course.assignments.map(assignment => (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{assignment.title}</h3>
                            <p className="text-gray-600 mt-1">{assignment.description}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {assignment.points} pts
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            {assignment.submitted && (
                              <span className="ml-4 text-green-600">✓ Submitted</span>
                            )}
                            {assignment.grade !== null && (
                              <span className="ml-4">Grade: {assignment.grade}/{assignment.points}</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setCurrentPage('assignment-detail');
                              // Would set selected assignment here
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            {assignment.submitted ? 'View Submission' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Grades</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Assignment</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.assignments.map(assignment => (
                          <tr key={assignment.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">{assignment.title}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {assignment.grade !== null ? (
                                <span className="font-semibold">{assignment.grade}/{assignment.points}</span>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {assignment.submitted ? (
                                <span className="text-green-600">Submitted</span>
                              ) : (
                                <span className="text-gray-400">Not Submitted</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total Points:</span>
                      <span className="font-bold text-lg text-gray-800">
                        {course.assignments
                          .filter(a => a.grade !== null)
                          .reduce((sum, a) => sum + a.grade, 0)} / {course.assignments.reduce((sum, a) => sum + a.points, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {course.announcements.map(announcement => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{announcement.title}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{announcement.content}</p>
                        <p className="text-sm text-gray-500">- {announcement.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Modules */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Modules</h3>
              </div>
              <div className="p-2">
                {course.modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModule(module);
                      setActiveTab('content');
                    }}
                    className={`w-full text-left px-3 py-2 rounded mb-1 transition ${
                      selectedModule?.id === module.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {module.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Quick Links</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition flex items-center space-x-2 text-gray-700"
                >
                  <Clipboard className="w-4 h-4" />
                  <span>Assignments</span>
                </button>
                <button
                  onClick={() => setCurrentPage('calendar')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition flex items-center space-x-2 text-gray-700"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Instructor</h3>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800">{course.instructor.name}</p>
                <p className="text-sm text-gray-600 mt-1">{course.instructor.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;

