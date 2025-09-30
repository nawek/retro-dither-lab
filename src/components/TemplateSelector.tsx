import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Gamepad2, Tv, Camera, Zap, Sparkles, Shuffle, Monitor, Eye, Cpu, Blocks, Grid3X3, Move, Scan } from 'lucide-react';

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
    <div className="space-y-3 bg-gradient-panel backdrop-blur-xl p-5 rounded-xl border border-border/50 shadow-elegant">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">
          Style Templates
        </h3>
        <div className="h-2 w-2 bg-accent rounded-full animate-glow-pulse" />
      </div>
      
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-bold text-primary font-mono uppercase tracking-wider px-2 py-1 bg-primary/10 rounded-md inline-block">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {templates
              .filter(t => t.category === category)
              .map(template => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className={`group text-left justify-start h-auto p-3 font-mono transition-all duration-300 text-xs relative overflow-hidden ${
                    selectedTemplate === template.id
                      ? 'bg-gradient-cyber text-primary-foreground border-primary shadow-glow-cyan'
                      : 'bg-card/30 text-foreground border-border/50 hover:border-primary/50 hover:bg-card/50 hover:shadow-elegant'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                >
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-gradient-neon opacity-20 animate-shimmer" 
                         style={{ backgroundSize: '200% 100%' }} />
                  )}
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      selectedTemplate === template.id 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-primary/20 group-hover:bg-primary/30'
                    } transition-colors duration-300`}>
                      {getIcon(template.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs leading-tight mb-1">{template.name}</div>
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
