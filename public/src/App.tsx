import React, { useState } from 'react';
import { ViewType, Patient, UserProfile } from './types';
import { currentUser as defaultUser } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientRecords } from './components/PatientRecords';
import { PatientDetail } from './components/PatientDetail';
import { AiDiagnostics } from './components/AiDiagnostics';
import { ImagingQueue } from './components/ImagingQueue';
import { Reporting } from './components/Reporting';
import { AdminConsole } from './components/AdminConsole';
import { EmergencyModal } from './components/EmergencyModal';
import { RunAiModal } from './components/RunAiModal';
import { AddPatientModal } from './components/AddPatientModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // Modals & Mobile state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isRunAiOpen, setIsRunAiOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Active patient object
  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const readApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const body = await response.text();
      if (body.trimStart().startsWith('<!DOCTYPE') || body.includes('<html')) {
        throw new Error('A API não está disponível. Inicie o backend na porta 3000 com "npm start".');
      }
      throw new Error(`Resposta inválida da API (${response.status}).`);
    }
    return response.json();
  };

  const loadPatients = async () => {
    const response = await fetch('/pacientes', { credentials: 'include' });
    const data = await readApiResponse(response);
    if (!response.ok) throw new Error(data.mensagem || data.erro || 'Não foi possível carregar os pacientes.');
    setPatients(Array.isArray(data) ? data : data.pacientes || []);
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });
    const data = await readApiResponse(response);
    if (!response.ok) throw new Error(data.mensagem || data.erro || 'Usuário ou senha incorretos.');
    const role = data.user?.tipo === 'admin' ? 'admin' : 'doctor';
    setUser({
      ...defaultUser,
      name: data.user?.nome || defaultUser.name,
      email,
      role,
      title: role === 'admin' ? 'Administrador' : 'Médico',
      license: 'Demonstração TCC'
    });
    await loadPatients();
    setCurrentView(role === 'admin' ? 'admin_dashboard' : 'doctor_dashboard');
  };

  const handleLogout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    setCurrentView('login');
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
  };

  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    setCurrentView('patient_detail');
  };

  // If user is on the login screen
  if (currentView === 'login') {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        onOpenNewAnalysis={() => setCurrentView('imaging_queue')}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Header
          currentView={currentView}
          user={user}
          onNavigate={(view) => setCurrentView(view)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenRunAi={() => setIsRunAiOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchQuery={globalSearch}
          onSearchChange={(val) => {
            setGlobalSearch(val);
            if (val && currentView !== 'patient_records') {
              setCurrentView('patient_records');
            }
          }}
        />

        {/* View Switcher */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'admin_dashboard' && (
            <AdminDashboard
              onNavigate={(view) => setCurrentView(view)}
              onSelectPatient={handleSelectPatient}
              onSelectExam={handleSelectExam}
            />
          )}

          {currentView === 'doctor_dashboard' && (
            <DoctorDashboard
              onNavigate={(view) => setCurrentView(view)}
              onSelectPatient={(id) => {
                handleSelectPatient(id);
              }}
              onSelectExam={handleSelectExam}
              patients={patients}
              user={user}
            />
          )}

          {currentView === 'patient_records' && (
            <PatientRecords
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onNavigate={(view) => setCurrentView(view)}
              onOpenAddPatient={() => setIsAddPatientOpen(true)}
            />
          )}

          {(currentView === 'patient_detail' || currentView === 'ai_diagnostics' || currentView === 'imaging_queue' || currentView === 'reporting') && !activePatient && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
              Ainda não há pacientes registados. Crie um paciente para continuar a demonstração.
            </div>
          )}

          {currentView === 'patient_detail' && activePatient && (
            <PatientDetail
              patient={activePatient}
              onBack={() => setCurrentView('patient_records')}
              onNavigate={(view) => setCurrentView(view)}
              onSelectExam={handleSelectExam}
            />
          )}

          {currentView === 'ai_diagnostics' && activePatient && (
            <AiDiagnostics
              patient={activePatient}
              examId={selectedExamId}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'imaging_queue' && activePatient && (
            <ImagingQueue
              patient={activePatient}
              onExamCreated={handleSelectExam}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'reporting' && activePatient && (
            <Reporting
              patient={activePatient}
              user={user}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'admin_console' && (
            <AdminConsole onNavigate={(view) => setCurrentView(view)} />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
      />

      <RunAiModal
        isOpen={isRunAiOpen}
        onClose={() => setIsRunAiOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
      />

      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAddPatient={handleAddNewPatient}
      />
    </div>
  );
}
