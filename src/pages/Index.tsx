import React, { useState, useCallback, useRef, useMemo } from 'react';
import ImageUploader from '@/components/ImageUploader';
import DitherCanvas from '@/components/DitherCanvas';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import TemplateSelector from '@/components/TemplateSelector';
import LayerSystem, { EffectLayer } from '@/components/LayerSystem';
import LayerControls from '@/components/LayerControls';
import { DITHER_ALGORITHMS, applyDither } from '@/utils/ditherAlgorithms';
import { TEMPLATES } from '@/utils/templates';
import { processLayers } from '@/utils/layerProcessor';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, Shuffle, RotateCcw, Layers } from 'lucide-react';

const Index = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [ditheredImageData, setDitheredImageData] = useState<ImageData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic-1bit');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'layers'>('templates');
  
  // Layer system state
  const [layers, setLayers] = useState<EffectLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);
  const selectedLayer = layers.find(layer => layer.id === selectedLayerId) || null;

  // Debounced processing function for real-time updates
  const debouncedProcessImage = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (imageData: ImageData, layers: EffectLayer[]) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        setIsProcessing(true);
        
        requestAnimationFrame(() => {
          try {
            const processed = processLayers(imageData, layers);
            setDitheredImageData(processed);
          } catch (error) {
            console.error('Error processing image:', error);
            toast({
              title: "Processing Error",
              description: "Failed to apply layer effects. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        });
      }, 100);
    };
  }, [toast]);

  const handleTemplateChange = useCallback((templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    setSelectedTemplate(templateId);
    
    // Create a new layer based on the template
    const newLayer: EffectLayer = {
      id: `layer-${Date.now()}`,
      name: template.name,
      algorithm: template.defaultSettings.algorithm,
      opacity: 100,
      isVisible: true,
      blendMode: 'normal',
      settings: {
        brightness: template.defaultSettings.brightness,
        contrast: template.defaultSettings.contrast,
        threshold: template.defaultSettings.threshold,
        noiseLevel: template.defaultSettings.noiseLevel,
        saturation: template.defaultSettings.saturation || 100,
        posterize: template.defaultSettings.posterize || 256,
        blur: template.defaultSettings.blur || 0,
      },
    };
    
    setLayers([newLayer]);
    setSelectedLayerId(newLayer.id);
    setActiveTab('layers');
    
    toast({
      title: "Template Applied!",
      description: `Created new layer with ${template.name} preset`,
    });
  }, [toast]);

  const handleImageUpload = useCallback((file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Limit canvas size for performance but keep quality
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      
      setOriginalImage(img);
      setOriginalImageData(imageData);
      setDitheredImageData(null);
      
      // Process immediately with current layers
      if (layers.length > 0) {
        debouncedProcessImage(imageData, layers);
      }
      
      toast({
        title: "Image Loaded",
        description: `Ready to dither! Resolution: ${Math.round(width)}×${Math.round(height)}`,
      });
    };
    
    img.onerror = () => {
      toast({
        title: "Upload Error",
        description: "Failed to load image. Please try a different file.",
        variant: "destructive",
      });
    };
    
    img.src = URL.createObjectURL(file);
  }, [layers, debouncedProcessImage, toast]);

  const handleLayersChange = useCallback((newLayers: EffectLayer[]) => {
    setLayers(newLayers);
    
    if (originalImageData) {
      debouncedProcessImage(originalImageData, newLayers);
    }
  }, [originalImageData, debouncedProcessImage]);

  const handleLayerUpdate = useCallback((layerId: string, updates: Partial<EffectLayer>) => {
    const newLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    setLayers(newLayers);
    
    if (originalImageData) {
      debouncedProcessImage(originalImageData, newLayers);
    }
  }, [layers, originalImageData, debouncedProcessImage]);

  const handleRandomize = useCallback(() => {
    if (!selectedLayer) return;
    
    const randomAlgorithm = DITHER_ALGORITHMS[Math.floor(Math.random() * DITHER_ALGORITHMS.length)];
    const updates = {
      algorithm: randomAlgorithm.id,
      settings: {
        ...selectedLayer.settings,
        brightness: Math.floor(Math.random() * 100) + 50,
        contrast: Math.floor(Math.random() * 100) + 50,
        threshold: Math.floor(Math.random() * 200) + 50,
        noiseLevel: Math.floor(Math.random() * 30),
        saturation: Math.floor(Math.random() * 100) + 50,
        posterize: Math.floor(Math.random() * 256),
        blur: Math.floor(Math.random() * 10),
      },
    };
    
    handleLayerUpdate(selectedLayer.id, updates);
    
    toast({
      title: "Layer Randomized!",
      description: `Applied ${randomAlgorithm.name} with random settings`,
    });
  }, [selectedLayer, handleLayerUpdate, toast]);

  const handleReset = useCallback(() => {
    if (!selectedLayer || !currentTemplate) return;
    
    const updates = {
      algorithm: currentTemplate.defaultSettings.algorithm,
      settings: {
        brightness: currentTemplate.defaultSettings.brightness,
        contrast: currentTemplate.defaultSettings.contrast,
        threshold: currentTemplate.defaultSettings.threshold,
        noiseLevel: currentTemplate.defaultSettings.noiseLevel,
        saturation: currentTemplate.defaultSettings.saturation || 100,
        posterize: currentTemplate.defaultSettings.posterize || 256,
        blur: currentTemplate.defaultSettings.blur || 0,
      },
    };
    
    handleLayerUpdate(selectedLayer.id, updates);
    
    toast({
      title: "Layer Reset",
      description: "Layer parameters restored to template defaults",
    });
  }, [selectedLayer, currentTemplate, handleLayerUpdate, toast]);

  const handleExport = useCallback(() => {
    if (!ditheredImageData) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = ditheredImageData.width;
    canvas.height = ditheredImageData.height;
    ctx.putImageData(ditheredImageData, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dithered-layers-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete!",
        description: "Your layered dithered image has been downloaded",
      });
    }, 'image/png');
  }, [ditheredImageData, toast]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm opacity-80"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold font-mono bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                DITHER BOY
              </h1>
              <p className="text-gray-400 text-xs font-mono">LAYERED PIXEL ART GENERATOR</p>
            </div>
          </div>
          
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-mono text-xs">PROCESSING...</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Fixed Height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed Width */}
        <div className="w-72 border-r border-gray-800 bg-gray-900/30 backdrop-blur-sm flex-shrink-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              {/* Tab Selector */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 px-3 py-2 text-xs font-mono rounded-md transition-all duration-200 ${
                    activeTab === 'templates'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  TEMPLATES
                </button>
                <button
                  onClick={() => setActiveTab('layers')}
                  className={`flex-1 px-3 py-2 text-xs font-mono rounded-md transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'layers'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3 mr-1" />
                  LAYERS
                </button>
              </div>

              {activeTab === 'templates' ? (
                <TemplateSelector
                  templates={TEMPLATES}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                />
              ) : (
                <LayerSystem
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  onLayersChange={handleLayersChange}
                  onSelectedLayerChange={setSelectedLayerId}
                />
              )}
              
              {activeTab === 'layers' && (
                <>
                  <LayerControls
                    layer={selectedLayer}
                    onLayerUpdate={handleLayerUpdate}
                    isProcessing={isProcessing}
                    availableControls={currentTemplate?.availableControls || ['brightness', 'contrast', 'threshold', 'noiseLevel']}
                  />
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                    <Button
                      onClick={handleReset}
                      disabled={isProcessing || !selectedLayer}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      RESET LAYER
                    </Button>
                    
                    <Button
                      onClick={handleRandomize}
                      disabled={isProcessing || !selectedLayer}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold text-xs"
                    >
                      <Shuffle className="w-3 h-3 mr-2" />
                      RANDOMIZE
                    </Button>
                    
                    <Button
                      onClick={handleExport}
                      disabled={!ditheredImageData || isProcessing}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold text-xs"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      {isProcessing ? 'PROCESSING...' : 'EXPORT PNG'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!originalImage ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <ImageUploader
                onImageUpload={handleImageUpload}
                isDragActive={isDragActive}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-3 overflow-hidden">
              {/* Image Preview Header */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h3 className="text-sm font-bold font-mono text-cyan-400">LIVE PREVIEW</h3>
                <div className="flex items-center space-x-3">
                  {ditheredImageData && (
                    <span className="text-gray-400 font-mono text-xs">
                      {ditheredImageData.width}×{ditheredImageData.height}
                    </span>
                  )}
                  {layers.length > 0 && (
                    <span className="text-cyan-400 font-mono text-xs">
                      {layers.filter(l => l.isVisible).length}/{layers.length} layers
                    </span>
                  )}
                  {isProcessing && (
                    <div className="text-cyan-400 font-mono text-xs animate-pulse">UPDATING...</div>
                  )}
                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      setOriginalImageData(null);
                      setDitheredImageData(null);
                      setLayers([]);
                      setSelectedLayerId(null);
                      setActiveTab('templates');
                    }}
                    className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-mono text-xs rounded transition-all duration-300"
                  >
                    NEW IMAGE
                  </button>
                </div>
              </div>
              
              {/* Image Container - Takes remaining space */}
              <div className="flex-1 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700 p-3 overflow-hidden flex items-center justify-center">
                {ditheredImageData ? (
                  <div className="max-w-full max-h-full overflow-auto">
                    <DitherCanvas
                      imageData={ditheredImageData}
                      width={ditheredImageData.width}
                      height={ditheredImageData.height}
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 font-mono animate-pulse text-sm">
                    {layers.length === 0 ? 'SELECT A TEMPLATE OR CREATE A LAYER...' : 'PROCESSING LAYERS...'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

</initial_code>
