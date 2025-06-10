
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Gamepad2, Tv, Camera, Zap, Sparkles } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
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

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateChange,
}) => {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-4 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white font-mono mb-4">
        STYLE TEMPLATES
      </h3>
      
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-semibold text-cyan-400 font-mono uppercase tracking-wider">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {templates
              .filter(t => t.category === category)
              .map(template => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className={`text-left justify-start h-auto p-3 font-mono transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400'
                      : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-cyan-500 hover:bg-gray-700/50'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-cyan-400">
                      {template.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{template.name}</div>
                      <div className="text-xs opacity-75 mt-1">{template.description}</div>
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
