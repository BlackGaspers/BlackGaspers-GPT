import axios from 'axios';
import { Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

class AIServiceClass {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor for authentication
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  async generateResponse(prompt: string, context: Message[] = []): Promise<string> {
    try {
      // For demo purposes, simulate DeepSeek API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Enhanced AI responses based on context
      const responses = this.getContextualResponses(prompt, context);
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      return this.enhanceResponse(randomResponse, prompt);
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('No se pudo generar la respuesta. Inténtalo de nuevo.');
    }
  }

  private getContextualResponses(prompt: string, context: Message[]): string[] {
    const lowerPrompt = prompt.toLowerCase();

    // Programming related
    if (lowerPrompt.includes('código') || lowerPrompt.includes('programar') || lowerPrompt.includes('javascript') || lowerPrompt.includes('python')) {
      return [
        "Te ayudo con programación. Aquí tienes un ejemplo de código:\n\n```javascript\nfunction ejemplo() {\n  console.log('¡Hola desde BlackGaspers!');\n}\n```\n\n¿Necesitas ayuda con algún lenguaje específico?",
        "Como experto en desarrollo, puedo ayudarte con:\n\n• **Frontend**: React, Vue, Angular\n• **Backend**: Node.js, Python, Java\n• **Bases de datos**: SQL, MongoDB\n• **DevOps**: Docker, CI/CD\n\n¿En qué área te gustaría profundizar?",
        "Perfecto, hablemos de programación. Puedo ayudarte con:\n\n1. **Debugging** de código\n2. **Optimización** de rendimiento\n3. **Arquitectura** de software\n4. **Mejores prácticas**\n\n¿Qué problema específico tienes?"
      ];
    }

    // Creative writing
    if (lowerPrompt.includes('escribir') || lowerPrompt.includes('historia') || lowerPrompt.includes('creativo')) {
      return [
        "¡Excelente! Me encanta la escritura creativa. Puedo ayudarte con:\n\n✨ **Desarrollo de personajes**\n📖 **Estructura narrativa**\n🎭 **Diálogos naturales**\n🌟 **Worldbuilding**\n\n¿Qué tipo de historia quieres crear?",
        "La creatividad es mi fuerte. Podemos trabajar en:\n\n• Cuentos cortos\n• Novelas\n• Guiones\n• Poesía\n• Contenido para redes sociales\n\n¿Tienes alguna idea inicial?",
        "Como asistente creativo, puedo ayudarte a desarrollar ideas únicas y originales. ¿Prefieres ficción, no ficción, o algo experimental?"
      ];
    }

    // Analysis and research
    if (lowerPrompt.includes('analizar') || lowerPrompt.includes('investigar') || lowerPrompt.includes('datos')) {
      return [
        "Perfecto para análisis profundo. Mi enfoque incluye:\n\n🔍 **Investigación exhaustiva**\n📊 **Análisis de datos**\n📈 **Tendencias y patrones**\n💡 **Insights accionables**\n\n¿Qué necesitas analizar?",
        "Como analista experto, puedo ayudarte con:\n\n• Análisis de mercado\n• Investigación académica\n• Evaluación de datos\n• Reportes detallados\n\n¿Cuál es tu objetivo?",
        "Excelente elección para análisis. Puedo procesar información compleja y generar insights valiosos. ¿Qué datos o tema quieres explorar?"
      ];
    }

    // General helpful responses
    return [
      "¡Hola! Soy BlackGaspers GPT, tu asistente de IA avanzado. Estoy aquí para ayudarte con:\n\n🧠 **Análisis y razonamiento**\n✍️ **Escritura y creatividad**\n💻 **Programación y tecnología**\n📚 **Investigación y aprendizaje**\n🎯 **Resolución de problemas**\n\n¿En qué puedo asistirte hoy?",
      "Entiendo tu consulta. Como IA avanzada con capacidades multimodales, puedo ayudarte de múltiples formas:\n\n• **Respuestas detalladas** y contextuales\n• **Análisis profundo** de temas complejos\n• **Soluciones creativas** a problemas\n• **Explicaciones claras** de conceptos\n\n¿Qué te gustaría explorar?",
      "¡Perfecto! Estoy diseñado para ser tu compañero intelectual ideal. Puedo:\n\n✨ Generar contenido original\n🔍 Analizar información compleja\n💡 Ofrecer perspectivas únicas\n🎯 Resolver problemas específicos\n\n¿Cómo puedo ayudarte a alcanzar tus objetivos?",
      "Como BlackGaspers GPT, combino conocimiento avanzado con creatividad. Mi especialidad es:\n\n🌟 **Pensamiento crítico**\n🎨 **Soluciones innovadoras**\n📖 **Explicaciones comprensibles**\n⚡ **Respuestas rápidas y precisas**\n\n¿Qué desafío enfrentas hoy?"
    ];
  }

  private enhanceResponse(baseResponse: string, prompt: string): string {
    // Add contextual enhancements based on the prompt
    const enhancements = [];

    if (prompt.length > 100) {
      enhancements.push("\n\n💡 **Tip**: Veo que tienes una consulta detallada. Puedo profundizar en cualquier aspecto específico que te interese más.");
    }

    if (prompt.includes('?')) {
      enhancements.push("\n\n❓ Si tienes más preguntas relacionadas, no dudes en hacerlas. Estoy aquí para ayudarte.");
    }

    return baseResponse + enhancements.join('');
  }

  async generateImage(params: any): Promise<string> {
    try {
      // Simulate image generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return a placeholder image URL
      const seed = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/seed/${seed}/1024/1024`;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('No se pudo generar la imagen');
    }
  }

  async generatePresentation(topic: string, slideCount: number): Promise<any[]> {
    try {
      // Simulate presentation generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const slides = [];
      for (let i = 0; i < slideCount; i++) {
        slides.push({
          id: `slide-${i + 1}`,
          title: `${topic} - Slide ${i + 1}`,
          content: `Contenido detallado para la diapositiva ${i + 1} sobre ${topic}`,
          layout: i === 0 ? 'title' : 'content'
        });
      }
      
      return slides;
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw new Error('No se pudo generar la presentación');
    }
  }

  // Real-time streaming response (for future implementation)
  async *streamResponse(prompt: string, context: Message[] = []): AsyncGenerator<string> {
    const response = await this.generateResponse(prompt, context);
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      yield words.slice(0, i + 1).join(' ');
    }
  }
}

export const AIService = new AIServiceClass();