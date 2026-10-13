import React, { useState } from 'react';
import { Patient, ExaminationHistory, ViewType } from '../types';
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  FileText,
  Boxes,
  Activity,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Shield,
  Loader2
} from 'lucide-react';

interface PatientDetailProps {
  patient: Patient;
  examinations: ExaminationHistory[];
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
  onSelectExam: (examId: string) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  examinations,
  onBack,
  onNavigate,
  onSelectExam
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'overview' | 'reports'>('history');

  const patientExams = examinations.filter((e) => e.patientId === patient.id);

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
                {patient.gender} • {patient.age} years old • MRN: {patient.mrn}
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
                Blood Type
              </span>
              <span className="font-bold text-[#131b2e] text-sm">{patient.bloodType}</span>
            </div>
            <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 min-w-[140px]">
              <span className="text-[10px] font-semibold uppercase text-red-500 block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Allergies
              </span>
              <span className="font-bold text-[#ba1a1a] text-sm">
                {patient.allergies.join(', ') || 'None Known'}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Height / Weight
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {patient.height} • {patient.weight}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[130px]">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Primary Care
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
            Chronological History ({patientExams.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#0058be] text-[#0058be]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'reports'
                ? 'border-[#0058be] text-[#0058be]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Radiology Reports
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">
              Diagnostic Imaging Timeline
            </h3>
            <span className="text-xs text-slate-400">Todas as datas em UTC / hora local da unidade</span>
          </div>

          {/* Timeline Cards */}
          {patientExams.map((exam) => (
            <div
              key={exam.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                exam.status === 'Analyzing'
                  ? 'border-blue-200 bg-blue-50/20'
                  : exam.urgent
                  ? 'border-red-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Left Exam Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {exam.date}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exam.modality}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Acc: {exam.accessionNumber}
                    </span>
                    {exam.status === 'Analyzing' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-[#0058be] px-2.5 py-0.5 rounded-full">
                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing
                      </span>
                    ) : exam.urgent ? (
                      <span className="text-[11px] font-bold bg-red-100 text-[#ba1a1a] px-2.5 py-0.5 rounded-full">
                        Urgent Finding
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-[#89f5e7]/20 text-[#0c9488] px-2.5 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#131b2e]">{exam.study}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Referring Physician:{' '}
                      <strong className="text-slate-700">{exam.referringPhysician}</strong>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Indication:
                    </span>
                    <p className="text-slate-600">{exam.indication}</p>
                  </div>

                  <div className="text-xs">
                    <span className="font-semibold text-slate-700 block mb-0.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#0c9488]" /> AI Findings Summary:
                    </span>
                    <p className="text-slate-600 leading-relaxed">{exam.findingsSummary}</p>
                  </div>

                  {exam.status === 'Analyzing' && (
                    <div className="pt-2">
                      <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mb-1.5">
                        <div className="ai-gradient h-2 rounded-full w-3/4 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-[#0058be] font-medium">
                        Deep learning model inferring nodules, opacities, and pleural margins...
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side: Score Ring & Action */}
                <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-4 shrink-0 w-full lg:w-44 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6">
                  {exam.status === 'Complete' && (
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16 mb-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={exam.urgent ? '#ba1a1a' : '#0c9488'}
                            strokeWidth="3.5"
                            strokeDasharray={`${exam.confidenceScore}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className={`text-xs font-bold ${
                              exam.urgent ? 'text-[#ba1a1a]' : 'text-[#0c9488]'
                            }`}
                          >
                            {exam.confidenceScore}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase text-slate-500">
                        {exam.confidenceType}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      onSelectExam(exam.id);
                      onNavigate('ai_diagnostics');
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      exam.status === 'Analyzing'
                        ? 'bg-blue-50 text-[#0058be] border border-blue-200 hover:bg-blue-100'
                        : 'ai-gradient text-white shadow-xs hover:opacity-90'
                    }`}
                  >
                    <span>{exam.status === 'Analyzing' ? 'Live Monitor' : 'View Scans'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700">
          <h3 className="font-bold text-slate-900 text-base">Avaliação clínica longitudinal</h3>
          <p className="leading-relaxed">
            Patient PT-88492 is managed for mild hypertension and type 2 diabetes with good glycemic control. Most recent imaging reflects evaluation for seasonal respiratory symptoms with no underlying acute cardiomegaly or mass lesions detected.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Last Chest X-Ray
              </span>
              <span className="font-bold text-slate-800 text-sm mt-1 block">
                Today, 09:15 AM
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                Cumulative Scans
              </span>
              <span className="font-bold text-slate-800 text-sm mt-1 block">
                4 Diagnostic Exams
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                AI Risk Profile
              </span>
              <span className="font-bold text-[#0c9488] text-sm mt-1 block">
                Low Overall Risk (12%)
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Laudos radiológicos arquivados</h3>
            <button
              onClick={() => onNavigate('reporting')}
              className="text-xs font-semibold text-[#0058be] hover:underline"
            >
              Open Report Generator
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 hover:border-[#0058be] transition-colors flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Report #MS-2023-8942 • Chest PA Diagnostic
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Signed by Dr. Emily Smith, MD • Oct 12, 2023
                </p>
              </div>
              <button
                onClick={() => onNavigate('reporting')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#131b2e] hover:text-white transition-colors"
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
