import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="h-full bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl mb-4"
          >
            <SettingsIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-gray-400">Personaliza tu experiencia con BlackGaspers GPT</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Perfil</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Notificaciones</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Notificaciones push</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Notificaciones por email</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Apariencia</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tema</label>
                <select className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3">
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Idioma</label>
                <select className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Privacidad y Seguridad</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Guardar historial de conversaciones</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Análisis de uso</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Datos</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                Exportar datos
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors">
                Eliminar todos los datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};