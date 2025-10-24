import React from 'react';
import { Home, FolderTree, HelpCircle, FileText, Menu, Sparkles } from 'lucide-react';

const Navigation = ({ 
  currentPage, 
  setCurrentPage, 
  calculateProgress, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Sparkles className="w-8 h-8" />
            <span className="font-bold text-2xl">ConceptsPro</span>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-1 hover:text-blue-200 transition">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button onClick={() => setCurrentPage('directory')} className="flex items-center space-x-1 hover:text-blue-200 transition">
              <FolderTree className="w-4 h-4" />
              <span>Directory</span>
            </button>
            <button onClick={() => setCurrentPage('notepad')} className="flex items-center space-x-1 hover:text-blue-200 transition">
              <FileText className="w-4 h-4" />
              <span>Notepad</span>
            </button>
            <button onClick={() => setCurrentPage('help')} className="flex items-center space-x-1 hover:text-blue-200 transition">
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {calculateProgress()}% Complete
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Home</button>
            <button onClick={() => { setCurrentPage('directory'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Directory</button>
            <button onClick={() => { setCurrentPage('notepad'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Notepad</button>
            <button onClick={() => { setCurrentPage('help'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Help</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
