import React, { useState } from 'react';
import { BookOpen, LogIn, User, GraduationCap } from 'lucide-react';
import { useUser } from '../context/UserContext';

const HomePage = ({ setCurrentPage, login }) => {
  const { isAuthenticated } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password, role);
      setCurrentPage('dashboard');
    }
  };

  if (isAuthenticated) {
    return null; // Redirect to dashboard (handled by App)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">ConceptsPro</h1>
            <p className="text-gray-600">Learning Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition ${
                    role === 'instructor'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-semibold">Instructor</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>

            <p className="text-xs text-gray-500 text-center">
              MVP Demo: Enter any email/password to continue
            </p>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">© 2024 ConceptsPro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
