import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  Calendar, 
  Building2,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { OriginalSourceMatch } from '../types';

interface ProvenanceCardProps {
  source: OriginalSourceMatch;
}

export const ProvenanceCard: React.FC<ProvenanceCardProps> = ({ source }) => {
  if (!source || !source.found) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
          <Globe className="w-4 h-4 text-zinc-400" />
          <h3 className="font-medium text-zinc-200 text-sm">
            Verifikasi Sumber & Arsip
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
          Belum ditemukan arsip dokumen rujukan identik di korpus publik. Deteksi didasarkan pada analisis struktural dan artefak piksel citra.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="font-medium text-zinc-200 text-sm">
              Sumber Rujukan & Konteks Asli
            </h3>
            <p className="text-xs text-zinc-400">
              Hasil korelasi basis data arsip dan verifikasi
            </p>
          </div>
        </div>

        {source.similarityScore && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-emerald-400 border border-zinc-700/80">
            {source.similarityScore.toFixed(0)}% Kecocokan
          </span>
        )}
      </div>

      <div className="mt-3.5 space-y-2.5">
        {/* Source Title & Link */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium text-zinc-200 text-xs sm:text-sm">
              {source.title || 'Arsip Dokumen Rujukan'}
            </h4>
            {source.sourceUrl && (
              <a
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                <span>Buka Sumber</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-400">
            {source.publisher && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-zinc-500" />
                {source.publisher}
              </span>
            )}
            {source.publicationDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {source.publicationDate}
              </span>
            )}
          </div>
        </div>

        {/* Original Context vs Debunking */}
        {source.originalContext && (
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
            <h5 className="font-medium text-emerald-400 text-xs mb-1">
              Konteks Dokumen Sebenarnya:
            </h5>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {source.originalContext}
            </p>
          </div>
        )}

        {source.debunkingSummary && (
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs">
            <h5 className="font-medium text-rose-400 text-xs mb-1">
              Fakta & Rekayasa:
            </h5>
            <p className="text-rose-200 leading-relaxed text-xs">
              {source.debunkingSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

