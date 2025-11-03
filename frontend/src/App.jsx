import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { dataCommunicationFramework } from './config/data/frameworks';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CoursePage from './pages/CoursePage';
import CalendarPage from './pages/CalendarPage';
import FrameworkVisualPage from './pages/FrameworkVisualPage';
import HelpPage from './pages/HelpPage';
import Navigation from './components/Navigation';

const AppContent = () => {
  const { user, isAuthenticated, login, logout } = useUser();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedConcepts, setCompletedConcepts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Animation states for framework visualization
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Redirect to dashboard if authenticated
    if (isAuthenticated && currentPage === 'home') {
      setCurrentPage('dashboard');
    }
    // Redirect to home if not authenticated
    if (!isAuthenticated && currentPage !== 'home') {
      setCurrentPage('home');
    }
  }, [isAuthenticated, currentPage]);

  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const resetAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Load saved data
  useEffect(() => {
    const savedCompleted = localStorage.getItem('conceptspro-completed');
    if (savedCompleted) setCompletedConcepts(JSON.parse(savedCompleted));
  }, []);

  // Save completed concepts
  useEffect(() => {
    localStorage.setItem('conceptspro-completed', JSON.stringify(completedConcepts));
  }, [completedConcepts]);

  const toggleConceptCompletion = (conceptId) => {
    if (completedConcepts.includes(conceptId)) {
      setCompletedConcepts(completedConcepts.filter(id => id !== conceptId));
    } else {
      setCompletedConcepts([...completedConcepts, conceptId]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomePage setCurrentPage={setCurrentPage} login={login} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        logout={logout}
      />
      
      {currentPage === 'dashboard' && (
        <DashboardPage 
          setCurrentPage={setCurrentPage}
          setSelectedCourse={setSelectedCourse}
        />
      )}
      
      {currentPage === 'courses' && (
        <CoursesPage 
          setCurrentPage={setCurrentPage}
          setSelectedCourse={setSelectedCourse}
        />
      )}
      
      {currentPage === 'course' && selectedCourse && (
        <CoursePage 
          course={selectedCourse}
          setCurrentPage={setCurrentPage}
          setSelectedTopic={setSelectedTopic}
          setSelectedCourse={setSelectedCourse}
        />
      )}
      
      {currentPage === 'calendar' && (
        <CalendarPage 
          setCurrentPage={setCurrentPage}
          setSelectedCourse={setSelectedCourse}
        />
      )}
      
      {currentPage === 'framework-visual' && (
        <FrameworkVisualPage 
          selectedTopic={selectedTopic}
          selectedCourse={selectedCourse}
          setCurrentPage={setCurrentPage}
          setSelectedCourse={setSelectedCourse}
          completedConcepts={completedConcepts}
          toggleConceptCompletion={toggleConceptCompletion}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          animationStep={animationStep}
          resetAnimation={resetAnimation}
        />
      )}
      
      {currentPage === 'help' && (
        <HelpPage dataCommunicationFramework={dataCommunicationFramework} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
