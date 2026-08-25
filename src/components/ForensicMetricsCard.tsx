import React from 'react';
import { 
  Activity, 
  Flame, 
  Layers, 
  Type as TypeIcon, 
  Hash, 
  Binary
} from 'lucide-react';
import { ForensicsMetrics } from '../types';

interface ForensicMetricsCardProps {
  metrics: ForensicsMetrics;
}

export const ForensicMetricsCard: React.FC<ForensicMetricsCardProps> = ({ metrics }) => {
  const items = [
    {
      label: 'Divergensi ELA',
      value: metrics.elaAnomalyScore,
      unit: '%',
      inverse: true,
      icon: Flame,
      desc: 'Disparitas kuantisasi kompresi JPEG'
    },
    {
      label: 'Konsistensi Derau',
      value: metrics.noiseConsistencyScore,
      unit: '%',
      inverse: false,
      icon: Activity,
      desc: 'Keseragaman matriks derau sensor'
    },
    {
      label: 'Kemiripan Struktural (SSIM)',
      value: metrics.structuralSimilaritySSIM,
      unit: '%',
      inverse: false,
      icon: Layers,
      desc: 'Korelasi luminansi dan kontras'
    },
    {
      label: 'Anti-Aliasing Tipografi',
      value: metrics.fontCohesionScore,
      unit: '%',
      inverse: false,
      icon: TypeIcon,
      desc: 'Kesesuaian rasterisasi huruf'
    },
    {
      label: 'Kecocokan Hash (pHash)',
      value: metrics.perceptualHashMatch,
      unit: '%',
      inverse: false,
      icon: Hash,
      desc: 'Pencocokan sidik jari visual'
    }
  ];

  const getStatusColor = (val: number, inverse: boolean) => {
    if (inverse) {
      if (val > 70) return { bar: 'bg-rose-500', text: 'text-rose-400', label: 'Anomali' };
      if (val > 35) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Moderat' };
      return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Normal' };
    } else {
      if (val > 80) return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Optimal' };
      if (val > 50) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Cukup' };
      return { bar: 'bg-rose-500', text: 'text-rose-400', label: 'Rendah' };
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-5">
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-emerald-400" />
          <h3 className="font-medium text-zinc-200 text-sm">
            Metrik Pengukuran Forensik
          </h3>
        </div>
        <span className="text-xs text-zinc-500 hidden sm:inline">Analisis Komputasi Visual</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3.5">
        {items.map((item, i) => {
          const status = getStatusColor(item.value, item.inverse);
          const Icon = item.icon;
          return (
            <div key={i} className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-300 font-medium text-xs">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    {item.label}
                  </span>
                  <span className={`font-semibold text-xs ${status.text}`}>
                    {item.value.toFixed(0)}{item.unit}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                  {item.desc}
                </p>
              </div>

              <div className="mt-2.5">
                <div className="w-full bg-zinc-850 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                    style={{ width: `${Math.min(100, Math.max(5, item.value))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[10px] text-zinc-500">
                  <span>Status: <strong className={status.text}>{status.label}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

