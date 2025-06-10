
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Download, Shuffle } from 'lucide-react';

interface ControlPanelProps {
  brightness: number;
  contrast: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onRandomize: () => void;
  onExport: () => void;
  canExport: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
  onRandomize,
  onExport,
  canExport,
}) => {
  return (
    <div className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white font-mono mb-4">
        EFFECT CONTROLS
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-cyan-400 font-mono mb-2">
            BRIGHTNESS: {brightness}%
          </label>
          <Slider
            value={[brightness]}
            onValueChange={(value) => onBrightnessChange(value[0])}
            min={0}
            max={200}
            step={1}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-cyan-400 font-mono mb-2">
            CONTRAST: {contrast}%
          </label>
          <Slider
            value={[contrast]}
            onValueChange={(value) => onContrastChange(value[0])}
            min={0}
            max={200}
            step={1}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <Button
          onClick={onRandomize}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-mono font-bold"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          RANDOMIZE
        </Button>
        
        <Button
          onClick={onExport}
          disabled={!canExport}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold"
        >
          <Download className="w-4 h-4 mr-2" />
          EXPORT PNG
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
