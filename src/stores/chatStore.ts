import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, Conversation } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  createNewConversation: () => Conversation;
  setActiveConversation: (id: string) => void;
  addMessage: (message: Message) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  getActiveConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,

      createNewConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: 'Nueva conversación',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversation: newConversation.id,
        }));

        return newConversation;
      },

      setActiveConversation: (id: string) => {
        set({ activeConversation: id });
      },

      addMessage: (message: Message) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === message.conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        }));
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          activeConversation:
            state.activeConversation === id ? null : state.activeConversation,
        }));
      },

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(
          (conv) => conv.id === state.activeConversation
        );
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversation: state.activeConversation,
      }),
    }
  )
);

// Initialize with a default conversation if none exists
const initializeStore = () => {
  const store = useChatStore.getState();
  if (store.conversations.length === 0) {
    store.createNewConversation();
  }
};

// Call initialization
setTimeout(initializeStore, 0);