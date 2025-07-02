import React, { useState } from 'react';
import { Palette, Download, Wand2, Settings, Loader } from 'lucide-react';
import { ImageGenerationParams } from '../types';
import { AIService } from '../services/aiService';

interface ImageGeneratorProps {
  onNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onNotification }) => {
  const [params, setParams] = useState<ImageGenerationParams>({
    prompt: '',
    style: 'realistic',
    size: '512x512',
    mood: 'neutral'
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      onNotification('Input Required', 'Please enter a description for your image', 'warning');
      return;
    }

    setIsGenerating(true);
    onNotification('Generation Started', 'Creating your image...', 'info');

    try {
      const imageUrl = await AIService.generateImage(params.prompt, params);
      setGeneratedImage(imageUrl);
      onNotification('Image Ready', 'Your image has been generated successfully!', 'success');
    } catch (error) {
      onNotification('Generation Failed', 'Failed to generate image', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `gaspers-gpt-${Date.now()}.jpg`;
      link.click();
      onNotification('Download Started', 'Image download initiated', 'success');
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 p-6">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Image Generator</h2>
          <p className="text-gray-600 dark:text-gray-300">Create stunning images from your imagination</p>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Describe your image
              </label>
              <textarea
                value={params.prompt}
                onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="A serene landscape with mountains and a lake at sunset..."
                rows={4}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Quick Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Style & Settings</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
                >
                  {showAdvanced ? 'Simple' : 'Advanced'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Style</label>
                  <select
                    value={params.style}
                    onChange={(e) => setParams(prev => ({ ...prev, style: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="artistic">Artistic</option>
                    <option value="abstract">Abstract</option>
                    <option value="cartoon">Cartoon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Size</label>
                  <select
                    value={params.size}
                    onChange={(e) => setParams(prev => ({ ...prev, size: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="256x256">Small (256×256)</option>
                    <option value="512x512">Medium (512×512)</option>
                    <option value="1024x1024">Large (1024×1024)</option>
                  </select>
                </div>
              </div>

              {showAdvanced && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Mood</label>
                  <div className="flex space-x-2">
                    {['bright', 'neutral', 'dark'].map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setParams(prev => ({ ...prev, mood: mood as any }))}
                        className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                          params.mood === mood
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !params.prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Preview</h3>
              {generatedImage && (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              {isGenerating ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Creating your masterpiece...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated image will appear here</p>
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