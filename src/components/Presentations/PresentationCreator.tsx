import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation, Download, Play, FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import { AIService } from '../../services/aiService';
import toast from 'react-hot-toast';

export const PresentationCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Por favor ingresa un tema');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedSlides = await AIService.generatePresentation(topic, slideCount);
      setSlides(generatedSlides);
      setCurrentSlide(0);
      toast.success('¡Presentación generada exitosamente!');
    } catch (error) {
      toast.error('Error al generar la presentación');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlideEdit = (index: number, field: string, value: string) => {
    setSlides(prev => prev.map((slide, i) => 
      i === index ? { ...slide, [field]: value } : slide
    ));
  };

  const addSlide = () => {
    const newSlide = {
      id: `slide-${slides.length + 1}`,
      title: 'Nueva Diapositiva',
      content: 'Contenido de la diapositiva...',
      layout: 'content'
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const deleteSlide = (index: number) => {
    if (slides.length > 1) {
      setSlides(prev => prev.filter((_, i) => i !== index));
      if (currentSlide >= slides.length - 1) {
        setCurrentSlide(Math.max(0, slides.length - 2));
      }
    }
  };

  const exportPresentation = () => {
    const content = slides.map(slide => 
      `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic || 'presentacion'}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Presentación exportada');
  };

  if (presentationMode && slides.length > 0) {
    return (
      <div className="h-full bg-black flex flex-col">
        {/* Presentation Controls */}
        <div className="bg-gray-900/50 backdrop-blur-xl p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPresentationMode(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Salir
            </button>
            <span className="text-white">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Current Slide */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-2xl p-12 max-w-4xl w-full shadow-2xl"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              {slides[currentSlide]?.title}
            </h1>
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {slides[currentSlide]?.content}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black p-6">
      <div className="max-w-6xl mx-auto h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4"
          >
            <Presentation className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Creador de Presentaciones</h1>
          <p className="text-gray-400">Genera presentaciones profesionales con IA</p>
        </div>

        {slides.length === 0 ? (
          /* Generation Form */
          <div className="flex items-center justify-center h-[calc(100%-200px)]">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 max-w-md w-full">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tema de la presentación
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ej. Inteligencia Artificial en el Futuro"
                    className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Número de diapositivas: {slideCount}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Generar Presentación</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          /* Slide Editor */
          <div className="grid lg:grid-cols-4 gap-6 h-[calc(100%-200px)]">
            {/* Slide List */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Diapositivas</h3>
                <button
                  onClick={addSlide}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all group ${
                      currentSlide === index
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{slide.title}</p>
                        <p className="text-xs opacity-70">Slide {index + 1}</p>
                      </div>
                      {slides.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                <button
                  onClick={() => setPresentationMode(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Presentar</span>
                </button>
                <button
                  onClick={exportPresentation}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>

            {/* Slide Editor */}
            <div className="lg:col-span-3 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              {slides[currentSlide] && (
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <input
                      type="text"
                      value={slides[currentSlide].title}
                      onChange={(e) => handleSlideEdit(currentSlide, 'title', e.target.value)}
                      className="text-2xl font-bold w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Título de la diapositiva"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      value={slides[currentSlide].content}
                      onChange={(e) => handleSlideEdit(currentSlide, 'content', e.target.value)}
                      className="w-full h-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Contenido de la diapositiva..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};