import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, Square, Loader2 } from 'lucide-react';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '../../stores/chatStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { AIService } from '../../services/aiService';
import { Message } from '../../types';
import toast from 'react-hot-toast';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    activeConversation, 
    addMessage, 
    updateConversationTitle,
    getActiveConversation 
  } = useChatStore();
  
  const { addNotification } = useNotificationStore();

  const conversation = getActiveConversation();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      conversationId: activeConversation
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Update conversation title if it's the first message
      if (conversation?.messages.length === 0) {
        const title = input.trim().slice(0, 50) + (input.length > 50 ? '...' : '');
        updateConversationTitle(activeConversation, title);
      }

      const response = await AIService.generateResponse(input.trim(), conversation?.messages || []);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        conversationId: activeConversation
      };

      addMessage(aiMessage);
      addNotification('Respuesta recibida', 'BlackGaspers ha respondido a tu mensaje', 'success');
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Error al generar respuesta');
      addNotification('Error', 'No se pudo generar la respuesta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      toast.success(`Archivo ${file.name} cargado`);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Grabación iniciada');
    } else {
      toast.success('Grabación detenida');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={conversation?.messages || []} />
      </div>

      {/* Typing indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6 py-2"
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="border-t border-gray-800 bg-gray-900/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto p-6">
          <div className="relative">
            {/* Input container */}
            <div className="flex items-end space-x-4 bg-gray-800/50 rounded-2xl p-4 border border-gray-700 focus-within:border-blue-500 transition-colors">
              {/* File upload */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFileUpload}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>

              {/* Text input */}
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none max-h-32"
                  rows={1}
                />
              </div>

              {/* Voice recording */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>

              {/* Send button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Character count */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{input.length}/4000</span>
              <span>Shift + Enter para nueva línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};