import React from 'react';
import { BookOpen, ArrowRight, Users, FileText, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { courses } from '../config/data/courses';

const CoursesPage = ({ setCurrentPage, setSelectedCourse }) => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const enrolledCourses = courses.filter(course => 
    user.role === 'student' 
      ? course.enrolled && user.enrolledCourses?.includes(course.id)
      : user.role === 'instructor' && course.instructor.id === user.id
  );

  const availableCourses = courses.filter(course => 
    user.role === 'student' && !user.enrolledCourses.includes(course.id)
  );

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage('course');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Courses</h1>

        {/* My Courses */}
        {enrolledCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-8 h-8" />
                      <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-white/90 mt-1">{course.instructor.name}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {course.assignments.length} Assignments
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.modules.length} Modules
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{course.term}</span>
                      <button className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        Open Course
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses (for students) */}
        {user.role === 'student' && availableCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden opacity-75"
                >
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-8 h-8" />
                      <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-white/90 mt-1">{course.instructor.name}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="text-center">
                      <button
                        onClick={() => {
                          // Enroll in course (would update user context in real app)
                          alert('Enrollment feature coming soon!');
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {enrolledCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses enrolled</h3>
            <p className="text-gray-500">You don't have any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

