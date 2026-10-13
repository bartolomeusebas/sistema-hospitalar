import React, { useState } from 'react';
import { ViewType } from '../types';
import {
  Sliders,
  Cpu,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Lock,
  Zap,
  Layers
} from 'lucide-react';

interface AdminConsoleProps {
  onNavigate: (view: ViewType) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onNavigate }) => {
  const [autoClearanceThreshold, setAutoClearanceThreshold] = useState(80);
  const [criticalFlagThreshold, setCriticalFlagThreshold] = useState(85);
  const [activeModel, setActiveModel] = useState('MedV-DenseNet-X v4.2');
  const [enableDicomAutoSync, setEnableDicomAutoSync] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const auditLogs: Array<{ time: string; user: string; action: string; ip: string }> = [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Consola de administração e governação da IA
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas computacionais, limiares de confiança da rede neural e auditoria clínica.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="ai-gradient text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all shrink-0"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Definições guardadas' : 'Guardar regras de governação'}</span>
        </button>
      </div>

      {/* Grid: AI Governance + Compute Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Model Confidence Gates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#131b2e]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#131b2e] uppercase tracking-wider">
                  Limiares de decisão do modelo
                </h3>
                <p className="text-xs text-slate-400">Limiar de sensibilidade da triagem automática</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0c9488] bg-[#89f5e7]/20 px-2.5 py-0.5 rounded-full">
              Ativo
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold text-slate-700">
                <span>Limiar de liberação automática (rotina)</span>
                <span className="font-mono text-[#0058be] font-bold">{autoClearanceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={autoClearanceThreshold}
                onChange={(e) => setAutoClearanceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0058be]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Exames acima deste índice de certeza não aguardam a segunda validação.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold text-slate-700">
                <span>Limiar de escalonamento de anomalia crítica</span>
                <span className="font-mono text-[#ba1a1a] font-bold">{criticalFlagThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={criticalFlagThreshold}
                onChange={(e) => setCriticalFlagThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#ba1a1a]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Resultados acima deste limiar geram um alerta imediato ao radiologista.
              </p>
            </div>

            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1.5">
                Núcleo de segmentação ativo
              </label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <option>MedV-DenseNet-X v4.2 (Produção estável)</option>
                <option>VisionTransformer-Bio v2.1 (Baixa latência)</option>
                <option>ChestRadiography-Ensemble v5.0 (Alta sensibilidade)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Compute Cluster Telemetry */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#131b2e]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#131b2e] uppercase tracking-wider">
                  Telemetria de hardware e computação
                </h3>
                <p className="text-xs text-slate-400">Estado do cluster NVIDIA Tensor Core</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0c9488] bg-[#89f5e7]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0c9488] animate-ping" />
              Operacional
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Carga do núcleo GPU
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">65.2%</p>
              <span className="text-[10px] text-[#0c9488]">Estado térmico ideal</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                VRAM Tensor
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">48 / 80 GB</p>
              <span className="text-[10px] text-slate-500">Arquitetura Ampere</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Latência média
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">142 ms</p>
              <span className="text-[10px] text-[#0c9488]">Inferência inferior a um segundo</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Estado da ligação PACS
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">DICOM 3.0</p>
              <span className="text-[10px] text-[#0c9488]">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0c9488]" />
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">
              Registo de auditoria da demonstração
            </h3>
          </div>
          <span className="text-xs text-slate-400">Registo imutável encriptado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Data e hora</th>
                <th className="px-4 py-3">Utilizador / agente</th>
                <th className="px-4 py-3">Ação realizada</th>
                <th className="px-5 py-3 text-right">IP do nó</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400">Ainda não existem registos de auditoria.</td></tr>
              ) : auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-500">{log.time}</td>
                  <td className="px-4 py-3.5 font-semibold text-[#131b2e]">{log.user}</td>
                  <td className="px-4 py-3.5 text-slate-700">{log.action}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
