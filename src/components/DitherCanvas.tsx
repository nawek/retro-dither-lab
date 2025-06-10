
import React, { useRef, useEffect, useState } from 'react';

interface DitherCanvasProps {
  imageData: ImageData | null;
  width: number;
  height: number;
}

const DitherCanvas: React.FC<DitherCanvasProps> = ({ imageData, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);
    
    // Create a small delay to show processing state
    requestAnimationFrame(() => {
      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
    });
  }, [imageData]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-cyan-400 font-mono text-sm animate-pulse">
            PROCESSING...
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full max-h-full object-contain"
        style={{
          imageRendering: 'pixelated',
          filter: 'contrast(1.1) brightness(1.05)',
        }}
      />
      
      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)',
        }}
      />
    </div>
  );
};

export default DitherCanvas;
