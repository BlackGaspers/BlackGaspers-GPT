import React, { useState } from 'react';
import { Presentation, Download, Play, FileText, Loader, Plus, Trash2 } from 'lucide-react';
import { PresentationSlide } from '../types';
import { AIService } from '../services/aiService';

interface PresentationGeneratorProps {
  onNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const PresentationGenerator: React.FC<PresentationGeneratorProps> = ({ onNotification }) => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotification('Input Required', 'Please enter a topic for your presentation', 'warning');
      return;
    }

    setIsGenerating(true);
    onNotification('Generation Started', 'Creating your presentation...', 'info');

    try {
      const generatedSlides = await AIService.generatePresentation(topic, slideCount);
      setSlides(generatedSlides);
      setCurrentSlide(0);
      onNotification('Presentation Ready', 'Your presentation has been generated successfully!', 'success');
    } catch (error) {
      onNotification('Generation Failed', 'Failed to generate presentation', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlideEdit = (index: number, field: 'title' | 'content', value: string) => {
    setSlides(prev => prev.map((slide, i) => 
      i === index ? { ...slide, [field]: value } : slide
    ));
  };

  const addSlide = () => {
    const newSlide: PresentationSlide = {
      id: (slides.length + 1).toString(),
      title: 'New Slide',
      content: 'Add your content here...',
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
      `Slide ${slide.id}: ${slide.title}\n${slide.content}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic || 'presentation'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    onNotification('Export Complete', 'Presentation exported successfully', 'success');
  };

  if (presentationMode && slides.length > 0) {
    return (
      <div className="h-full bg-black flex flex-col">
        {/* Presentation Controls */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPresentationMode(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Exit
            </button>
            <span className="text-white">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Current Slide */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl p-12 max-w-4xl w-full shadow-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              {slides[currentSlide].title}
            </h1>
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {slides[currentSlide].content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Presentation className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Presentation Generator</h2>
          <p className="text-gray-600 dark:text-gray-300">Create professional presentations with AI</p>
        </div>

        {slides.length === 0 ? (
          /* Generation Form */
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Presentation Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Climate Change Solutions"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Number of Slides
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={slideCount}
                      onChange={(e) => setSlideCount(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[3rem] text-center">
                      {slideCount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Generate Presentation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Slide Editor */
          <div className="flex-1 grid lg:grid-cols-4 gap-6">
            {/* Slide List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Slides</h3>
                <button
                  onClick={addSlide}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                  onClick={() => setPresentationMode(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Present</span>
                </button>
                <button
                  onClick={exportPresentation}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Slide Editor */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              {slides[currentSlide] && (
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <input
                      type="text"
                      value={slides[currentSlide].title}
                      onChange={(e) => handleSlideEdit(currentSlide, 'title', e.target.value)}
                      className="text-2xl font-bold w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Slide Title"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      value={slides[currentSlide].content}
                      onChange={(e) => handleSlideEdit(currentSlide, 'content', e.target.value)}
                      className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Slide content..."
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