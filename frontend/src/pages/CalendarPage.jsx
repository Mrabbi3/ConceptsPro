import React, { useState } from 'react';
import { Calendar, Clock, FileText, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { courses } from '../config/data/courses';

const CalendarPage = ({ setCurrentPage, setSelectedCourse }) => {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!user) return null;

  const enrolledCourses = courses.filter(course => 
    user.role === 'student' 
      ? course.enrolled && user.enrolledCourses?.includes(course.id)
      : user.role === 'instructor' && course.instructor.id === user.id
  );

  // Get all events from enrolled courses
  const allEvents = enrolledCourses.flatMap(course => 
    [
      ...course.events.map(event => ({
        ...event,
        courseCode: course.code,
        courseTitle: course.title,
        course: course
      })),
      ...course.assignments.map(assignment => ({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        date: assignment.dueDate,
        type: 'assignment',
        courseCode: course.code,
        courseTitle: course.title,
        course: course,
        assignment: assignment
      }))
    ]
  );

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allEvents.filter(event => event.date === dateStr);
  };

  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const events = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        events.push({ date, events: dayEvents });
      }
    }
    return events;
  };

  const monthEvents = getEventsForMonth();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-700">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {monthEvents.map(({ date, events }) => (
                  <div key={date.toISOString()} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </h3>
                      {date.toISOString().split('T')[0] === todayStr && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Today</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {events.map(event => (
                        <div
                          key={event.id}
                          onClick={() => {
                            if (event.course) {
                              setSelectedCourse(event.course);
                              setCurrentPage('course');
                            }
                          }}
                          className={`p-2 rounded cursor-pointer transition ${
                            event.type === 'exam' ? 'bg-red-50 border border-red-200' :
                            event.type === 'assignment' ? 'bg-blue-50 border border-blue-200' :
                            'bg-gray-50 border border-gray-200'
                          } hover:shadow-md`}
                        >
                          <div className="flex items-center space-x-2">
                            {event.type === 'exam' && <GraduationCap className="w-4 h-4 text-red-600" />}
                            {event.type === 'assignment' && <FileText className="w-4 h-4 text-blue-600" />}
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">{event.title}</p>
                              <p className="text-xs text-gray-600">{event.courseCode}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {monthEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No events this month</p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Upcoming Events
                </h3>
              </div>
              <div className="p-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => {
                          if (event.course) {
                            setSelectedCourse(event.course);
                            setCurrentPage('course');
                          }
                        }}
                        className="border-l-4 border-blue-500 pl-3 py-2 cursor-pointer hover:bg-gray-50 rounded transition"
                      >
                        <p className="font-semibold text-sm text-gray-800">{event.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{event.courseCode}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">My Courses</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {enrolledCourses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourse(course);
                        setCurrentPage('course');
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition text-sm"
                    >
                      <p className="font-semibold text-gray-800">{course.code}</p>
                      <p className="text-gray-600">{course.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

