import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/Chat/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator/ImageGenerator';
import { PresentationCreator } from './components/Presentations/PresentationCreator';
import { Settings } from './components/Settings/Settings';
import { useThemeStore } from './stores/themeStore';
import './styles/globals.css';

function App() {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-black text-white min-h-screen">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/images" element={<ImageGenerator />} />
              <Route path="/presentations" element={<PresentationCreator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;