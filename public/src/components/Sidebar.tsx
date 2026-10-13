import React from 'react';
import { ViewType } from '../types';
import {
  LayoutDashboard,
  FolderKanban,
  Boxes,
  BrainCircuit,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Stethoscope,
  Activity,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenNewAnalysis: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenNewAnalysis,
  onLogout,
  isMobileOpen,
  onCloseMobile
}) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: 'admin_dashboard',
      label: 'Painel do sistema',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'doctor_dashboard',
      label: 'Visão médica',
      icon: <Stethoscope className="w-5 h-5" />
    },
    {
      id: 'patient_records',
      label: 'Registros de pacientes',
      icon: <FolderKanban className="w-5 h-5" />
    },
    {
      id: 'imaging_queue',
      label: 'Fila de exames',
      icon: <Boxes className="w-5 h-5" />
    },
    {
      id: 'ai_diagnostics',
      label: 'Diagnóstico por IA',
      icon: <BrainCircuit className="w-5 h-5" />,
      badge: <span className="w-2 h-2 rounded-full bg-[#89f5e7] ai-pulse-ring" />
    },
    {
      id: 'reporting',
      label: 'Laudos',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'admin_console',
      label: 'Administração',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#131b2e] border-r border-[#7c839b]/20 flex flex-col z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto no-print`}
      >
        {/* Logo Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#7c839b]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#89f5e7] shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                MediScan AI
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7c839b]">
                Precision Diagnostics
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-[#7c839b] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={onOpenNewAnalysis}
            className="w-full ai-gradient text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:opacity-95 active:scale-[0.98] transition-all ai-glow"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nova análise</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'patient_records' && currentView === 'patient_detail');

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#89f5e7] bg-white/10 font-semibold border-l-4 border-[#89f5e7]'
                    : 'text-[#7c839b] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#89f5e7]' : 'text-[#7c839b]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-[#7c839b]/20 space-y-1 mt-auto">
          <button
            onClick={() => onNavigate('admin_console')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-[#7c839b] hover:text-white hover:bg-white/5 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Central de ajuda</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-[#7c839b] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};
