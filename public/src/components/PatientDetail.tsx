import React, { useEffect, useState } from 'react';
import { Patient, ViewType } from '../types';
import {
  ArrowLeft,
  AlertTriangle,
  Boxes,
  Printer,
  ChevronRight
} from 'lucide-react';

interface PatientExam {
  id: string | number;
  paciente_id: string | number;
  tipo?: string;
  data_exame?: string;
  usuario?: string;
}

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
  onSelectExam: (examId: string) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  onBack,
  onNavigate,
  onSelectExam
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'overview' | 'reports'>('history');
  const [patientExams, setPatientExams] = useState<PatientExam[]>([]);

  useEffect(() => {
    fetch('/exames', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        const exams = Array.isArray(data) ? data : [];
        setPatientExams(exams.filter((exam) => String(exam.paciente_id) === String(patient.id)));
      })
      .catch(() => setPatientExams([]));
  }, [patient.id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#131b2e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao diretório de pacientes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir resumo</span>
          </button>
          <button
            onClick={() => onNavigate('imaging_queue')}
            className="ai-gradient text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-all"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Novo exame</span>
          </button>
        </div>
      </div>

      {/* Patient Master Bento Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#131b2e] text-[#89f5e7] text-2xl font-bold flex items-center justify-center shadow-md">
                {patient.name.split(' ').map((n) => n[0]).join('')}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-[#131b2e]">{patient.name}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#89f5e7]/20 text-[#0c9488]">
                  {patient.status}
                </span>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {patient.gender} • {patient.age} anos • Processo: {patient.mrn}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-semibold text-slate-500">Condições ativas:</span>
                {patient.activeConditions.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Tipo sanguíneo
              </span>
              <span className="font-bold text-[#131b2e] text-sm">{patient.bloodType}</span>
            </div>
            <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 min-w-[140px]">
              <span className="text-[10px] font-semibold uppercase text-red-500 block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Alergias
              </span>
              <span className="font-bold text-[#ba1a1a] text-sm">
                {patient.allergies.join(', ') || 'Nenhuma conhecida'}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Altura / peso
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {patient.height} • {patient.weight}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[130px]">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Médico responsável
              </span>
              <span className="font-bold text-slate-800 text-sm">{patient.primaryCare}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 pt-4 text-xs font-semibold no-print">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-[#0058be] text-[#0058be]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Histórico ({patientExams.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#0058be] text-[#0058be]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Resumo clínico
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'reports'
                ? 'border-[#0058be] text-[#0058be]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Laudos
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">
              Exames de imagem
            </h3>
            <span className="text-xs text-slate-400">Dados registados neste protótipo</span>
          </div>

          {patientExams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
              Este paciente ainda não tem exames. Use «Novo exame» para registar o primeiro.
            </div>
          ) : patientExams.map((exam) => (
            <div key={exam.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#131b2e]">{exam.tipo || 'Exame de imagem'}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {exam.data_exame ? new Date(exam.data_exame).toLocaleString('pt-PT') : 'Data não registada'}
                    {exam.usuario ? ` • Registado por ${exam.usuario}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectExam(String(exam.id));
                    onNavigate('ai_diagnostics');
                  }}
                  className="ai-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <span>Ver análise</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700">
          <h3 className="font-bold text-slate-900 text-base">Resumo do paciente</h3>
          <p className="leading-relaxed">
            {patient.name} tem {patient.age} anos. O médico responsável é {patient.primaryCare}.
            Condições registadas: {patient.activeConditions.length ? patient.activeConditions.join(', ') : 'nenhuma'}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Última visita</span>
              <span className="font-bold text-slate-800 text-sm mt-1 block">{patient.lastVisit}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Exames registados</span>
              <span className="font-bold text-slate-800 text-sm mt-1 block">{patientExams.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Estado</span>
              <span className="font-bold text-[#0c9488] text-sm mt-1 block">{patient.status}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Laudos deste paciente</h3>
            <button
              onClick={() => onNavigate('reporting')}
              className="text-xs font-semibold text-[#0058be] hover:underline"
            >
              Abrir modelo de laudo
            </button>
          </div>
          {patientExams.length === 0 ? (
            <p className="text-xs text-slate-400">Ainda não há exames para gerar um laudo.</p>
          ) : (
            <div className="space-y-3">
              {patientExams.map((exam) => (
                <div key={exam.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{exam.tipo || 'Exame de imagem'}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {exam.data_exame ? new Date(exam.data_exame).toLocaleString('pt-PT') : 'Data não registada'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectExam(String(exam.id));
                      onNavigate('ai_diagnostics');
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#131b2e] hover:text-white transition-colors"
                  >
                    Ver análise
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
