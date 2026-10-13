import React, { useState } from 'react';
import { ViewType, Patient } from '../types';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Image as ImageIcon,
  Loader2,
  Layers
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
  preview: string;
  dicomTag: string;
  file?: File;
}

interface ImagingQueueProps {
  patient: Patient;
  onNavigate: (view: ViewType) => void;
  onExamCreated: (examId: string) => void;
}

export const ImagingQueue: React.FC<ImagingQueueProps> = ({
  patient,
  onNavigate,
  onExamCreated
}) => {
  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [examTime, setExamTime] = useState(new Date().toTimeString().slice(0, 5));
  const [modality, setModality] = useState('Radiografia');
  const [indication, setIndication] = useState(
    'Tosse seca persistente e dor ao inspirar. Avaliar possível consolidação no lobo inferior.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          preview: previewUrl,
          dicomTag: 'User Uploaded Diagnostic Image'
          ,file
        }
      ]);
    }
  };

  const handleLoadSample = (sampleType: 'chest' | 'brain' | 'knee') => {
    if (sampleType === 'chest') {
      setUploadedFiles([
        {
          name: 'CHEST_PA_SAMPLE_DX.dcm',
          size: '32.4 MB',
          preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOaMouTjrWgGuWDVKJBcrjVUOR7DzYnkZLlc6eFumUckS4ZIEZB0m4EPSH3atnEHMYCoaXRo22rwAlYNVXW5ExyO4RGOm0TSkEj9V3DwJ8dc5dR0EViEp-6d_pbkK6W_z4Gsep7ls7XOj4nQfzBprZKGcYBSFAdF6MVFj165XL30hx8wsG6V84iDO7jkuGDGhFig7E95lTtg9Mz9f6YJLoxsbk77F4cRFrir-r27pVPKDNX9jABRSm',
          dicomTag: 'DICOM Series 001 • PA Chest'
        }
      ]);
      setModality('X-Ray (CR/DX)');
    } else if (sampleType === 'brain') {
      setUploadedFiles([
        {
          name: 'BRAIN_MRI_T2_FLAIR.dcm',
          size: '48.1 MB',
          preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4lUkDL34__NWwFeGXAfr3bitayIba10lRkxo1OFl8sTqVOv90hf8im6BFrV5kgBhrbFown3IUFc3ITuwW6Z4KYD5XC4EQjYRXH5NJxgyvkTUJTU717ZbOL7n6SIG3EC_ipSobsEl3jg5lKfCQ6Zmg_AzRQlz_wCI_Cfh1yHuJ6Ojqu766sA_-xCCje6JW4HV7T-UOwdHWj2jqgOs2xzvryoWdHnZK7DXV-46K0iWhEjoiGKDLeYIX',
          dicomTag: 'MRI Brain 3T • Axial T2'
        }
      ]);
      setModality('MRI');
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = uploadedFiles[0]?.file;
    if (!file) {
      setErrorMessage('Selecione um arquivo de imagem real antes de enviar o exame.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('paciente_id', patient.id);
      formData.append('tipo', modality);
      formData.append('descricao', indication);
      formData.append('data_exame', `${examDate}T${examTime}`);
      formData.append('imagem', file);

      const response = await fetch('/exames', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.mensagem || result.erro || 'Não foi possível registrar o exame.');
      onExamCreated(String(result.id));

      const analysisResponse = await fetch('/resultados/analisar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exame_id: result.id,
          tipoExame: modality,
          descricao: indication
        })
      });
      const analysisResult = await analysisResponse.json();
      if (!analysisResponse.ok) {
        throw new Error(analysisResult.mensagem || analysisResult.erro || 'O exame foi guardado, mas a análise não foi concluída.');
      }
      onNavigate('ai_diagnostics');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível registrar o exame.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
            Registar exame
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Coloque novos exames de imagem na fila para pré-análise automática por IA e revisão médica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('patient_detail')}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => alert('Examination draft saved to local queue.')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Guardar rascunho
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verified Patient Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#0c9488]" />
              <h3 className="font-bold text-[#131b2e] text-sm uppercase tracking-wider">
                Dados do paciente
              </h3>
            </div>
            <span className="text-xs font-bold text-[#0c9488] bg-[#89f5e7]/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> Identidade verificada
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Nome do paciente
              </span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{patient.name}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                ID / MRN do paciente
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                {patient.id}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Data de nascimento
              </span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {patient.dob} ({patient.age} anos)
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Médico responsável
              </span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {patient.primaryCare}
              </span>
            </div>
          </div>
        </div>

        {/* Examination Specifics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#131b2e] text-sm uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            Configuração do exame
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Data do exame</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Hora de aquisição</label>
              <input
                type="time"
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Modalidade</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <option>Radiografia</option>
                <option>Tomografia computorizada</option>
                <option>Ressonância magnética</option>
                <option>Ecografia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">
              Indicação clínica / notas médicas
            </label>
            <textarea
              rows={3}
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              placeholder="Detail patient symptoms, relevant history, and clinical inquiry..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0058be] leading-relaxed"
            />
          </div>
        </div>

        {/* Diagnostic Imagery Upload Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-[#131b2e] text-sm uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Diagnostic Imagery & DICOM
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Suporte para PNG e JPEG. Para análise por IA, converta ficheiros DICOM para imagem.
              </p>
            </div>

            {/* Fast preset sample buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Amostras rápidas:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('chest')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Chest X-Ray
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('brain')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Brain MRI
              </button>
            </div>
          </div>

          {/* Drag and drop upload box */}
          <label className="border-2 border-dashed border-slate-300 hover:border-[#0058be] bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0058be] mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Arraste uma imagem ou clique para procurar
            </p>
            <p className="text-xs text-slate-400 mt-1">
              A análise neural será iniciada após o registo
            </p>
            <input
              type="file"
              accept=".dcm,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Queued Image Files ({uploadedFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uploadedFiles.map((f, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={f.preview}
                        alt="Scan preview"
                        className="w-12 h-12 rounded-lg object-cover bg-black border border-slate-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{f.size} • {f.dicomTag}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto ai-gradient text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A executar segmentação neural...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Enviar para análise por IA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
