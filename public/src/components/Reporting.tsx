import React, { useState } from 'react';
import { ViewType, Patient, UserProfile } from '../types';
import {
  Printer,
  Download,
  CheckCircle2,
  FileCheck,
  Building,
  Sparkles,
  ArrowLeft,
  Share2,
  Lock,
  Edit3
} from 'lucide-react';

interface ReportingProps {
  patient: Patient;
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
}

export const Reporting: React.FC<ReportingProps> = ({
  patient,
  user,
  onNavigate
}) => {
  const [reportId] = useState('MS-2023-8942');
  const [reportDate] = useState('24 de outubro de 2023');
  const [reportTime] = useState('15:45');
  const [conclusionText, setConclusionText] = useState(
    `1. Consolidação alveolar no lobo inferior esquerdo, compatível com pneumonia bacteriana aguda.\n2. Não há evidência de derrame pleural significativo ou pneumotórax.\n3. Silhueta cardíaca e contornos mediastínicos sem alterações relevantes.\n\nRECOMENDAÇÃO: Correlacionar com marcadores inflamatórios e avaliação clínica. Recomenda-se repetir a radiografia do tórax dentro de 4 a 6 semanas para documentar a resolução radiográfica completa.`
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => onNavigate('ai_diagnostics')}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao diagnóstico</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Ligação segura e encriptada enviada ao portal do médico responsável.')}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partilhar com o médico</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="ai-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir laudo</span>
          </button>
        </div>
      </div>

      {/* Official Clinical Report Paper Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 text-slate-800 print-shadow-none">
        {/* Hospital Header & Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#131b2e] text-[#89f5e7] flex items-center justify-center shadow-md">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#131b2e]">
                HOSPITAL GERAL DO UÍGE
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                DEPARTAMENTO DE RADIOLOGIA E IMAGIOLOGIA
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <p className="font-mono font-bold text-slate-900 text-sm">ID DO LAUDO: {reportId}</p>
            <p className="text-slate-500 mt-0.5">
              Data: <strong>{reportDate}</strong> • {reportTime}
            </p>
            <span className="inline-block mt-1 bg-[#89f5e7]/20 text-[#0c9488] font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              LAUDO OFICIAL FINAL
            </span>
          </div>
        </div>

        {/* Patient & Examination Demographic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Nome do paciente
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{patient.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              ID / MRN do paciente
            </span>
            <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
              {patient.id} / {patient.mrn}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Idade / sexo / nascimento
            </span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">
              {patient.age} Y • {patient.gender} • {patient.dob}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Médico responsável
            </span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">
              {patient.primaryCare}
            </span>
          </div>
        </div>

        {/* Examination Indication */}
        <div className="space-y-2 text-xs sm:text-sm">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
            Indicação clínica
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Febre persistente, tosse produtiva e dor pleurítica no lado esquerdo do tórax há 4 dias. Avaliar consolidação aguda das vias respiratórias inferiores ou processo inflamatório.
          </p>
        </div>

        {/* MediScan AI Preliminary Neural Findings */}
        <div className="p-5 rounded-2xl bg-[#131b2e]/5 border border-[#131b2e]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#131b2e] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0c9488]" />
              ANÁLISE NEURAL PRELIMINAR DA MEDISCAN AI
            </h3>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-semibold">
              DeepNet-X v4.2
            </span>
          </div>

          <div className="border border-amber-300 bg-amber-50 text-amber-900 rounded-xl px-4 py-3 text-xs font-semibold">
            RESULTADO DEMONSTRATIVO: não representa diagnóstico médico real.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Thumbnail */}
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-300 shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe2MS4Cd_lQUue1Np25pp9m4wLICKWY5LjfXQMcRwwmwAnhmtznP02o0qpOEjKGztOf5QRFDlV9lh-FwntVjDHTYmCvG7CMVmiftSrwXTH3UTDdWvh1eP_Y5mA8luOrT5H36BiuNK0cu0eg_1HzWiMKTkW3ZzbKdFkmMdaVk5ORJHptMJFJcj80cFkBmq6_d8HJ6sX9uwoiT5x2ytUhVwOybg3e87PcodWPk17Bsrb4-rjlNisLUBo"
                alt="Radiograph Analysis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-red-500/80 rounded-xl pointer-events-none" />
            </div>

            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Resultado principal:</span>
                <span className="bg-red-100 text-[#ba1a1a] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Consolidação do lobo inferior esquerdo (88% de probabilidade)
                </span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488]" /> Seios costofrénicos livres e bem definidos bilateralmente.
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488]" /> Índice cardiotorácico normal (ICT &lt; 0,50).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Interpretation & Conclusion Editable Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-400 no-print" />
              INTERPRETAÇÃO RADIOLÓGICA E CONCLUSÃO CLÍNICA
            </h3>
              <span className="text-[10px] text-slate-400 no-print">Clique para editar as notas</span>
          </div>

          <textarea
            rows={5}
            value={conclusionText}
            onChange={(e) => setConclusionText(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-[#0058be]"
          />
        </div>

        {/* Electronic Signature & Authentication Box */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#0c9488]" />
              <span>Assinatura eletrónica verificada criptograficamente</span>
            </div>
            <p className="text-[11px]">Hash de auditoria: 99f8-41ae-78c0-21ba-mediscan-certified</p>
            <p className="text-[11px]">Data e hora: 2023-10-24T15:45:12Z</p>
          </div>

          <div className="text-right border-l-0 sm:border-l sm:pl-6 border-slate-200">
            {/* Signature Cursive Graphic */}
            <div className="italic font-serif text-2xl text-[#131b2e] tracking-wider mb-1 select-none">
              {user.name}
            </div>
            <p className="text-xs font-bold text-slate-900">{user.title}</p>
            <p className="text-[11px] text-slate-500">Hospital Geral do Uíge • Licença #{user.license}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
