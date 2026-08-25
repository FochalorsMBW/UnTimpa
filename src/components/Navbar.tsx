import React from 'react';
import { 
  RotateCcw,
  Shield
} from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, hasResult }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 text-zinc-100 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-zinc-100 text-sm tracking-tight">
              Forensik Dokumen
            </span>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Deteksi Keaslian Citra
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasResult && (
            <button
              id="btn-reset-scan"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analisis Baru</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};


