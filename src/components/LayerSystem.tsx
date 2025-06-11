
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, X, Eye, EyeOff, Move, Copy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DITHER_ALGORITHMS } from '@/utils/ditherAlgorithms';

export interface EffectLayer {
  id: string;
  name: string;
  algorithm: string;
  opacity: number;
  isVisible: boolean;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  settings: {
    brightness: number;
    contrast: number;
    threshold: number;
    noiseLevel: number;
    saturation: number;
    posterize: number;
    blur: number;
  };
}

interface LayerSystemProps {
  layers: EffectLayer[];
  selectedLayerId: string | null;
  onLayersChange: (layers: EffectLayer[]) => void;
  onSelectedLayerChange: (layerId: string | null) => void;
}

const LayerSystem: React.FC<LayerSystemProps> = ({
  layers,
  selectedLayerId,
  onLayersChange,
  onSelectedLayerChange,
}) => {
  const addLayer = () => {
    const newLayer: EffectLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      algorithm: 'floyd-steinberg',
      opacity: 100,
      isVisible: true,
      blendMode: 'normal',
      settings: {
        brightness: 100,
        contrast: 100,
        threshold: 128,
        noiseLevel: 0,
        saturation: 100,
        posterize: 256,
        blur: 0,
      },
    };
    
    const newLayers = [...layers, newLayer];
    onLayersChange(newLayers);
    onSelectedLayerChange(newLayer.id);
  };

  const removeLayer = (layerId: string) => {
    const newLayers = layers.filter(layer => layer.id !== layerId);
    onLayersChange(newLayers);
    
    if (selectedLayerId === layerId) {
      onSelectedLayerChange(newLayers.length > 0 ? newLayers[0].id : null);
    }
  };

  const duplicateLayer = (layerId: string) => {
    const layerToDuplicate = layers.find(layer => layer.id === layerId);
    if (!layerToDuplicate) return;

    const duplicatedLayer: EffectLayer = {
      ...layerToDuplicate,
      id: `layer-${Date.now()}`,
      name: `${layerToDuplicate.name} Copy`,
    };

    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const newLayers = [...layers];
    newLayers.splice(layerIndex + 1, 0, duplicatedLayer);
    
    onLayersChange(newLayers);
    onSelectedLayerChange(duplicatedLayer.id);
  };

  const updateLayer = (layerId: string, updates: Partial<EffectLayer>) => {
    const newLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    onLayersChange(newLayers);
  };

  const moveLayer = (layerId: string, direction: 'up' | 'down') => {
    const currentIndex = layers.findIndex(layer => layer.id === layerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= layers.length) return;

    const newLayers = [...layers];
    [newLayers[currentIndex], newLayers[newIndex]] = [newLayers[newIndex], newLayers[currentIndex]];
    
    onLayersChange(newLayers);
  };

  return (
    <div className="space-y-3 bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-bold text-white font-mono">EFFECT LAYERS</h3>
        <Button
          onClick={addLayer}
          size="sm"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-mono text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          ADD
        </Button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              selectedLayerId === layer.id
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-gray-600 bg-gray-800/30'
            }`}
          >
            {/* Layer Header */}
            <div className="flex items-center justify-between mb-2">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectedLayerChange(layer.id)}
              >
                <div className="text-xs font-semibold text-white font-mono">
                  {layer.name}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {DITHER_ALGORITHMS.find(a => a.id === layer.algorithm)?.name || layer.algorithm}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateLayer(layer.id, { isVisible: !layer.isVisible })}
                  className="w-6 h-6 p-0"
                >
                  {layer.isVisible ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3 opacity-50" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicateLayer(layer.id)}
                  className="w-6 h-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                
                <div className="flex flex-col">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveLayer(layer.id, 'up')}
                    disabled={index === 0}
                    className="w-4 h-3 p-0 text-xs"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveLayer(layer.id, 'down')}
                    disabled={index === layers.length - 1}
                    className="w-4 h-3 p-0 text-xs"
                  >
                    ↓
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLayer(layer.id)}
                  disabled={layers.length <= 1}
                  className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Layer Controls - Only show for selected layer */}
            {selectedLayerId === layer.id && (
              <div className="space-y-3">
                {/* Algorithm Selection */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-400 font-mono mb-1">
                    ALGORITHM
                  </label>
                  <Select
                    value={layer.algorithm}
                    onValueChange={(value) => updateLayer(layer.id, { algorithm: value })}
                  >
                    <SelectTrigger className="text-xs font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DITHER_ALGORITHMS.map(algorithm => (
                        <SelectItem key={algorithm.id} value={algorithm.id} className="font-mono text-xs">
                          {algorithm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-400 font-mono mb-1">
                    OPACITY: {layer.opacity}%
                  </label>
                  <Slider
                    value={[layer.opacity]}
                    onValueChange={(value) => updateLayer(layer.id, { opacity: value[0] })}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Blend Mode */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-400 font-mono mb-1">
                    BLEND MODE
                  </label>
                  <Select
                    value={layer.blendMode}
                    onValueChange={(value: any) => updateLayer(layer.id, { blendMode: value })}
                  >
                    <SelectTrigger className="text-xs font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="font-mono text-xs">Normal</SelectItem>
                      <SelectItem value="multiply" className="font-mono text-xs">Multiply</SelectItem>
                      <SelectItem value="screen" className="font-mono text-xs">Screen</SelectItem>
                      <SelectItem value="overlay" className="font-mono text-xs">Overlay</SelectItem>
                      <SelectItem value="soft-light" className="font-mono text-xs">Soft Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {layers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 font-mono text-sm mb-3">No layers yet</div>
          <Button
            onClick={addLayer}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono text-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREATE FIRST LAYER
          </Button>
        </div>
      )}
    </div>
  );
};

export default LayerSystem;
