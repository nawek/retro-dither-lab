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
};

export default Index;
