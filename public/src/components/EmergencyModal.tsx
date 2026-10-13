import React, { useState } from 'react';
import { AlertTriangle, X, ArrowRight, Activity, ShieldAlert, Zap } from 'lucide-react';
import { ViewType } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [traumaType, setTraumaType] = useState('Acute Respiratory Distress / Pneumothorax');
  const [urgencyLevel, setUrgencyLevel] = useState('Stat Priority 1');
  const [notes, setNotes] = useState('Emergency Department incoming trauma, severe dyspnea, SPO2 84%. Priority GPU queue bypass requested.');

  if (!isOpen) return null;

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    onNavigate('ai_diagnostics');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#ba1a1a] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#ba1a1a]">Caso de triagem de emergência</h3>
              <p className="text-xs text-slate-500">Alocação computacional neural prioritária</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleTriageSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Protocolo de trauma</label>
            <select
              value={traumaType}
              onChange={(e) => setTraumaType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option>Acute Respiratory Distress / Pneumothorax</option>
              <option>Acute Intracranial Hemorrhage / Stroke Protocol</option>
              <option>Blunt Thoracoabdominal Trauma</option>
              <option>Massive Pulmonary Embolism</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nível de prioridade</label>
              <input
                type="text"
                readOnly
                value={urgencyLevel}
                className="w-full p-2.5 bg-red-50 text-[#ba1a1a] font-bold border border-red-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unidade computacional GPU</label>
              <input
                type="text"
                readOnly
                value="Node-01 (Stat Lock)"
                className="w-full p-2.5 bg-slate-100 text-slate-700 font-mono border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notas clínicas da triagem</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
              <span>A prioridade da emergência substitui os trabalhos padrão e notifica imediatamente o radiologista responsável.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-red-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Iniciar análise urgente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
