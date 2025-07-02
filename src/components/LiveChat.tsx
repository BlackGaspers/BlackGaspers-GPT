import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface LiveChatProps {
  onNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
  isModerator?: boolean;
}

export const LiveChat: React.FC<LiveChatProps> = ({ onNotification }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'BlackGaspers',
      message: '¡Bienvenidos al stream! Chat en vivo activado 🎮',
      timestamp: new Date(),
      isStreamer: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [viewerCount, setViewerCount] = useState(42);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate live chat activity
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedMessages = [
        'Hola! Nuevo seguidor aquí 👋',
        'Excelente stream!',
        'Qué configuración usas?',
        'GG! Increíble jugada',
        'Puedes hacer un tutorial de OBS?',
        'Saludos desde México! 🇲🇽',
        'Primera vez viendo, me encanta!',
        'Cómo optimizas el bitrate?'
      ];

      const usernames = ['StreamFan123', 'GamerPro', 'TechLover', 'NewViewer', 'RegularWatcher', 'StreamSupporter'];
      
      if (Math.random() > 0.7) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          username: usernames[Math.floor(Math.random() * usernames.length)],
          message: simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)],
          timestamp: new Date(),
          isModerator: Math.random() > 0.9
        };

        setMessages(prev => [...prev.slice(-50), newMessage]);
        setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'Tú',
      message: inputMessage,
      timestamp: new Date(),
      isStreamer: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    onNotification('Mensaje Enviado', 'Tu mensaje se envió al chat en vivo', 'success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20 flex flex-col">
      {/* Stream Controls Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isConnected ? 'EN VIVO' : 'DESCONECTADO'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{viewerCount} viewers</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${
                isMuted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-2 rounded-lg transition-colors ${
                !isVideoOn 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              message.isStreamer 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                : message.isModerator
                ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            }`}>
              {message.username.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-sm font-medium ${
                  message.isStreamer 
                    ? 'text-purple-600 dark:text-purple-400'
                    : message.isModerator
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {message.username}
                </span>
                {message.isStreamer && (
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                    Streamer
                  </span>
                )}
                {message.isModerator && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Mod
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                {message.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe en el chat..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};