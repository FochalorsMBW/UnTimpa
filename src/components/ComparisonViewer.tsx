import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders, 
  Layers, 
  Flame, 
  Activity, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Columns,
  Crosshair,
  Grid,
  Scan
} from 'lucide-react';
import { OverlayBox } from '../types';

export type ForensicsViewMode = 'split' | 'normal' | 'ela' | 'noise' | 'edges' | 'masked' | 'side_by_side';

interface ComparisonViewerProps {
  originalImageUrl: string;
  reconstructedImageUrl?: string;
  elaImageUrl?: string;
  noiseImageUrl?: string;
  edgesImageUrl?: string;
  maskedImageUrl?: string;
  overlays: OverlayBox[];
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
  isAuthentic: boolean;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalImageUrl,
  reconstructedImageUrl,
  elaImageUrl,
  noiseImageUrl,
  edgesImageUrl,
  maskedImageUrl,
  overlays,
  selectedOverlayId,
  onSelectOverlay
}) => {
  const [viewMode, setViewMode] = useState<ForensicsViewMode>('split');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ pctX: number; pctY: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const baselineImage = reconstructedImageUrl || maskedImageUrl || originalImageUrl;

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const handleMouseDownSlider = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingSlider(true);
  };

  const handleTouchMoveSlider = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      } else if (isPanning) {
        setPanOffset({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingSlider, isPanning, startPan]);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.7, Math.min(3, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingSlider) {
      setIsPanning(true);
      setStartPan({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const pctX = Math.round((relX / rect.width) * 100);
    const pctY = Math.round((relY / rect.height) * 100);
    setCursorCoords({ pctX, pctY });
  };

  const handleContainerMouseLeave = () => {
    setCursorCoords(null);
  };

  const getActiveForensicImage = () => {
    switch (viewMode) {
      case 'ela':
        return elaImageUrl || originalImageUrl;
      case 'noise':
        return noiseImageUrl || originalImageUrl;
      case 'edges':
        return edgesImageUrl || originalImageUrl;
      case 'masked':
        return maskedImageUrl || originalImageUrl;
      default:
        return originalImageUrl;
    }
  };

  const viewModes = [
    { id: 'split', label: 'Tirai', icon: Sliders },
    { id: 'normal', label: 'Normal', icon: Layers },
    { id: 'side_by_side', label: 'Dual', icon: Columns },
    { id: 'ela', label: 'ELA', icon: Flame },
    { id: 'noise', label: 'Derau', icon: Activity },
    { id: 'edges', label: 'Tepi', icon: Scan },
    { id: 'masked', label: 'Masking', icon: EyeOff }
  ] as const;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden flex flex-col">
      
      {/* Top Bar */}
      <div className="px-3 py-2.5 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Segmented Modes */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 overflow-x-auto max-w-full">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ForensicsViewMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Tools */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded transition-colors ${
              showGrid ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-zinc-200'
            }`}
            title="Grid Kalibrasi"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`p-1.5 rounded transition-colors ${
              showBoundingBoxes ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-zinc-200'
            }`}
            title="Tampilkan Kotak Deteksi"
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <div className="h-3.5 w-px bg-zinc-800 mx-1" />

          <button
            onClick={() => handleZoom(0.2)}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-zinc-500 min-w-[32px] text-right">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        id="forensic-canvas-container"
        onMouseDown={handleContainerMouseDown}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] bg-zinc-950 overflow-hidden select-none cursor-crosshair flex items-center justify-center border-b border-zinc-800"
      >
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity"
          style={{
            opacity: showGrid ? 0.25 : 0.06,
            backgroundImage: `linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Split View */}
        {viewMode === 'split' && (
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Left/Base Layer */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative max-w-full max-h-full">
                <img
                  src={baselineImage}
                  alt="Rujukan Asli"
                  className="max-h-[460px] w-auto object-contain rounded pointer-events-none"
                />
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900/90 text-emerald-400 border border-emerald-800/60 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {reconstructedImageUrl ? 'Rekonstruksi Teks Asli (Tanpa Timpaan)' : 'Rujukan Asli'}
                </span>
              </div>
            </div>

            {/* Right/Overlay Layer */}
            <div 
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
              }}
            >
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={originalImageUrl}
                  alt="Citra Uji"
                  className="max-h-[460px] w-auto object-contain rounded pointer-events-none"
                />
                <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900/90 text-rose-400 border border-rose-800/60 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Citra Uji (Dengan Timpaan)
                </span>

                {/* Bounding Boxes */}
                {showBoundingBoxes && overlays.map(box => {
                  const [ymin, xmin, ymax, xmax] = box.box;
                  const isSelected = selectedOverlayId === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOverlay(box.id);
                      }}
                      className={`absolute cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-2 border-rose-400 bg-rose-950/40 ring-1 ring-rose-400 z-20' 
                          : 'border border-rose-500/80 bg-rose-900/15 hover:bg-rose-900/30 z-10'
                      }`}
                      style={{
                        top: `${ymin}%`,
                        left: `${xmin}%`,
                        width: `${xmax - xmin}%`,
                        height: `${ymax - ymin}%`
                      }}
                    >
                      <span className="absolute -top-3.5 left-0 px-1 py-0.2 rounded text-[8px] font-medium bg-rose-950 text-rose-200 border border-rose-800 whitespace-nowrap">
                        {box.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Divider */}
            <div
              className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center group"
              style={{ left: `${sliderPos}%` }}
              onMouseDown={handleMouseDownSlider}
              onTouchMove={handleTouchMoveSlider}
            >
              <div className="w-0.5 h-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <div className="absolute w-6 h-6 -ml-3 bg-zinc-900 text-emerald-400 rounded-full shadow-md flex items-center justify-center border border-zinc-700">
                <Sliders className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side View */}
        {viewMode === 'side_by_side' && (
          <div 
            className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-3 p-3 items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className="relative flex flex-col items-center justify-center bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80 h-full">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-950/95 text-emerald-400 border border-emerald-800/60 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Rujukan Asli (Format Asli Tanpa Timpaan)
              </span>
              <img
                src={baselineImage}
                alt="Rujukan Asli"
                className="max-h-[360px] w-auto object-contain rounded"
              />
            </div>

            <div className="relative flex flex-col items-center justify-center bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80 h-full">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-950/95 text-rose-400 border border-rose-800/60 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Citra Uji (Dokumen Input / Dengan Timpaan)
              </span>
              <div className="relative">
                <img
                  src={originalImageUrl}
                  alt="Hasil Timpaan"
                  className="max-h-[360px] w-auto object-contain rounded"
                />
                {showBoundingBoxes && overlays.map(box => {
                  const [ymin, xmin, ymax, xmax] = box.box;
                  const isSelected = selectedOverlayId === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOverlay(box.id);
                      }}
                      className={`absolute cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-2 border-rose-400 bg-rose-950/40 ring-1 ring-rose-400 z-20' 
                          : 'border border-rose-500/80 bg-rose-900/15 z-10'
                      }`}
                      style={{
                        top: `${ymin}%`,
                        left: `${xmin}%`,
                        width: `${xmax - xmin}%`,
                        height: `${ymax - ymin}%`,
                      }}
                    >
                      <span className="absolute -top-3 left-0 px-1 rounded text-[8px] font-medium bg-rose-950 text-rose-200">
                        {box.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Single View (Normal, ELA, Noise, Edges, Masked) */}
        {viewMode !== 'split' && viewMode !== 'side_by_side' && (
          <div 
            className="relative flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className="relative">
              <img
                src={getActiveForensicImage()}
                alt="Tampilan Forensik"
                className="max-h-[460px] w-auto object-contain rounded shadow-lg"
              />

              <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-medium text-zinc-300 bg-zinc-900/90 border border-zinc-800 flex items-center gap-1.5">
                {viewMode === 'ela' && 'Error Level Analysis (ELA)'}
                {viewMode === 'noise' && 'Analisis Derau Laplacian'}
                {viewMode === 'edges' && 'Deteksi Kontras Tepi'}
                {viewMode === 'masked' && 'Isolasi Area Timpaan'}
                {viewMode === 'normal' && 'Deteksi Wilayah Modifikasi'}
              </span>

              {showBoundingBoxes && (viewMode === 'normal' || viewMode === 'ela') && overlays.map(box => {
                const [ymin, xmin, ymax, xmax] = box.box;
                const isSelected = selectedOverlayId === box.id;
                return (
                  <div
                    key={box.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOverlay(box.id);
                    }}
                    className={`absolute cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-rose-400 bg-rose-950/40 ring-1 ring-rose-400 z-20' 
                        : 'border border-rose-500/80 bg-rose-900/20 hover:bg-rose-900/30 z-10'
                    }`}
                    style={{
                      top: `${ymin}%`,
                      left: `${xmin}%`,
                      width: `${xmax - xmin}%`,
                      height: `${ymax - ymin}%`
                    }}
                  >
                    <span className="absolute -top-3.5 left-0 px-1 py-0.2 rounded text-[8px] font-medium bg-rose-950 text-rose-200 border border-rose-800 whitespace-nowrap">
                      {box.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cursor coords */}
        {cursorCoords && (
          <div className="absolute bottom-2.5 right-2.5 z-30 bg-zinc-900/90 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1.5 pointer-events-none">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span>X: {cursorCoords.pctX}% Y: {cursorCoords.pctY}%</span>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-zinc-950 text-xs text-zinc-400 flex items-center justify-between gap-2 border-t border-zinc-800">
        <span className="text-[11px] text-zinc-400">
          {viewMode === 'split' && 'Geser slider untuk melihat perbedaan citra rujukan dan citra uji.'}
          {viewMode === 'normal' && 'Pemeriksaan normal dengan batas area modifikasi.'}
          {viewMode === 'side_by_side' && 'Tampilan berdampingan rujukan vs citra uji.'}
          {viewMode === 'ela' && 'Error Level Analysis: Menyorot perbedaan rasio kompresi artefak piksel.'}
          {viewMode === 'noise' && 'Analisis Derau: Mendeteksi inkonsistensi tekstur sensor kamera.'}
          {viewMode === 'edges' && 'Kontras Tepi: Memeriksa ketajaman batas huruf atau stempel.'}
          {viewMode === 'masked' && 'Area timpaan ditutup untuk analisis konteks asli.'}
        </span>
        <span className="text-[11px] text-zinc-500 shrink-0">
          {overlays.length} Anomali Terdeteksi
        </span>
      </div>

    </div>
  );
};


