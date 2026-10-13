import React, { useEffect, useState } from 'react';
import { ViewType } from '../types';
import {
  Users,
  Stethoscope,
  Activity,
  BrainCircuit,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: ViewType) => void;
  onSelectPatient: (patientId: string) => void;
  onSelectExam: (examId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onSelectPatient,
  onSelectExam
}) => {
  const [timeRange, setTimeRange] = useState('Últimos 30 dias');
  const [patients, setPatients] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/pacientes', { credentials: 'include' }).then((response) => response.json()),
      fetch('/exames', { credentials: 'include' }).then((response) => response.json()),
      fetch('/resultados', { credentials: 'include' }).then((response) => response.json()),
      fetch('/usuarios', { credentials: 'include' }).then((response) => response.json())
    ]).then(([patientData, examData, resultData, userData]) => {
      setPatients(Array.isArray(patientData) ? patientData : []);
      setExams(Array.isArray(examData) ? examData : []);
      setResults(Array.isArray(resultData) ? resultData : []);
      setDoctors(Array.isArray(userData) ? userData.filter((item) => item.tipo === 'medico' || item.tipo === 'doctor') : []);
    }).catch(() => undefined);
  }, []);

  const chartData = [
    { day: 'Seg', total: 0, ai: 0 }, { day: 'Ter', total: 0, ai: 0 },
    { day: 'Qua', total: 0, ai: 0 }, { day: 'Qui', total: 0, ai: 0 },
    { day: 'Sex', total: 0, ai: 0 }, { day: 'Sáb', total: 0, ai: 0 },
    { day: 'Dom', total: 0, ai: 0 }
  ];

  const recentExams = exams.slice(0, 4).map((exam) => ({
    id: String(exam.paciente_id), examId: String(exam.id), type: exam.tipo,
    status: results.some((result) => result.exame_id === exam.id) ? 'Complete' : 'Analyzing',
    time: new Date(exam.data_exame).toLocaleString('pt-PT'), urgent: false
  }));

  const pendingList = exams
    .filter((exam) => !results.some((result) => result.exame_id === exam.id))
    .slice(0, 4)
    .map((exam) => ({
      id: String(exam.id),
      title: exam.tipo || 'Exame de imagem',
      description: `Exame de ${exam.paciente || 'paciente'} aguardando análise.`,
      patientId: String(exam.paciente_id),
      priority: 'Standard' as const
    }));

  const handleAssignDoctor = (reviewId: string) => {
    alert(`Caso ${reviewId} encaminhado para revisão médica.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Painel do sistema
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visão geral das métricas da unidade e do desempenho do diagnóstico por IA.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-none focus:outline-none cursor-pointer"
          >
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Este trimestre</option>
            <option>Desde o início do ano</option>
          </select>
        </div>
      </div>

      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-[#0058be]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#131b2e]">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[#0c9488] bg-[#89f5e7]/20 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> 4.2%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Total de pacientes
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-[#131b2e]">{patients.length}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-[#0058be]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#131b2e]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              Estável
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Médicos ativos
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-[#131b2e]">{doctors.length}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-[#0058be]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#131b2e]">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-semibold text-[#0c9488] bg-[#89f5e7]/20 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> 12.5%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Exames realizados
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-[#131b2e]">{exams.length}</p>
        </div>

        {/* Card 4 (AI Adoption Focus) */}
        <div className="bg-white border border-[#0c9488]/30 rounded-2xl p-5 shadow-xs relative overflow-hidden ai-glow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#89f5e7]/20 flex items-center justify-center text-[#0c9488]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 bg-[#89f5e7]/20 text-[#0c9488] text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-ping" />
              <span>IA ativa</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Analisados por IA
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl lg:text-3xl font-bold text-[#131b2e]">{results.length}</p>
            <span className="text-xs font-semibold text-[#0c9488]">{exams.length ? Math.round((results.length / exams.length) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Exam Volume & AI Utilization */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col p-6">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                Volume de exames e utilização da IA
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribuição diária por modalidade</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive CSS / SVG Chart */}
          <div className="flex-1 min-h-[260px] flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 relative">
            {/* Horizontal Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="w-full border-b border-dashed border-slate-200" />
              <div className="w-full border-b border-dashed border-slate-200" />
              <div className="w-full border-b border-dashed border-slate-200" />
              <div className="w-full border-b border-dashed border-slate-200" />
            </div>

            {/* Bars */}
            {chartData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {/* Total Exams bar */}
                  <div
                    style={{ height: `${(item.total / 300) * 100}%` }}
                    className="w-3.5 sm:w-5 bg-[#bec6e0] rounded-t-md group-hover:bg-[#a8b4d8] transition-all relative"
                    title={`Total: ${item.total}`}
                  />
                  {/* AI Analyzed bar */}
                  <div
                    style={{ height: `${(item.ai / 300) * 100}%` }}
                    className="w-3.5 sm:w-5 bg-[#0c9488] rounded-t-md group-hover:bg-[#0f766e] transition-all relative shadow-xs"
                    title={`AI Analyzed: ${item.ai}`}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-[#131b2e]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-xs bg-[#bec6e0]" />
              <span>Total de exames</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-xs bg-[#0c9488]" />
                  <span>Analisados por IA</span>
            </div>
          </div>
        </div>

        {/* Secondary Side: Donut & Compute */}
        <div className="flex flex-col gap-6">
          {/* AI Findings Distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                AI Findings Distribution
              </h3>
              <Sparkles className="w-4 h-4 text-[#0c9488]" />
            </div>

            {/* Donut graphic */}
            <div className="my-6 flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle (Abnormal 22%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#ffdad6"
                    strokeWidth="4"
                  />
                  {/* Foreground Circle (Normal 78%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#0c9488"
                    strokeWidth="4"
                    strokeDasharray="78, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#131b2e]">3.8k</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total de exames
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Normal</p>
                <p className="text-lg font-bold text-[#0c9488]">78%</p>
              </div>
              <div className="p-2 rounded-xl bg-red-50/60">
                <p className="text-xs text-slate-500">Anormal / sinalizado</p>
                <p className="text-lg font-bold text-[#ba1a1a]">22%</p>
              </div>
            </div>
          </div>

          {/* System Compute Load */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                Carga computacional do sistema
              </h3>
              <span className="text-[11px] font-bold text-[#0c9488] bg-[#89f5e7]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0c9488] animate-ping" />
                Ideal
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div className="ai-gradient h-2.5 rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Cluster Tensor NVIDIA A100</span>
              <span className="font-semibold text-slate-800">65% utilizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Lists: Recent Exams & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Exames recentes
            </h3>
            <button
              onClick={() => onNavigate('patient_records')}
              className="text-xs font-semibold text-[#0058be] hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ID do paciente</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado da IA</th>
                  <th className="px-5 py-3 text-right">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentExams.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      onSelectPatient('PT-88492');
                      onNavigate('ai_diagnostics');
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-[#131b2e]">
                      {row.id}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{row.type}</td>
                    <td className="px-4 py-3.5">
                      {row.status === 'Complete' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#89f5e7]/20 text-[#0c9488] font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Concluído
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                          <Loader2 className="w-3 h-3 animate-spin" /> A analisar
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-500">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Medical Reviews */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col p-5">
          <div className="flex justify-between items-center pb-4 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
              Revisões médicas pendentes
            </h3>
            <span className="bg-red-100 text-[#ba1a1a] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {pendingList.length} pendentes
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-80">
            {pendingList.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">Não existem revisões pendentes.</p>
            ) : pendingList.map((review) => (
              <div
                key={review.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0058be] bg-white transition-all flex gap-3 items-start"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    review.priority === 'Urgent'
                      ? 'bg-red-100 text-[#ba1a1a]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {review.priority === 'Urgent' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <ClipboardCheck className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-[#131b2e] truncate">
                      {review.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 ml-2">
                      {review.patientId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {review.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        review.priority === 'Urgent' ? 'text-[#ba1a1a]' : 'text-slate-500'
                      }`}
                    >
                      {review.priority}
                    </span>
                    <button
                      onClick={() => {
                        if (review.priority === 'Urgent') {
                          handleAssignDoctor(review.id);
                        } else {
                          onSelectPatient(review.patientId);
                          onNavigate('ai_diagnostics');
                        }
                      }}
                      className="text-xs font-semibold text-[#0058be] hover:underline"
                    >
                      {review.priority === 'Urgent' ? 'Assign Doctor' : 'Review Scan'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
