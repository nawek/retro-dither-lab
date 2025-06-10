
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
      className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
        isDragActive
          ? 'border-cyan-400 bg-cyan-400/10 scale-105'
          : 'border-gray-600 hover:border-cyan-500'
      } bg-gray-900/50 backdrop-blur-sm`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="flex flex-col items-center justify-center p-12">
        <div className="mb-4 relative">
          <Upload className={`w-16 h-16 transition-all duration-300 ${
            isDragActive ? 'text-cyan-400 animate-pulse' : 'text-gray-400'
          }`} />
          {isDragActive && (
            <div className="absolute -inset-2 border-2 border-cyan-400 rounded-full animate-ping" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 font-mono">
          DROP YOUR IMAGE HERE
        </h3>
        
        <p className="text-gray-400 text-center mb-6 font-mono text-sm">
          Drag & drop your image or click to browse
          <br />
          <span className="text-cyan-400">PNG, JPG, WEBP supported</span>
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-mono font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <Image className="inline w-5 h-5 mr-2" />
          SELECT IMAGE
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
