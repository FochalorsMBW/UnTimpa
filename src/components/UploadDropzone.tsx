import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface UploadDropzoneProps {
  onImageSelected: (base64: string, fileInfo: { name: string; size: number; mimeType: string }) => void;
  isAnalyzing: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onImageSelected,
  isAnalyzing
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Format berkas tidak didukung. Mohon unggah format citra PNG, JPG, JPEG, atau WEBP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelected(base64, {
        name: file.name,
        size: file.size,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Clipboard paste (Ctrl+V) listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFile(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-6">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          Uji Keaslian Dokumen
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
          Unggah dokumen atau gambar untuk mendeteksi suntingan teks, manipulasi stempel, dan penimpaan raster.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        id="dropzone-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border border-dashed rounded-xl p-10 sm:p-14 transition-all cursor-pointer text-center bg-zinc-900/50 hover:bg-zinc-900/80 ${
          isDragOver
            ? 'border-emerald-400 bg-zinc-850'
            : 'border-zinc-750 hover:border-zinc-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-5 h-5 text-emerald-400" />
        </div>

        <h3 className="text-base font-medium text-zinc-200">
          Tarik &amp; letakkan citra ke sini, atau <span className="text-emerald-400 hover:underline">pilih file</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-2">
          PNG, JPG, WEBP &bull; Mendukung paste langsung (<kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-[10px]">Ctrl+V</kbd>)
        </p>
      </div>

    </div>
  );
};


