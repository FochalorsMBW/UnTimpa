import React from 'react';
import { 
  ShieldCheck, 
  FileSearch,
  ArrowRight
} from 'lucide-react';
import { OverlayBox } from '../types';

interface DetectedOverlaysListProps {
  overlays: OverlayBox[];
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
  isAuthentic: boolean;
}

export const DetectedOverlaysList: React.FC<DetectedOverlaysListProps> = ({
  overlays,
  selectedOverlayId,
  onSelectOverlay
}) => {
  if (overlays.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col items-center justify-center text-center">
        <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2" />
        <h4 className="font-medium text-zinc-200 text-sm">
          Tidak Ditemukan Timpaan
        </h4>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm">
          Tidak ditemukan anomali raster atau tanda rekayasa pada dokumen ini.
        </p>
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'modified_number':
        return { label: 'Perubahan Angka', bg: 'bg-rose-950/60 text-rose-300 border-rose-800/60' };
      case 'overlaid_text':
        return { label: 'Teks Timpaan', bg: 'bg-zinc-800 text-zinc-200 border-zinc-700' };
      case 'fake_stamp':
        return { label: 'Stempel Tempelan', bg: 'bg-amber-950/60 text-amber-300 border-amber-800/60' };
      case 'pasted_graphic':
        return { label: 'Grafis Sisipan', bg: 'bg-sky-950/60 text-sky-300 border-sky-800/60' };
      case 'inconsistent_font':
        return { label: 'Inkonsistensi Font', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
      default:
        return { label: 'Anomali Wilayah', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-5">
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-zinc-400" />
          <h3 className="font-medium text-zinc-200 text-sm">
            Area Modifikasi ({overlays.length})
          </h3>
        </div>
        <span className="text-xs text-zinc-500">Klik untuk menyorot</span>
      </div>

      <div className="space-y-2 mt-3.5">
        {overlays.map((item) => {
          const isSelected = selectedOverlayId === item.id;
          const badge = getTypeBadge(item.type);

          return (
            <div
              key={item.id}
              onClick={() => onSelectOverlay(isSelected ? null : item.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500/50'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="font-medium text-zinc-200 text-xs">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                  {item.confidence}%
                </span>
              </div>

              {/* Text Comparison Box if text exists */}
              {(item.extractedText || item.originalLikelyText) && (
                <div className="mt-2 p-2 rounded bg-zinc-900 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.extractedText && (
                    <div>
                      <span className="text-[10px] text-rose-400 block font-medium">
                        Teks Timpaan:
                      </span>
                      <span className="text-xs text-rose-200 bg-rose-950/40 px-1.5 py-0.5 rounded block mt-0.5 border border-rose-900/50">
                        "{item.extractedText}"
                      </span>
                    </div>
                  )}
                  {item.originalLikelyText && (
                    <div>
                      <span className="text-[10px] text-emerald-400 block font-medium">
                        Kemungkinan Teks Asli:
                      </span>
                      <span className="text-xs text-emerald-200 bg-emerald-950/40 px-1.5 py-0.5 rounded block mt-0.5 border border-emerald-900/50">
                        "{item.originalLikelyText}"
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

