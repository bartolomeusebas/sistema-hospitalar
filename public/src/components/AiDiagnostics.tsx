import React, { useState } from 'react';
import { ViewType, Patient } from '../types';
import {
  BrainCircuit,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Eye,
  FileCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface AiDiagnosticsProps {
  patient: Patient;
  examId?: string;
  onNavigate: (view: ViewType) => void;
}

export const AiDiagnostics: React.FC<AiDiagnosticsProps> = ({
  patient,
  examId,
  onNavigate
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [isDemonstration, setIsDemonstration] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(examId));

  React.useEffect(() => {
    if (!examId) return;
    fetch(`/resultados/exame/${examId}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((results) => {
        const latest = Array.isArray(results) ? results[results.length - 1] : results;
        setDiagnosis(latest?.diagnostico || '');
        setIsDemonstration(String(latest?.observacao || '').includes('DEMONSTRAÇÃO LOCAL'));
      })
      .catch(() => setDiagnosis('Não foi possível carregar o resultado desta análise.'))
      .finally(() => setIsLoading(false));
  }, [examId]);
  const [opacity, setOpacity] = useState<number>(75);
  const [viewMode, setViewMode] = useState<'split' | 'overlay' | 'sideBySide'>('split');
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [colorMap, setColorMap] = useState<'tealOrange' | 'thermal' | 'amber'>('tealOrange');

  const originalImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDOaMouTjrWgGuWDVKJBcrjVUOR7DzYnkZLlc6eFumUckS4ZIEZB0m4EPSH3atnEHMYCoaXRo22rwAlYNVXW5ExyO4RGOm0TSkEj9V3DwJ8dc5dR0EViEp-6d_pbkK6W_z4Gsep7ls7XOj4nQfzBprZKGcYBSFAdF6MVFj165XL30hx8wsG6V84iDO7jkuGDGhFig7E95lTtg9Mz9f6YJLoxsbk77F4cRFrir-r27pVPKDNX9jABRSm';

  const overlayImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5HGNN64uG1h8aPOLs9vIkUL0tPGRsF6xwUmDG4uSVCrj2LthkZ_8d2Ofus0i20lx-wGY_CrULvj7pccXSgtEZRLKluzzakG9-UTll_fSY04p5ADt9Ti1ZoZVOdeeatyhOPdzfas67uOShBKFSBMb56kYQvDBHf8roHTUGGLpPOydHPHP6byVqZR5ffzO9GwD_pUGcO7cq6XYmSjZ47fck6yetOjYrNDtAg57HX1FXkGYmBhOukjj';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 80));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Clinical Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#131b2e] flex items-center justify-center text-[#89f5e7]">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">
                Paciente {patient.name} ({patient.id})
              </h2>
              <span className="bg-[#89f5e7]/20 text-[#0c9488] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0c9488] animate-ping" />
                {isLoading ? 'A analisar exame...' : 'Análise de IA concluída'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Exame: <strong>Radiografia PA do tórax</strong> • Resultado associado ao paciente
            </p>
          </div>
        </div>

        {isDemonstration && (
          <div className="border border-amber-300 bg-amber-50 text-amber-900 rounded-xl px-4 py-3 text-xs font-semibold">
            Resultado demonstrativo, não representa diagnóstico médico real.
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert('A exportação DICOM não faz parte desta demonstração.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar DICOM</span>
          </button>
          <button
            onClick={() => onNavigate('reporting')}
            className="ai-gradient text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Confirmar e assinar laudo</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Workspace: Viewer + Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Radiograph Viewer */}
        <div className="lg:col-span-2 bg-[#0c1220] rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          {/* Top Viewer Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs text-slate-300">
            {/* View Modes */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'split' ? 'bg-[#0058be] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                AI Heatmap Overlay
              </button>
              <button
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'sideBySide'
                    ? 'bg-[#0058be] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Side-by-Side
              </button>
            </div>

            {/* Viewer Adjustments */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                  highContrast
                    ? 'border-[#89f5e7] bg-[#89f5e7]/10 text-[#89f5e7]'
                    : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
                title="Toggle High Contrast"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Contraste</span>
              </button>
              <button
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                  showBoundingBox
                    ? 'border-[#89f5e7] bg-[#89f5e7]/10 text-[#89f5e7]'
                    : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
                title="Toggle AI Bounding Boxes"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Caixas</span>
              </button>
              <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700/60 p-0.5">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1 text-slate-400 hover:text-white border-l border-slate-700/60 ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Radiograph Canvas Area */}
          <div className="my-4 min-h-[420px] sm:min-h-[500px] flex items-center justify-center relative overflow-hidden bg-black rounded-xl border border-slate-800">
            {viewMode === 'sideBySide' ? (
              <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                {/* Left: Original */}
                <div className="relative rounded-lg overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
                  <img
                    src={originalImg}
                    alt="Original Radiograph"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      filter: highContrast ? 'contrast(1.6) brightness(1.1)' : 'none'
                    }}
                    className="max-h-[420px] object-contain transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
                    RAW RADIOGRAPH
                  </div>
                </div>

                {/* Right: AI Heatmap */}
                <div className="relative rounded-lg overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
                  <img
                    src={overlayImg}
                    alt="AI Diagnostic Radiograph"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      filter: highContrast ? 'contrast(1.6) brightness(1.1)' : 'none'
                    }}
                    className="max-h-[420px] object-contain transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 bg-[#0c9488]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    AI GRADIENT HEATMAP
                  </div>
                </div>
              </div>
            ) : (
              /* Overlay / Split View with Opacity Blend */
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Base Original Image */}
                <img
                  src={originalImg}
                  alt="Base Radiograph"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    filter: highContrast ? 'contrast(1.6) brightness(1.1)' : 'none'
                  }}
                  className="max-h-[460px] object-contain transition-transform duration-200 select-none"
                />

                {/* Overlay Image with Opacity */}
                <img
                  src={overlayImg}
                  alt="AI Overlay Radiograph"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    opacity: opacity / 100,
                    filter: highContrast ? 'contrast(1.6) brightness(1.1)' : 'none'
                  }}
                  className="absolute max-h-[460px] object-contain transition-opacity duration-150 pointer-events-none select-none"
                />

                {/* AI Bounding Box Anomaly Indicator */}
                {showBoundingBox && (
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                    className="absolute w-36 h-36 border-2 border-red-500 rounded-lg bg-red-500/10 pointer-events-none flex flex-col justify-between p-1.5 animate-pulse"
                  >
                    <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      LLL CONSOLIDATION: 88%
                    </span>
                    <span className="text-[9px] text-red-200 font-mono text-right">
                      [X:142, Y:280]
                    </span>
                  </div>
                )}

                {/* Floating Meta Watermark */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-pulse" />
                  <span>Res: 2048 x 2048 • 16-bit Grayscale • Model: MedV-DenseNet-X</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Heatmap Controls Bar */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <span className="text-slate-400 whitespace-nowrap font-medium">Opacidade do mapa de calor:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#89f5e7]"
              />
              <span className="font-mono text-[#89f5e7] w-10 text-right">{opacity}%</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
                <span>Espectro:</span>
              <div className="flex rounded-lg overflow-hidden border border-slate-700">
                <button
                  onClick={() => setColorMap('tealOrange')}
                  className={`px-2.5 py-1 text-[11px] ${
                    colorMap === 'tealOrange' ? 'bg-[#0c9488] text-white' : 'hover:text-white'
                  }`}
                >
                    Térmico clínico
                </button>
                <button
                  onClick={() => setColorMap('thermal')}
                  className={`px-2.5 py-1 text-[11px] ${
                    colorMap === 'thermal' ? 'bg-[#ba1a1a] text-white' : 'hover:text-white'
                  }`}
                >
                    Ferro quente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Assisted Findings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0c9488]" />
                  Resultados assistidos por IA
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Ordenado pela confiança do diagnóstico</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                {diagnosis ? 'Resultado real' : 'Dados de demonstração'}
              </span>
            </div>

            {/* Findings List */}
            {diagnosis && (
              <div className="p-4 rounded-xl border border-[#0c9488]/30 bg-[#89f5e7]/10">
                <h4 className="text-xs font-bold text-[#131b2e] mb-2">Interpretação da IA</h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{diagnosis}</p>
              </div>
            )}

            {!diagnosis && (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                A interpretação aparece aqui depois de analisar um exame na fila.
              </p>
            )}

            {/* Disclaimer Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-[#0058be] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Demonstração de TCC:</strong> a imagem e os controlos visuais são ilustrativos. O texto da interpretação vem da análise associada ao exame e não constitui diagnóstico médico.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={() => onNavigate('reporting')}
              className="w-full ai-gradient text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
            >
              <span>Confirmar e assinar laudo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
