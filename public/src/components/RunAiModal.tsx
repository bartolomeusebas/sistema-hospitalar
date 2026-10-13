import React, { useState } from 'react';
import { Sparkles, X, UploadCloud, ArrowRight, Loader2, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { ViewType } from '../types';

interface RunAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const RunAiModal: React.FC<RunAiModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [selectedScan, setSelectedScan] = useState<'chest' | 'brain' | 'abdomen'>('chest');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      onNavigate('ai_diagnostics');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#131b2e] text-[#89f5e7] flex items-center justify-center shadow-inner">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#131b2e]">Executar análise de IA</h3>
              <p className="text-xs text-slate-500">Segmentação neural multimodal instantânea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-semibold text-slate-700 block mb-2">Selecionar conjunto de exames:</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedScan('chest')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedScan === 'chest'
                    ? 'border-[#0058be] bg-blue-50/70 text-[#0058be] font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs">Raio-X do tórax</span>
                <span className="text-[10px] text-slate-400 font-normal">Exemplo</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedScan('brain')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedScan === 'brain'
                    ? 'border-[#0058be] bg-blue-50/70 text-[#0058be] font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs">RM cerebral</span>
                <span className="text-[10px] text-slate-400 font-normal">Exemplo</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedScan('abdomen')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedScan === 'abdomen'
                    ? 'border-[#0058be] bg-blue-50/70 text-[#0058be] font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs">TC do tórax</span>
                <span className="text-[10px] text-slate-400 font-normal">Exemplo</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#131b2e] text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#89f5e7] uppercase font-mono tracking-wider">
                Modelo de demonstração
              </span>
              <p className="text-xs font-bold">MedV-DenseNet-X v4.2</p>
              <p className="text-[11px] text-slate-400">Ilustração para a defesa, sem diagnóstico real</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#89f5e7]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 text-xs sm:text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleStartInference}
              disabled={isProcessing}
              className="ai-gradient text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A processar modelo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Executar análise neural</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
