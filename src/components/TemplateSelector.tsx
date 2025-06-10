import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Gamepad2, Tv, Camera, Zap, Sparkles, Shuffle, Monitor, Eye, Cpu, Glitch, Blocks, Grid3X3, Move, Scan } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: {
    algorithm: string;
    brightness: number;
    contrast: number;
    threshold: number;
    noiseLevel: number;
    saturation?: number;
    posterize?: number;
    blur?: number;
  };
  availableControls: string[];
  category: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const iconComponents = {
  Palette: Palette,
  Gamepad2: Gamepad2,
  Tv: Tv,
  Camera: Camera,
  Zap: Zap,
  Sparkles: Sparkles,
  Shuffle: Shuffle,
  Monitor: Monitor,
  Eye: Eye,
  Cpu: Cpu,
  Glitch: Glitch,
  Blocks: Blocks,
  Grid3X3: Grid3X3,
  Move: Move,
  Scan: Scan,
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateChange,
}) => {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  const getIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Palette className="w-4 h-4" />;
  };

  return (
    <div className="space-y-3 bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
      <h3 className="text-md font-bold text-white font-mono mb-3">STYLE TEMPLATES</h3>
      
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 gap-1">
            {templates
              .filter(t => t.category === category)
              .map(template => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className={`text-left justify-start h-auto p-2 font-mono transition-all duration-200 text-xs ${
                    selectedTemplate === template.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400'
                      : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-cyan-500 hover:bg-gray-700/50'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-cyan-400 flex-shrink-0">
                      {getIcon(template.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs leading-tight">{template.name}</div>
                      <div className="text-xs opacity-75 leading-tight truncate">{template.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
