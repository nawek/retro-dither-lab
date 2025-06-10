import React, { useState, useCallback, useRef, useMemo } from 'react';
import ImageUploader from '@/components/ImageUploader';
import DitherCanvas from '@/components/DitherCanvas';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import ControlPanel from '@/components/ControlPanel';
import TemplateSelector from '@/components/TemplateSelector';
import { DITHER_ALGORITHMS, applyDither } from '@/utils/ditherAlgorithms';
import { TEMPLATES } from '@/utils/templates';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [ditheredImageData, setDitheredImageData] = useState<ImageData | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('floyd-steinberg');
  const [selectedTemplate, setSelectedTemplate] = useState('classic-1bit');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [threshold, setThreshold] = useState(128);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [posterize, setPosterize] = useState(256);
  const [blur, setBlur] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  // Debounced processing function for real-time updates
  const debouncedProcessImage = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (
      imageData: ImageData,
      algorithm: string,
      brightness: number,
      contrast: number,
      threshold: number,
      noiseLevel: number,
      saturation: number,
      posterize: number,
      blur: number
    ) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        setIsProcessing(true);
        
        requestAnimationFrame(() => {
          try {
            const processed = applyDither(imageData, algorithm, brightness, contrast, threshold, noiseLevel, saturation, posterize, blur);
            setDitheredImageData(processed);
          } catch (error) {
            console.error('Error processing image:', error);
            toast({
              title: "Processing Error",
              description: "Failed to apply dithering effect. Please try again.",
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
    setSelectedAlgorithm(template.defaultSettings.algorithm);
    setBrightness(template.defaultSettings.brightness);
    setContrast(template.defaultSettings.contrast);
    setThreshold(template.defaultSettings.threshold);
    setNoiseLevel(template.defaultSettings.noiseLevel);
    setSaturation(template.defaultSettings.saturation || 100);
    setPosterize(template.defaultSettings.posterize || 256);
    setBlur(template.defaultSettings.blur || 0);
    
    toast({
      title: "Template Applied!",
      description: `Switched to ${template.name} preset`,
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
      
      // Process immediately with current settings
      debouncedProcessImage(imageData, selectedAlgorithm, brightness, contrast, threshold, noiseLevel, saturation, posterize, blur);
      
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
  }, [selectedAlgorithm, brightness, contrast, threshold, noiseLevel, saturation, posterize, blur, debouncedProcessImage, toast]);

  const handleRandomize = useCallback(() => {
    const randomAlgorithm = DITHER_ALGORITHMS[Math.floor(Math.random() * DITHER_ALGORITHMS.length)];
    const newBrightness = Math.floor(Math.random() * 100) + 50; // 50-150
    const newContrast = Math.floor(Math.random() * 100) + 50; // 50-150
    const newThreshold = Math.floor(Math.random() * 200) + 50; // 50-250
    const newNoiseLevel = Math.floor(Math.random() * 30); // 0-30
    const newSaturation = Math.floor(Math.random() * 100) + 50; // 50-150
    const newPosterize = Math.floor(Math.random() * 256); // 0-256
    const newBlur = Math.floor(Math.random() * 10); // 0-10
    
    setSelectedAlgorithm(randomAlgorithm.id);
    setBrightness(newBrightness);
    setContrast(newContrast);
    setThreshold(newThreshold);
    setNoiseLevel(newNoiseLevel);
    setSaturation(newSaturation);
    setPosterize(newPosterize);
    setBlur(newBlur);
    
    toast({
      title: "Settings Randomized!",
      description: `Applied ${randomAlgorithm.name} with random settings`,
    });
  }, [toast]);

  const handleReset = useCallback(() => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    if (template) {
      setBrightness(template.defaultSettings.brightness);
      setContrast(template.defaultSettings.contrast);
      setThreshold(template.defaultSettings.threshold);
      setNoiseLevel(template.defaultSettings.noiseLevel);
      setSaturation(template.defaultSettings.saturation || 100);
      setPosterize(template.defaultSettings.posterize || 256);
      setBlur(template.defaultSettings.blur || 0);
      setSelectedAlgorithm(template.defaultSettings.algorithm);
    }
    
    toast({
      title: "Settings Reset",
      description: "All parameters restored to template defaults",
    });
  }, [selectedTemplate, toast]);

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
      a.download = `dithered-${selectedAlgorithm}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete!",
        description: "Your dithered image has been downloaded",
      });
    }, 'image/png');
  }, [ditheredImageData, selectedAlgorithm, toast]);

  // Process image when parameters change
  React.useEffect(() => {
    if (originalImageData) {
      debouncedProcessImage(originalImageData, selectedAlgorithm, brightness, contrast, threshold, noiseLevel, saturation, posterize, blur);
    }
  }, [originalImageData, selectedAlgorithm, brightness, contrast, threshold, noiseLevel, saturation, posterize, blur, debouncedProcessImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DITHER BOY
                </h1>
                <p className="text-gray-400 text-sm font-mono">
                  RETRO PIXEL ART GENERATOR
                </p>
              </div>
            </div>
            
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 font-mono text-sm">LIVE PROCESSING...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-6">
            <TemplateSelector
              templates={TEMPLATES}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
            
            <AlgorithmSelector
              algorithms={DITHER_ALGORITHMS}
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
            />
            
            <ControlPanel
              brightness={brightness}
              contrast={contrast}
              threshold={threshold}
              noiseLevel={noiseLevel}
              saturation={saturation}
              posterize={posterize}
              blur={blur}
              onBrightnessChange={setBrightness}
              onContrastChange={setContrast}
              onThresholdChange={setThreshold}
              onNoiseLevelChange={setNoiseLevel}
              onSaturationChange={setSaturation}
              onPosterizeChange={setPosterize}
              onBlurChange={setBlur}
              onRandomize={handleRandomize}
              onReset={handleReset}
              onExport={handleExport}
              canExport={!!ditheredImageData}
              isProcessing={isProcessing}
              availableControls={currentTemplate?.availableControls || ['brightness', 'contrast', 'threshold', 'noiseLevel']}
            />
          </div>

          {/* Right Column - Image Area */}
          <div className="xl:col-span-3">
            {!originalImage ? (
              <ImageUploader
                onImageUpload={handleImageUpload}
                isDragActive={isDragActive}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
              />
            ) : (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-mono text-cyan-400">
                      LIVE PREVIEW
                    </h3>
                    <div className="flex items-center space-x-4">
                      {ditheredImageData && (
                        <span className="text-gray-400 font-mono text-sm">
                          {ditheredImageData.width}×{ditheredImageData.height}
                        </span>
                      )}
                      {isProcessing && (
                        <div className="text-cyan-400 font-mono text-sm animate-pulse">
                          UPDATING...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    {ditheredImageData ? (
                      <DitherCanvas
                        imageData={ditheredImageData}
                        width={ditheredImageData.width}
                        height={ditheredImageData.height}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500 font-mono animate-pulse">
                          PROCESSING IMAGE...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload New Image Button */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      setOriginalImageData(null);
                      setDitheredImageData(null);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-mono font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    UPLOAD NEW IMAGE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center text-gray-500 font-mono text-sm">
            <p>DITHER BOY v1.0 - TRANSFORM YOUR IMAGES INTO RETRO PIXEL ART</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
