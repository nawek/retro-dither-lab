
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
    <div className="space-y-3 bg-gradient-panel backdrop-blur-xl p-5 rounded-xl border border-border/50 shadow-elegant">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">
          Effect Layers
        </h3>
        <Button
          onClick={addLayer}
          size="sm"
          className="group bg-gradient-cyber hover:bg-gradient-neon text-primary-foreground font-mono text-xs font-bold shadow-glow-cyan hover:shadow-glow-purple transition-all duration-300"
        >
          <Plus className="w-3 h-3 mr-1 group-hover:rotate-90 transition-transform duration-300" />
          Add
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`group p-3 rounded-xl border transition-all duration-300 ${
              selectedLayerId === layer.id
                ? 'border-primary bg-primary/10 shadow-glow-cyan scale-[1.02]'
                : 'border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50 hover:shadow-elegant'
            }`}
          >
            {/* Layer Header */}
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectedLayerChange(layer.id)}
              >
                <div className="text-xs font-bold text-foreground font-mono flex items-center space-x-2">
                  <span>{layer.name}</span>
                  {!layer.isVisible && (
                    <span className="px-1 py-0.5 bg-muted/50 text-muted-foreground text-xs rounded">Hidden</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {DITHER_ALGORITHMS.find(a => a.id === layer.algorithm)?.name || layer.algorithm}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateLayer(layer.id, { isVisible: !layer.isVisible })}
                  className="w-7 h-7 p-0 hover:bg-primary/20 transition-colors"
                >
                  {layer.isVisible ? (
                    <Eye className="w-3 h-3 text-primary" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicateLayer(layer.id)}
                  className="w-7 h-7 p-0 hover:bg-accent/20 transition-colors"
                  title="Duplicate layer"
                >
                  <Copy className="w-3 h-3 text-accent" />
                </Button>
                
                <div className="flex flex-col space-y-0.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveLayer(layer.id, 'up')}
                    disabled={index === 0}
                    className="w-5 h-4 p-0 text-xs hover:bg-primary/20 disabled:opacity-30"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveLayer(layer.id, 'down')}
                    disabled={index === layers.length - 1}
                    className="w-5 h-4 p-0 text-xs hover:bg-primary/20 disabled:opacity-30"
                  >
                    ↓
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLayer(layer.id)}
                  disabled={layers.length <= 1}
                  className="w-7 h-7 p-0 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-30"
                  title="Delete layer"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Layer Controls - Only show for selected layer */}
            {selectedLayerId === layer.id && (
              <div className="space-y-3 pt-3 border-t border-border/30 animate-slide-in-up">
                {/* Algorithm Selection */}
                <div>
                  <label className="block text-xs font-bold text-primary font-mono mb-2">
                    Algorithm
                  </label>
                  <Select
                    value={layer.algorithm}
                    onValueChange={(value) => updateLayer(layer.id, { algorithm: value })}
                  >
                    <SelectTrigger className="text-xs font-mono h-9 bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {DITHER_ALGORITHMS.map(algorithm => (
                        <SelectItem 
                          key={algorithm.id} 
                          value={algorithm.id} 
                          className="font-mono text-xs hover:bg-primary/10 cursor-pointer"
                        >
                          {algorithm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs font-bold text-primary font-mono mb-2">
                    Opacity: {layer.opacity}%
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
                  <label className="block text-xs font-bold text-primary font-mono mb-2">
                    Blend Mode
                  </label>
                  <Select
                    value={layer.blendMode}
                    onValueChange={(value: any) => updateLayer(layer.id, { blendMode: value })}
                  >
                    <SelectTrigger className="text-xs font-mono h-9 bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="normal" className="font-mono text-xs hover:bg-primary/10">Normal</SelectItem>
                      <SelectItem value="multiply" className="font-mono text-xs hover:bg-primary/10">Multiply</SelectItem>
                      <SelectItem value="screen" className="font-mono text-xs hover:bg-primary/10">Screen</SelectItem>
                      <SelectItem value="overlay" className="font-mono text-xs hover:bg-primary/10">Overlay</SelectItem>
                      <SelectItem value="soft-light" className="font-mono text-xs hover:bg-primary/10">Soft Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {layers.length === 0 && (
        <div className="text-center py-12 animate-slide-in-up">
          <div className="text-muted-foreground font-mono text-sm mb-4">No layers yet</div>
          <Button
            onClick={addLayer}
            className="bg-gradient-cyber hover:bg-gradient-neon text-primary-foreground font-mono text-xs font-bold shadow-glow-cyan"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Layer
          </Button>
        </div>
      )}
    </div>
  );
};

export default LayerSystem;
