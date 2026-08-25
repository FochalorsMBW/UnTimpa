import React, { useState } from 'react';
import { FileText, Copy, Check, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { OcrRegionItem } from '../types';

interface OcrTranscribeViewerProps {
  ocrItems: OcrRegionItem[];
}

export const OcrTranscribeViewer: React.FC<OcrTranscribeViewerProps> = ({ ocrItems }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'tampered' | 'authentic'>('all');

  const fullText = ocrItems.map(i => i.text).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = ocrItems.filter(item => {
    if (filter === 'tampered') return item.isTampered;
    if (filter === 'authentic') return !item.isTampered;
    return true;
  });

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-400" />
          <h3 className="font-medium text-zinc-200 text-sm">
            Hasil Ekstraksi Teks (OCR)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                filter === 'all' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Semua ({ocrItems.length})
            </button>
            <button
              onClick={() => setFilter('tampered')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                filter === 'tampered' ? 'bg-rose-950/60 text-rose-300 font-medium border border-rose-850' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Anomali ({ocrItems.filter(i => i.isTampered).length})
            </button>
            <button
              onClick={() => setFilter('authentic')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                filter === 'authentic' ? 'bg-emerald-950/60 text-emerald-300 font-medium border border-emerald-850' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Asli ({ocrItems.filter(i => !i.isTampered).length})
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors"
            title="Salin Seluruh Transkrip"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>

      <div className="mt-3 divide-y divide-zinc-800/60 max-h-72 overflow-y-auto pr-1">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className={`py-2 px-2.5 rounded-lg flex items-start justify-between gap-3 text-xs transition-colors ${
              item.isTampered
                ? 'bg-rose-950/20 border border-rose-900/40 my-1'
                : 'hover:bg-zinc-950/40'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">
                {item.isTampered ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </span>
              <div>
                <span className={`text-xs ${item.isTampered ? 'font-medium text-rose-200' : 'text-zinc-300'}`}>
                  {item.text}
                </span>
                {item.tamperReason && (
                  <p className="text-[11px] text-rose-300/90 mt-0.5">
                    {item.tamperReason}
                  </p>
                )}
              </div>
            </div>

            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase shrink-0 ${
                item.isTampered
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              {item.isTampered ? 'Timpaan' : 'Asli'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

