
import React from 'react';
import { Button } from '@/components/ui/button';

export interface DitherAlgorithm {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface AlgorithmSelectorProps {
  algorithms: DitherAlgorithm[];
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithmId: string) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
}) => {
  const categories = Array.from(new Set(algorithms.map(alg => alg.category)));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white font-mono mb-4">
        DITHER ALGORITHMS
      </h3>
      
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-semibold text-cyan-400 font-mono uppercase tracking-wider">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {algorithms
              .filter(alg => alg.category === category)
              .map(algorithm => (
                <Button
                  key={algorithm.id}
                  variant={selectedAlgorithm === algorithm.id ? "default" : "outline"}
                  className={`text-left justify-start h-auto p-3 font-mono transition-all duration-200 ${
                    selectedAlgorithm === algorithm.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400'
                      : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-cyan-500 hover:bg-gray-700/50'
                  }`}
                  onClick={() => onAlgorithmChange(algorithm.id)}
                >
                  <div>
                    <div className="font-semibold text-sm">{algorithm.name}</div>
                    <div className="text-xs opacity-75 mt-1">{algorithm.description}</div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlgorithmSelector;
