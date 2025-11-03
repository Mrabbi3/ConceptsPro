import React from 'react';
import { Home, Calendar, BookOpen, FileText, HelpCircle, Menu, LogOut, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navigation = ({ 
  currentPage, 
  setCurrentPage, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  logout
}) => {
  const { user } = useUser();

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <BookOpen className="w-8 h-8" />
            <span className="font-bold text-2xl">ConceptsPro</span>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            <button onClick={() => setCurrentPage('dashboard')} className={`flex items-center space-x-1 transition px-3 py-1 rounded ${currentPage === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button onClick={() => setCurrentPage('calendar')} className={`flex items-center space-x-1 transition px-3 py-1 rounded ${currentPage === 'calendar' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button onClick={() => setCurrentPage('courses')} className={`flex items-center space-x-1 transition px-3 py-1 rounded ${currentPage === 'courses' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </button>
            <button onClick={() => setCurrentPage('help')} className={`flex items-center space-x-1 transition px-3 py-1 rounded ${currentPage === 'help' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.name || 'User'}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">{user?.role || 'student'}</span>
              </div>
              <button onClick={logout} className="hover:bg-white/10 p-2 rounded transition" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Dashboard</button>
            <button onClick={() => { setCurrentPage('calendar'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Calendar</button>
            <button onClick={() => { setCurrentPage('courses'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Courses</button>
            <button onClick={() => { setCurrentPage('help'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Help</button>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="px-3 py-2 text-sm">{user?.name}</div>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
