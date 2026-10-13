import React, { useState } from 'react';
import { Mail, Lock, Shield, ArrowRight, Activity, CheckCircle, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('mendesjustino@gmail.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível iniciar sessão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[#e0e3e5]">
        {/* Left Side: Branding & AI Diagnostic Visualization */}
        <div className="md:w-1/2 bg-[#131b2e] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex text-white">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#0c9488] rounded-full opacity-15 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#0058be] rounded-full opacity-15 blur-3xl" />

          {/* Top Brand Info */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#89f5e7] border border-white/10 shadow-inner">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="font-bold text-2xl tracking-tight text-white">MediScan AI</h1>
            </div>
            <p className="text-[#bec6e0] text-sm lg:text-base leading-relaxed max-w-md">
              Precision Diagnostics powered by advanced artificial intelligence. Secure, reliable, and designed for modern healthcare professionals.
            </p>
          </div>

          {/* Holographic Diagnostic Imagery Simulation */}
          <div className="relative z-10 w-full h-56 lg:h-64 my-6 rounded-xl overflow-hidden bg-white/5 border border-white/15 flex items-center justify-center shadow-2xl group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4lUkDL34__NWwFeGXAfr3bitayIba10lRkxo1OFl8sTqVOv90hf8im6BFrV5kgBhrbFown3IUFc3ITuwW6Z4KYD5XC4EQjYRXH5NJxgyvkTUJTU717ZbOL7n6SIG3EC_ipSobsEl3jg5lKfCQ6Zmg_AzRQlz_wCI_Cfh1yHuJ6Ojqu766sA_-xCCje6JW4HV7T-UOwdHWj2jqgOs2xzvryoWdHnZK7DXV-46K0iWhEjoiGKDLeYIX"
              alt="AI Diagnostic Visualization"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#89f5e7] bg-[#131b2e]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#89f5e7]/30">
                <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-pulse" />
                <span>Núcleo neural v4.2 ativo • Diagnóstico multimodal</span>
              </div>
            </div>
          </div>

          {/* Compliance & Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#7c839b] font-medium pt-2 border-t border-white/10">
            <span>Segurança empresarial</span>
            <span className="flex items-center gap-1.5 text-[#bec6e0]">
              <Shield className="w-4 h-4 text-[#89f5e7]" />
              HIPAA Compliant
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white relative z-10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-[#89f5e7]">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl text-[#191c1e]">MediScan AI</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#191c1e] tracking-tight">Bem-vindo novamente</h2>
            <p className="text-sm text-slate-500 mt-1">
              Inicie sessão para aceder ao painel de diagnóstico.
            </p>
          </div>

          {/* Demo fast preset selector */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0c9488]" /> Seleção rápida de perfil:
              </span>
              <span className="text-[10px] text-slate-400">Clique para preencher</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('mendesjustino@gmail.com');
                  setPassword('123456');
                }}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  email === 'mendesjustino@gmail.com'
                    ? 'border-[#0058be] bg-blue-50/70 text-[#0058be] font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Mendes Justino (Médico)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('bartolomeusebas@gmail.com');
                  setPassword('123456');
                }}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  email === 'bartolomeusebas@gmail.com'
                    ? 'border-[#0058be] bg-blue-50/70 text-[#0058be] font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Bartolomeu (Administrador)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                E-mail profissional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="utilizador@hospital.org"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-sm text-[#191c1e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f7f9fb] border border-[#c6c6cd] rounded-xl text-sm text-[#191c1e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0058be] focus:ring-[#0058be] border-slate-300"
                />
                <span>Lembrar-me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact IT Helpdesk or your department system administrator for password recovery.'); }} className="text-[#0058be] hover:underline font-medium">
                Esqueceu a palavra-passe?
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#191c1e] text-white font-semibold text-sm hover:bg-[#333a4d] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>{isSubmitting ? 'A iniciar sessão...' : 'Iniciar sessão segura'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              Precisa de apoio técnico?{' '}
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('IT Helpdesk Hotline: (800) 555-MEDI (Ext 4040)\nEmergency Diagnostic Support: 24/7 Active');
                }}
                className="text-[#0058be] hover:underline font-medium"
              >
                Contactar o suporte informático
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
