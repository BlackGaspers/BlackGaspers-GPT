export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  conversationId: string;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface ImageGenerationParams {
  prompt: string;
  style: 'realistic' | 'artistic' | 'abstract' | 'cartoon' | 'anime';
  size: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality: 'standard' | 'hd';
  steps: number;
  guidance: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  params: ImageGenerationParams;
  createdAt: Date;
}

export interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  layout: 'title' | 'content' | 'image' | 'split' | 'comparison';
  background?: string;
  animations?: string[];
}

export interface Presentation {
  id: string;
  title: string;
  slides: PresentationSlide[];
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  subscription: Subscription;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  expiresAt?: Date;
  features: string[];
}