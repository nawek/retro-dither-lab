
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
    <div className="relative bg-card/30 rounded-2xl overflow-hidden border border-border/50 shadow-elegant backdrop-blur-sm">
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex space-x-1">
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="h-3 w-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="text-primary font-mono text-xs font-bold animate-pulse uppercase tracking-wider">
              Processing...
            </div>
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
        }}
      />
      
      {/* Subtle scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary)) 2px, hsl(var(--primary)) 3px)',
        }}
      />
    </div>
  );
};

export default DitherCanvas;
