import React, { useState } from 'react';
import { Patient, ViewType } from '../types';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  FileText,
  Boxes
} from 'lucide-react';

interface PatientRecordsProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (view: ViewType) => void;
  onOpenAddPatient: () => void;
}

export const PatientRecords: React.FC<PatientRecordsProps> = ({
  patients,
  onSelectPatient,
  onNavigate,
  onOpenAddPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Gestão de pacientes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Diretório de pacientes registados, perfis clínicos e históricos de diagnóstico.
          </p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="ai-gradient text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Adicionar paciente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, ID ou MRN..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Estado:
          </span>
          {['Todos', 'Ativo', 'Em revisão', 'Em tratamento', 'Inativo'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-[#131b2e] text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Nome do paciente</th>
                <th className="px-5 py-4">ID / MRN do paciente</th>
                <th className="px-4 py-4">Idade / sexo</th>
                <th className="px-4 py-4">Última visita</th>
                <th className="px-4 py-4 text-center">Exames</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Nenhum paciente corresponde aos critérios de pesquisa.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient.id);
                      onNavigate('patient_detail');
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="px-6 py-4 font-semibold text-[#131b2e]">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#131b2e] text-white text-xs font-bold flex items-center justify-center">
                            {patient.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-[#0058be] transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-normal">
                            Primary: {patient.primaryCare}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {patient.id}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {patient.mrn}
                      </span>
                    </td>

                    {/* Demographics */}
                    <td className="px-4 py-4 text-slate-600">
                      <span>{patient.age} anos</span> •{' '}
                      <span>{patient.gender}</span>
                      <span className="block text-[11px] text-slate-400">
                        Nascimento: {patient.dob}
                      </span>
                    </td>

                    {/* Last Visit */}
                    <td className="px-4 py-4 text-slate-600 text-xs">
                      {patient.lastVisit}
                    </td>

                    {/* Exam Count */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                        {patient.examCount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                          patient.status === 'Em revisão'
                            ? 'bg-red-100 text-[#ba1a1a]'
                            : patient.status === 'Em tratamento'
                            ? 'bg-amber-100 text-amber-800'
                            : patient.status === 'Ativo'
                            ? 'bg-[#89f5e7]/20 text-[#0c9488]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient.id);
                            onNavigate('imaging_queue');
                          }}
                          title="Novo exame para o paciente"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0058be] hover:bg-slate-100 transition-colors"
                        >
                          <Boxes className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient.id);
                            onNavigate('patient_detail');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#131b2e] hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                        >
                          Ver perfil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            A mostrar <strong className="text-slate-800">{filteredPatients.length}</strong> de{' '}
            <strong className="text-slate-800">{patients.length}</strong> pacientes
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-[#131b2e] text-white font-semibold">
              1
            </button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">
              2
            </button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">
              3
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
