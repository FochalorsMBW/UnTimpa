import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Download
} from 'lucide-react';
import { VerdictType } from '../types';

interface VerdictBannerProps {
  verdict: VerdictType;
  verdictTitle: string;
  verdictDescription: string;
  confidenceScore: number;
  manipulationTypes: string[];
  onOpenReportModal: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  verdict,
  verdictTitle,
  verdictDescription,
  confidenceScore,
  manipulationTypes,
  onOpenReportModal
}) => {
  const isManipulated = verdict === 'manipulated_overlay';
  const isAuthentic = verdict === 'authentic_document';

  const getStatusColor = () => {
    if (isManipulated) {
      return {
        badge: 'text-rose-400 bg-rose-950/60 border-rose-800/80',
        dot: 'bg-rose-500',
        icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        label: 'Terindikasi Rekayasa'
      };
    }
    if (isAuthentic) {
      return {
        badge: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
        dot: 'bg-emerald-500',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        label: 'Dokumen Asli'
      };
    }
    return {
      badge: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
      dot: 'bg-amber-500',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      label: 'Perlu Konfirmasi'
    };
  };

  const status = getStatusColor();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${status.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className="text-xs text-zinc-400">
              Akurasi Deteksi: <strong className="text-zinc-200">{confidenceScore.toFixed(0)}%</strong>
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
            {verdictTitle}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {verdictDescription}
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            id="btn-download-forensic-report"
            onClick={onOpenReportModal}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-750 hover:text-white border border-zinc-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unduh Laporan</span>
          </button>
        </div>

      </div>

      {/* Manipulation Tags if any */}
      {manipulationTypes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-zinc-500">Temuan:</span>
          {manipulationTypes.map((type, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[11px]"
            >
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

