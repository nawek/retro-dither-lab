
import React, { useCallback } from 'react';
import { Upload, Image } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isDragActive: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  isDragActive,
  onDragEnter,
  onDragLeave,
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave();
    
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      onImageUpload(files[0]);
    }
  }, [onImageUpload, onDragLeave]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl transition-all duration-500 ease-bounce-out ${
        isDragActive
          ? 'border-primary bg-primary/10 scale-[1.02] shadow-glow-cyan'
          : 'border-border/50 hover:border-primary/50 hover:shadow-elegant'
      } bg-gradient-panel backdrop-blur-xl`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="flex flex-col items-center justify-center p-16">
        <div className="mb-6 relative">
          <div className={`transition-all duration-500 ${
            isDragActive ? 'scale-125 rotate-12' : 'scale-100'
          }`}>
            <Upload className={`w-20 h-20 transition-all duration-300 ${
              isDragActive ? 'text-primary animate-glow-pulse' : 'text-muted-foreground'
            }`} />
          </div>
          {isDragActive && (
            <div className="absolute -inset-4 border-2 border-primary rounded-full animate-ping opacity-50" />
          )}
        </div>
        
        <h3 className="text-2xl font-black text-foreground mb-2 font-mono uppercase tracking-wide">
          Drop Your Image
        </h3>
        
        <p className="text-muted-foreground text-center mb-8 font-mono text-sm max-w-md">
          Drag & drop your image or click to browse
          <br />
          <span className="text-primary font-bold">PNG, JPG, WEBP • Max 10MB</span>
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <button className="group relative px-8 py-4 bg-gradient-cyber text-primary-foreground font-mono font-black rounded-xl hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center space-x-3">
            <Image className="w-5 h-5" />
            <span className="uppercase tracking-wider">Select Image</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
