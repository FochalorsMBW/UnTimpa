import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldAlert, 
  ShieldCheck, 
  FileCheck2
} from 'lucide-react';
import { ForensicReport } from '../types';

interface ReportExportModalProps {
  report: ForensicReport;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ report, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isManipulated = report.verdict === 'manipulated_overlay';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl max-w-2xl w-full border border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-zinc-950 text-zinc-100 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="font-medium text-sm">
                Laporan Hasil Pemeriksaan Dokumen
              </h3>
              <p className="text-xs text-zinc-400">Ringkasan audit forensik dan verifikasi keaslian</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div ref={printRef} className="p-6 sm:p-7 space-y-4 bg-zinc-950 text-zinc-200 text-xs sm:text-sm border-b border-zinc-800">
          
          {/* Header Meta */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                LAPORAN ANALISIS
              </span>
              <h2 className="text-base font-semibold text-zinc-100 mt-1.5">
                Uji Forensik Keaslian Dokumen
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                ID Dokumen: {report.id}
              </p>
            </div>

            <div className="text-right text-xs text-zinc-400 space-y-0.5">
              <p>Waktu: <strong>{new Date(report.analyzedAt).toLocaleString('id-ID')}</strong></p>
              <p>Berkas: <strong className="text-zinc-200">{report.fileName}</strong></p>
              <p>Ukuran: {report.dimensions.width} &times; {report.dimensions.height} px</p>
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-zinc-400">SHA-256:</span>
              <span className="text-zinc-200 font-mono text-[11px] break-all">{report.sha256Hash}</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-zinc-400">MD5:</span>
              <span className="text-zinc-200 font-mono text-[11px]">{report.md5Hash}</span>
            </div>
          </div>

          {/* Final Verdict Highlight */}
          <div className={`p-4 rounded-lg border ${
            isManipulated 
              ? 'bg-rose-950/20 border-rose-900/50' 
              : 'bg-emerald-950/20 border-emerald-900/50'
          }`}>
            <div className="flex items-start gap-3">
              {isManipulated ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                  isManipulated ? 'bg-rose-900/60 text-rose-200 border border-rose-800' : 'bg-emerald-900/60 text-emerald-200 border border-emerald-800'
                }`}>
                  {isManipulated ? 'Hasil Rekayasa Terkonfirmasi' : 'Dokumen Asli / Otentik'}
                </span>
                <h3 className={`text-sm font-semibold mt-1.5 ${isManipulated ? 'text-rose-200' : 'text-emerald-200'}`}>
                  {report.verdictTitle}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isManipulated ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {report.verdictDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h4 className="font-medium text-zinc-300 text-xs mb-2">Parameter Penilaian:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-[11px] block">Kepastian</span>
                <strong className="text-zinc-100 text-xs font-semibold">{report.confidenceScore.toFixed(0)}%</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-[11px] block">Anomali ELA</span>
                <strong className="text-zinc-100 text-xs font-semibold">{report.metrics.elaAnomalyScore.toFixed(0)}%</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-[11px] block">Derau Laplacian</span>
                <strong className="text-zinc-100 text-xs font-semibold">{report.metrics.noiseConsistencyScore.toFixed(0)}%</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                <span className="text-zinc-400 text-[11px] block">Tipografi</span>
                <strong className="text-zinc-100 text-xs font-semibold">{report.metrics.fontCohesionScore.toFixed(0)}%</strong>
              </div>
            </div>
          </div>

          {/* Detected Overlay Locations */}
          {report.detectedOverlays.length > 0 && (
            <div>
              <h4 className="font-medium text-zinc-300 text-xs mb-2">
                Temuan Anomali ({report.detectedOverlays.length}):
              </h4>
              <div className="space-y-1.5">
                {report.detectedOverlays.map((box, i) => (
                  <div key={i} className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs">
                    <div className="flex items-center justify-between font-medium text-zinc-200">
                      <span>{i + 1}. {box.label}</span>
                      <span className="text-rose-400 text-xs">{box.confidence}% Akurasi</span>
                    </div>
                    {box.extractedText && (
                      <p className="text-zinc-300 mt-1 text-xs">
                        <strong className="text-zinc-400">Teks:</strong> "{box.extractedText}"
                      </p>
                    )}
                    <p className="text-zinc-400 mt-0.5 text-xs">{box.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Sistem Deteksi Dokumen Asli vs Timpaan</span>
            <span>Standar Forensik Digital</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>

      </div>
    </div>
  );
};

