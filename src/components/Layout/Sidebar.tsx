import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Image, 
  Presentation, 
  Settings, 
  Plus,
  History,
  Sparkles
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Imágenes', href: '/images', icon: Image },
  { name: 'Presentaciones', href: '/presentations', icon: Presentation },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { conversations, createNewConversation, setActiveConversation } = useChatStore();

  const handleNewChat = () => {
    const newConversation = createNewConversation();
    setActiveConversation(newConversation.id);
  };

  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BlackGaspers</h1>
            <p className="text-sm text-gray-400">GPT Assistant</p>
          </div>
        </div>

        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-300" />
          <span className="text-gray-300 font-medium">Nueva conversación</span>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/chat' && location.pathname === '/');
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-400">Historial</h3>
        </div>
        
        <div className="space-y-2">
          {conversations.slice(0, 10).map((conversation) => (
            <motion.button
              key={conversation.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveConversation(conversation.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors truncate"
            >
              {conversation.title || 'Nueva conversación'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          BlackGaspers GPT v2.0
        </div>
      </div>
    </div>
  );
};