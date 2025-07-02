import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Download, Wand2, Settings, Loader2 } from 'lucide-react';
import { AIService } from '../../services/aiService';
import toast from 'react-hot-toast';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [params, setParams] = useState({
    style: 'realistic',
    size: '1024x1024',
    quality: 'hd',
    steps: 30,
    guidance: 7.5
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor ingresa una descripción');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await AIService.generateImage({ prompt, ...params });
      setGeneratedImage(imageUrl);
      toast.success('¡Imagen generada exitosamente!');
    } catch (error) {
      toast.error('Error al generar la imagen');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `blackgaspers-${Date.now()}.jpg`;
      link.click();
      toast.success('Descarga iniciada');
    }
  };

  return (
    <div className="h-full bg-black p-6">
      <div className="max-w-6xl mx-auto h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4"
          >
            <Image className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Generador de Imágenes IA</h1>
          <p className="text-gray-400">Crea imágenes increíbles con inteligencia artificial</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100%-200px)]">
          {/* Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Describe tu imagen
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Un paisaje futurista con ciudades flotantes, colores vibrantes, estilo cyberpunk..."
                rows={4}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Settings */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Configuración</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-blue-400 text-sm hover:underline"
                >
                  {showAdvanced ? 'Básico' : 'Avanzado'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Estilo</label>
                  <select
                    value={params.style}
                    onChange={(e) => setParams(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
                  >
                    <option value="realistic">Realista</option>
                    <option value="artistic">Artístico</option>
                    <option value="abstract">Abstracto</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tamaño</label>
                  <select
                    value={params.size}
                    onChange={(e) => setParams(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
                  >
                    <option value="512x512">512×512</option>
                    <option value="1024x1024">1024×1024</option>
                    <option value="1024x1792">1024×1792</option>
                    <option value="1792x1024">1792×1024</option>
                  </select>
                </div>
              </div>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Calidad: {params.quality}
                    </label>
                    <select
                      value={params.quality}
                      onChange={(e) => setParams(prev => ({ ...prev, quality: e.target.value }))}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3"
                    >
                      <option value="standard">Estándar</option>
                      <option value="hd">Alta Definición</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Pasos: {params.steps}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={params.steps}
                      onChange={(e) => setParams(prev => ({ ...prev, steps: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Guidance: {params.guidance}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={params.guidance}
                      onChange={(e) => setParams(prev => ({ ...prev, guidance: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generar Imagen</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Preview */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Vista Previa</h3>
              {generatedImage && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </motion.button>
              )}
            </div>

            <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
              {isGenerating ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">Creando tu obra maestra...</p>
                    <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
                      <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Tu imagen generada aparecerá aquí</p>
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