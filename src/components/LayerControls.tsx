
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { EffectLayer } from './LayerSystem';

interface LayerControlsProps {
  layer: EffectLayer | null;
  onLayerUpdate: (layerId: string, updates: Partial<EffectLayer>) => void;
  isProcessing: boolean;
  availableControls: string[];
}

const LayerControls: React.FC<LayerControlsProps> = ({
  layer,
  onLayerUpdate,
  isProcessing,
  availableControls,
}) => {
  if (!layer) {
    return (
      <div className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold text-white font-mono mb-4">
          LAYER CONTROLS
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 font-mono text-sm">No layer selected</div>
        </div>
      </div>
    );
  }

  const updateSetting = (key: string, value: number) => {
    onLayerUpdate(layer.id, {
      settings: {
        ...layer.settings,
        [key]: value,
      },
    });
  };

  const controlComponents = {
    brightness: (
      <div key="brightness" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          BRIGHTNESS: {layer.settings.brightness}%
        </label>
        <Slider
          value={[layer.settings.brightness]}
          onValueChange={(value) => updateSetting('brightness', value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    contrast: (
      <div key="contrast" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          CONTRAST: {layer.settings.contrast}%
        </label>
        <Slider
          value={[layer.settings.contrast]}
          onValueChange={(value) => updateSetting('contrast', value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    threshold: (
      <div key="threshold" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          THRESHOLD: {layer.settings.threshold}
        </label>
        <Slider
          value={[layer.settings.threshold]}
          onValueChange={(value) => updateSetting('threshold', value[0])}
          min={0}
          max={255}
          step={1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    noiseLevel: (
      <div key="noiseLevel" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          NOISE: {layer.settings.noiseLevel}%
        </label>
        <Slider
          value={[layer.settings.noiseLevel]}
          onValueChange={(value) => updateSetting('noiseLevel', value[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    saturation: (
      <div key="saturation" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          SATURATION: {layer.settings.saturation}%
        </label>
        <Slider
          value={[layer.settings.saturation]}
          onValueChange={(value) => updateSetting('saturation', value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    posterize: (
      <div key="posterize" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          COLORS: {layer.settings.posterize}
        </label>
        <Slider
          value={[layer.settings.posterize]}
          onValueChange={(value) => updateSetting('posterize', value[0])}
          min={2}
          max={256}
          step={2}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    blur: (
      <div key="blur" className="animate-slide-in-up">
        <label className="block text-xs font-bold text-primary font-mono mb-2">
          BLUR: {layer.settings.blur.toFixed(1)}px
        </label>
        <Slider
          value={[layer.settings.blur]}
          onValueChange={(value) => updateSetting('blur', value[0])}
          min={0}
          max={10}
          step={0.1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    )
  };

  return (
    <div className="space-y-4 bg-gradient-panel backdrop-blur-xl p-5 rounded-xl border border-border/50 shadow-elegant">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">
          Layer Controls
        </h3>
        <div className="h-2 w-2 bg-primary rounded-full animate-glow-pulse" />
      </div>
      
      <div className="px-3 py-2 bg-card/50 rounded-lg border border-primary/20">
        <div className="text-xs font-bold text-primary font-mono">
          {layer.name}
        </div>
      </div>
      
      <div className="space-y-4">
        {availableControls.map(control => controlComponents[control] || null)}
      </div>
    </div>
  );
};

export default LayerControls;
