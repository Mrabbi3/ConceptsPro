import React from 'react';
import { BookOpen, Calendar, FileText, Users, Clock, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { courses } from '../config/data/courses';

const DashboardPage = ({ setCurrentPage, setSelectedCourse }) => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const enrolledCourses = courses.filter(course => 
    user.role === 'student' 
      ? course.enrolled && user.enrolledCourses?.includes(course.id)
      : user.role === 'instructor' && course.instructor.id === user.id
  );

  const upcomingAssignments = enrolledCourses
    .flatMap(course => 
      course.assignments
        .filter(a => !a.submitted && new Date(a.dueDate) > new Date())
        .map(a => ({ ...a, courseCode: course.code, courseTitle: course.title }))
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentAnnouncements = enrolledCourses
    .flatMap(course => 
      course.announcements.map(a => ({ ...a, courseCode: course.code }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage('course');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Here's what's happening in your courses</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-800">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Assignments</p>
                <p className="text-3xl font-bold text-gray-800">{upcomingAssignments.length}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Week</p>
                <p className="text-3xl font-bold text-gray-800">
                  {upcomingAssignments.filter(a => {
                    const dueDate = new Date(a.dueDate);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return dueDate <= weekFromNow;
                  }).length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Announcements</p>
                <p className="text-3xl font-bold text-gray-800">{recentAnnouncements.length}</p>
              </div>
              <Users className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {enrolledCourses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No courses enrolled</p>
                  ) : (
                    enrolledCourses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => handleCourseClick(course)}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{course.code}</h3>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600 text-sm">{course.term}</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{course.instructor.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {course.assignments.length} Assignments
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {course.modules.length} Modules
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Assignments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Assignments</h2>
              </div>
              <div className="p-6">
                {upcomingAssignments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming assignments</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingAssignments.map(assignment => (
                      <div key={assignment.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-800 text-sm">{assignment.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{assignment.courseCode}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Recent Announcements</h2>
              </div>
              <div className="p-6">
                {recentAnnouncements.length === 0 ? (
                  <p className="text-gray-500 text-sm">No announcements</p>
                ) : (
                  <div className="space-y-4">
                    {recentAnnouncements.map(announcement => (
                      <div key={announcement.id} className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-800 text-sm">{announcement.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{announcement.courseCode}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(announcement.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

