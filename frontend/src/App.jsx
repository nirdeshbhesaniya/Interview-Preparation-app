// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import LandingPage from './pages/LandingPage';
import { Dashboard } from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import ContactSupportPage from './pages/ContactSupportPage';
import MCQTest from './pages/MCQTest/MCQTest';

import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import CodeExecutionPlatform from './pages/Home/Codebase';

// Chatbot Components
import ChatbotProvider from './context/ChatBotContext';
import Chatbot from './components/Chatbot';
import FloatingHelpButton from './components/FloatingHelpButton';

const App = () => {
  return (
    <ChatbotProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Public routes (no header) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/support" element={<ContactSupportPage />} />

            {/* Routes with header */}
            <Route element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/codebase"
                element={
                  <ProtectedRoute>
                    <CodeExecutionPlatform />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mcq-test"
                element={
                  <ProtectedRoute>
                    <MCQTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-prep/:sessionId"
                element={
                  <ProtectedRoute>
                    <InterviewPrep />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>

          {/* Global Chatbot - Available on all routes */}
          <Chatbot />

          {/* Global Help Button - Available on all routes */}
          <FloatingHelpButton />

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ChatbotProvider>
  );
};

export default App;
