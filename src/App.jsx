import React, { useState, useEffect } from 'react';
import { Home, FolderTree, HelpCircle, MessageSquare, FileText, ChevronRight, Download, X, Menu, CheckCircle, Circle, Sparkles, Play, Pause, RotateCcw, Lock, Code, Waves, GitBranch } from 'lucide-react';
import { dataCommunicationFramework } from './data/frameworks';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import FrameworkVisualPage from './pages/FrameworkVisualPage';
import NotepadPage from './pages/NotepadPage';
import HelpPage from './pages/HelpPage';
import ChatBot from './components/ChatBot';
import Navigation from './components/Navigation';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [notes, setNotes] = useState('');
  const [completedConcepts, setCompletedConcepts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Animation states for framework visualization
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

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
    const savedNotes = localStorage.getItem('conceptspro-notes');
    const savedCompleted = localStorage.getItem('conceptspro-completed');
    if (savedNotes) setNotes(savedNotes);
    if (savedCompleted) setCompletedConcepts(JSON.parse(savedCompleted));
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem('conceptspro-notes', notes);
  }, [notes]);

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

  const calculateProgress = () => {
    const totalConcepts = dataCommunicationFramework.topics.length;
    return Math.round((completedConcepts.length / totalConcepts) * 100);
  };

  const handleChat = (message) => {
    setChatMessages([...chatMessages, { type: 'user', text: message }]);
    setChatInput('');

    setTimeout(() => {
      let response = '';
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('encrypt') || lowerMessage.includes('decryp')) {
        response = "Great! I'll take you to the Encryption/Decryption framework. You'll see how data is secured using keys and algorithms!";
        setTimeout(() => {
          setSelectedTopic(dataCommunicationFramework.topics[0]);
          setCurrentPage('framework-visual');
          setChatOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('encod') || lowerMessage.includes('decod')) {
        response = "Perfect! Let me show you the Encoding/Decoding framework where you'll learn how data is converted for transmission!";
        setTimeout(() => {
          setSelectedTopic(dataCommunicationFramework.topics[1]);
          setCurrentPage('framework-visual');
          setChatOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('modulat') || lowerMessage.includes('demodulat')) {
        response = "Excellent choice! I'll guide you to Modulation/Demodulation to see how digital signals are converted to analog and back!";
        setTimeout(() => {
          setSelectedTopic(dataCommunicationFramework.topics[2]);
          setCurrentPage('framework-visual');
          setChatOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('multiplex') || lowerMessage.includes('demultiplex')) {
        response = "Great question! Let me take you to the Multiplexing/Demultiplexing section where multiple signals are combined efficiently!";
        setTimeout(() => {
          setSelectedTopic(dataCommunicationFramework.topics[3]);
          setCurrentPage('framework-visual');
          setChatOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('progress')) {
        response = `You've completed ${completedConcepts.length} out of ${dataCommunicationFramework.topics.length} frameworks! That's ${calculateProgress()}% complete. Keep up the excellent work!`;
      } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        response = "I can help you navigate to any Data Communication Framework! Try asking about 'encryption', 'encoding', 'modulation', or 'multiplexing'. I'll take you right there!";
      } else {
        response = "I can help you explore Data Communication Frameworks! Ask me about encryption, encoding, modulation, or multiplexing, and I'll guide you there instantly!";
      }

      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conceptspro-notes.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        calculateProgress={calculateProgress}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} setChatOpen={setChatOpen} />}
      {currentPage === 'directory' && (
        <DirectoryPage 
          dataCommunicationFramework={dataCommunicationFramework}
          completedConcepts={completedConcepts}
          setSelectedTopic={setSelectedTopic}
          setCurrentPage={setCurrentPage}
          resetAnimation={resetAnimation}
          calculateProgress={calculateProgress}
        />
      )}
      {currentPage === 'framework-visual' && (
        <FrameworkVisualPage 
          selectedTopic={selectedTopic}
          setCurrentPage={setCurrentPage}
          completedConcepts={completedConcepts}
          toggleConceptCompletion={toggleConceptCompletion}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          animationStep={animationStep}
          resetAnimation={resetAnimation}
        />
      )}
      {currentPage === 'notepad' && (
        <NotepadPage 
          notes={notes}
          setNotes={setNotes}
          calculateProgress={calculateProgress}
          completedConcepts={completedConcepts}
          dataCommunicationFramework={dataCommunicationFramework}
          downloadNotes={downloadNotes}
        />
      )}
      {currentPage === 'help' && <HelpPage dataCommunicationFramework={dataCommunicationFramework} />}
      <ChatBot 
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleChat={handleChat}
      />
    </div>
  );
};

export default App;
