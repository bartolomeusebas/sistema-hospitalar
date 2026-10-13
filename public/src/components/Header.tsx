import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import {
  Search,
  AlertTriangle,
  Sparkles,
  Bell,
  Menu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
  onOpenEmergency: () => void;
  onOpenRunAi: () => void;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  user,
  onNavigate,
  onOpenEmergency,
  onOpenRunAi,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Critical Finding Flagged',
      desc: 'PT-8821: Potential pulmonary opacity detected.',
      time: '5m ago',
      urgent: true,
      patientId: 'PT-99421'
    },
    {
      id: 2,
      title: 'AI Analysis Complete',
      desc: 'PT-88492: Chest PA & Lateral analysis finished.',
      time: '12m ago',
      urgent: false,
      patientId: 'PT-88492'
    },
    {
      id: 3,
      title: 'GPU Cluster Optimal',
      desc: 'Compute load normalized at 65% utilization.',
      time: '1h ago',
      urgent: false
    }
  ];

  return (
    <header className="h-16 bg-white border-b border-[#e0e3e5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs no-print">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-72 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar pacientes, ID ou registros..."
            className="w-full h-10 pl-10 pr-4 bg-[#f2f4f6] border border-[#c6c6cd]/60 rounded-lg text-sm text-[#191c1e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
          />
        </div>
      </div>

      {/* Center: Tabs */}
      <nav className="hidden lg:flex items-center gap-8 h-full">
        <button
          onClick={() => onNavigate('imaging_queue')}
          className={`h-full flex items-center text-sm font-medium transition-colors ${
            currentView === 'imaging_queue'
              ? 'text-[#0058be] border-b-2 border-[#0058be] font-semibold'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Fila
        </button>
        <button
          onClick={() => onNavigate('admin_dashboard')}
          className={`h-full flex items-center text-sm font-medium transition-colors ${
            currentView === 'admin_dashboard'
              ? 'text-[#0058be] border-b-2 border-[#0058be] font-semibold'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Análises
        </button>
        <button
          onClick={() => onNavigate('patient_records')}
          className={`h-full flex items-center text-sm font-medium transition-colors ${
            currentView === 'patient_records'
              ? 'text-[#0058be] border-b-2 border-[#0058be] font-semibold'
              : 'text-slate-600 hover:text-[#0058be]'
          }`}
        >
          Arquivo
        </button>
      </nav>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Emergency Case CTA */}
        <button
          onClick={onOpenEmergency}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#ba1a1a]/30 text-[#ba1a1a] bg-red-50/50 hover:bg-red-100/60 font-semibold text-xs transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a]" />
          <span>Caso de emergência</span>
        </button>

        {/* Run AI Analysis CTA */}
        <button
          onClick={onOpenRunAi}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg ai-gradient text-white font-semibold text-xs shadow-xs hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Executar análise de IA</span>
          <span className="xs:hidden">Executar IA</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                  Notificações médicas
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                  1 urgente
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('ai_diagnostics');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-2.5 items-start"
                  >
                    {n.urgent ? (
                      <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden xl:block text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.title}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-semibold text-xs text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">License: {user.license}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('doctor_dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Painel médico</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('admin_dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Painel do sistema</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('admin_console');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Governação e definições</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
