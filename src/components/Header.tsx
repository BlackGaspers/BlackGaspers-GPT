import React from 'react';
import { Brain, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount: number;
  onNotificationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  notificationCount,
  onNotificationClick
}) => {
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'chat', label: 'Chat IA', icon: '💬' },
    { id: 'live', label: 'Chat Vivo', icon: '🔴' },
    { id: 'images', label: 'Imágenes', icon: '🎨' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'presentations', label: 'Presentaciones', icon: '📊' }
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 p-1 flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center">
                <div className="text-white font-bold text-lg">BG</div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BlackGaspers
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Streaming Assistant</p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 grid grid-cols-5 gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="block text-sm">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};