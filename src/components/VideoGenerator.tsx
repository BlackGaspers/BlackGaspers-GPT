import React, { useState } from 'react';
import { Video, Download, Play, Loader, Settings } from 'lucide-react';
import { AIService } from '../services/aiService';

interface VideoGeneratorProps {
  onNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onNotification }) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [style, setStyle] = useState<'realistic' | 'animated' | 'cinematic' | 'gaming'>('realistic');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      onNotification('Entrada Requerida', 'Por favor describe el video que quieres generar', 'warning');
      return;
    }

    setIsGenerating(true);
    onNotification('Generación Iniciada', 'Creando tu video...', 'info');

    try {
      const videoUrl = await AIService.generateVideo(prompt, duration);
      setGeneratedVideo(videoUrl);
      onNotification('Video Listo', '¡Tu video ha sido generado exitosamente!', 'success');
    } catch (error) {
      onNotification('Error de Generación', 'No se pudo generar el video', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `blackgaspers-video-${Date.now()}.mp4`;
      link.click();
      onNotification('Descarga Iniciada', 'Descarga del video iniciada', 'success');
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900/20 p-6">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Generador de Videos IA</h2>
          <p className="text-gray-600 dark:text-gray-300">Crea videos increíbles para tu contenido de streaming</p>
          <div className="mt-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg inline-block">
            🚧 Función en desarrollo - Próximamente disponible
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Describe tu video
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Un gamer jugando en una habitación con luces RGB, ambiente épico, cámara cinematográfica..."
                rows={4}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Configuración</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                >
                  {showAdvanced ? 'Básico' : 'Avanzado'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Duración: {duration} segundos
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Estilo</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="realistic">Realista</option>
                    <option value="animated">Animado</option>
                    <option value="cinematic">Cinematográfico</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>

                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Resolución</label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="720p">HD (720p)</option>
                        <option value="1080p">Full HD (1080p)</option>
                        <option value="4k">4K Ultra HD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">FPS</label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="24">24 FPS</option>
                        <option value="30">30 FPS</option>
                        <option value="60">60 FPS</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generando Video...</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Generar Video</span>
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Vista Previa</h3>
              {generatedVideo && (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
              )}
            </div>

            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              {isGenerating ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Generando tu video...</p>
                    <div className="mt-4 w-64 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mx-auto">
                      <div className="bg-indigo-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              ) : generatedVideo ? (
                <video
                  src={generatedVideo}
                  controls
                  className="w-full h-full object-cover"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112.5' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EVideo Generado%3C/text%3E%3C/svg%3E"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Tu video generado aparecerá aquí</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};