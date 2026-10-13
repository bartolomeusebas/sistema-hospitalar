import React, { useEffect, useState } from 'react';
import { ViewType, Patient, UserProfile, ScheduleItem } from '../types';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (view: ViewType) => void;
  onSelectPatient: (patientId: string) => void;
  patients: Patient[];
  user: UserProfile;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onNavigate,
  onSelectPatient,
  patients,
  user
}) => {
const [patientSearch, setPatientSearch] = useState('');
const schedule: ScheduleItem[] = [];
const normalizedSearch = patientSearch.trim().toLowerCase();

const filteredPatients = patients.filter(
  (patient) =>
    patient.name.toLowerCase().includes(normalizedSearch) ||
    patient.id.toString().toLowerCase().includes(normalizedSearch)
);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#131b2e] to-[#1c294a] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#89f5e7]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#89f5e7]/20 text-[#89f5e7] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Department of Radiology
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bom dia, {user.name}
          </h2>
          <p className="text-[#bec6e0] text-sm mt-1 max-w-xl">
            Here is your daily clinical overview. You have{' '}
            <strong className="text-[#89f5e7]">3 revisões de IA prioritárias</strong> aguardando confirmação.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('imaging_queue')}
            className="ai-gradient text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Iniciar novo exame</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Awaiting Reviews & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Analyses Awaiting Review */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />
              Análises de IA aguardando revisão
            </h3>
            <span className="text-xs text-slate-500 font-medium">Ordenadas por gravidade</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            As análises pendentes serão apresentadas aqui quando existirem exames reais no sistema.
          </div>

          {/* Card 1: High Priority Urgent */}
          <div className="hidden">
          <div className="bg-white border-2 border-red-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular ring */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#ba1a1a"
                      strokeWidth="3.5"
                      strokeDasharray="94, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-[#ba1a1a]">94%</span>
                    <span className="text-[8px] font-semibold text-slate-400">Risco</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-[#131b2e]">Raio-X do tórax - vista PA</h4>
                    <span className="bg-red-100 text-[#ba1a1a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Urgent
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patient: <strong className="text-slate-700">Robert Chen</strong> (ID: PT-99421)
                  </p>
                  <p className="text-xs text-slate-600 mt-1 bg-red-50/70 text-red-900 px-2.5 py-1 rounded-md border border-red-200/50 inline-block font-medium">
                    AI Insight: Focal consolidation opacity in right lower lobe (Pneumonia flag).
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPatient('PT-99421');
                  onNavigate('ai_diagnostics');
                }}
                className="w-full sm:w-auto ai-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shrink-0"
              >
                <span>Revisar exame</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Routine Check */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular ring */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#0c9488"
                      strokeWidth="3.5"
                      strokeDasharray="12, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-[#0c9488]">12%</span>
                    <span className="text-[8px] font-semibold text-slate-400">Risco</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-[#131b2e]">MRI Brain w/ Contrast</h4>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Routine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patient: <strong className="text-slate-700">Sarah Jenkins</strong> (ID: PT-88312)
                  </p>
                  <p className="text-xs text-slate-600 mt-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/50 inline-block font-medium">
                    AI Insight: Ventricular size and sulcal pattern within normal limits for age.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => alert('Quick sign-off completed for Sarah Jenkins.')}
                  className="w-1/2 sm:w-auto border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                >
                  Sign Off
                </button>
                <button
                  onClick={() => {
                    onSelectPatient('PT-88312');
                    onNavigate('ai_diagnostics');
                  }}
                  className="w-1/2 sm:w-auto bg-[#131b2e] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1f2b48] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Revisar exame</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Schedule */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Agenda do dia
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">{schedule.length} agendados</span>
            </div>

            <div className="space-y-3.5">
              {schedule.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">Não existem consultas agendadas.</p>
              ) : schedule.map((item) => (
                <div key={item.id} className="flex gap-3 items-start relative pb-3 border-b border-slate-50 last:border-none">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      item.status === 'completed'
                        ? 'bg-[#89f5e7]/20 text-[#0c9488]'
                        : item.status === 'in_progress'
                        ? 'bg-blue-100 text-[#0058be] ring-2 ring-blue-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#131b2e]">{item.title}</p>
                      <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{item.patientName}</p>
                    <span className="text-[10px] text-slate-400">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert('Full doctor schedule calendar sync active.')}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl transition-colors text-center"
          >
            Open Full Calendar
          </button>
        </div>
      </div>

      {/* Bottom Section: My Patients Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">
              My Assigned Patients
            </h3>
              <p className="text-xs text-slate-400 mt-0.5">Acesso rápido aos pacientes atuais</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Filtrar pacientes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0058be]"
              />
            </div>
            <button
              onClick={() => onNavigate('patient_records')}
              className="text-xs font-semibold text-[#0058be] hover:underline whitespace-nowrap"
            >
              Todos os registos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Paciente</th>
                <th className="px-4 py-3">MRN / ID</th>
                <th className="px-4 py-3">Age / Sex</th>
                <th className="px-4 py-3">Condições ativas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((pt) => (
                <tr
                  key={pt.id}
                  onClick={() => {
                    onSelectPatient(pt.id);
                    onNavigate('patient_detail');
                  }}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-[#131b2e] flex items-center gap-2.5">
                    {pt.avatar ? (
                      <img src={pt.avatar} alt={pt.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#131b2e] text-white text-[10px] font-bold flex items-center justify-center">
                        {pt.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                    <span>{pt.name}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">{pt.id}</td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {pt.age} yrs • {pt.gender}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {pt.activeConditions.map((cond, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        pt.status === 'Needs Review'
                          ? 'bg-red-100 text-[#ba1a1a]'
                          : pt.status === 'In Treatment'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#89f5e7]/20 text-[#0c9488]'
                      }`}
                    >
                      {pt.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(pt.id);
                        onNavigate('patient_detail');
                      }}
                      className="text-xs font-semibold text-[#0058be] hover:underline"
                    >
                      Abrir perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
