import React, { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { Patient } from '../types';

const API_BASE_URL = '/pacientes';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

type Gender = 'Masculino' | 'Feminino' | 'Outro';

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('Feminino');

  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [primaryCare, setPrimaryCare] = useState('');
  const [activeConditions, setActiveConditions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const mapGenderToSexo = (gender: Gender) => {
    switch (gender) {
      case 'Masculino':
        return 'M';
      case 'Feminino':
        return 'F';
      default:
        return 'O';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const resetForm = () => {
    setName('');
    setDob('');
    setGender('Feminino');
    setTelefone('');
    setEndereco('');
    setBloodType('');
    setAllergies('');
    setPrimaryCare('');
    setActiveConditions('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg(
        'Por favor, informe o nome completo do paciente.'
      );
      return;
    }

    if (!dob) {
      setErrorMsg(
        'Por favor, informe a data de nascimento.'
      );
      return;
    }

    const age = calculateAge(dob);

    if (age < 0 || age > 130) {
      setErrorMsg(
        'A data de nascimento informada não é válida.'
      );
      return;
    }

    const paciente = {
      nome: name.trim(),
      sexo: mapGenderToSexo(gender),
      data_nascimento: dob,
      telefone: telefone.trim(),
      endereco: endereco.trim(),
      tipo_sanguineo: bloodType || null,
      alergias: allergies.trim() || null,
      medico_responsavel: primaryCare.trim() || null,
      condicoes_ativas: activeConditions.trim() || null
    };

    console.log(
      'Dados enviados ao backend:',
      paciente
    );

    setIsSubmitting(true);

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
      });

      let resultado: any = {};

      try {
        resultado = await response.json();
      } catch {
        resultado = {};
      }

      if (!response.ok) {
        const mensagem =
          resultado.message ||
          resultado.error ||
          resultado.erro ||
          'Não foi possível cadastrar o paciente.';

        throw new Error(mensagem);
      }

      console.log(
        'Paciente cadastrado:',
        resultado
      );

      const pacienteId =
        resultado.id ||
        resultado.paciente_id ||
        resultado.insertId ||
        `PT-${Date.now()}`;

      const novoPaciente: Patient = {
        id: String(pacienteId),

        mrn: resultado.mrn
          ? String(resultado.mrn)
          : `MRN-${String(pacienteId).padStart(6, '0')}`,

        name: name.trim(),

        gender,

        dob,

        age,

        bloodType:
          bloodType || 'Não informado',

        allergies: allergies
          ? allergies
              .split(',')
              .map(item => item.trim())
              .filter(Boolean)
          : [],

        height: 'Não informado',

        weight: 'Não informado',

        primaryCare:
          primaryCare.trim() ||
          'Não atribuído',

        activeConditions: activeConditions
          ? activeConditions
              .split(',')
              .map(item => item.trim())
              .filter(Boolean)
          : [],

        lastVisit: 'Hoje',

        status: 'Ativo',

        examCount: 0
      };

      onAddPatient(novoPaciente);

      setSuccessMsg(
        'Paciente cadastrado com sucesso!'
      );

      setTimeout(() => {
        resetForm();
        onClose();
      }, 700);

    } catch (error: any) {
      console.error(
        'Erro ao cadastrar paciente:',
        error
      );

      setErrorMsg(
        error?.message ||
        'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
        bg-black/60
        backdrop-blur-sm
        animate-in
        fade-in
        duration-200
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          max-w-lg
          w-full
          max-h-[90vh]
          overflow-y-auto
          p-6
          shadow-2xl
          border
          border-slate-200
        "
      >

        {/* CABEÇALHO */}

        <div
          className="
            flex items-center
            justify-between
            pb-4
            mb-5
            border-b
            border-slate-100
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                w-10 h-10
                rounded-xl
                bg-slate-100
                text-[#131b2e]
                flex items-center
                justify-center
              "
            >
              <UserPlus className="w-5 h-5" />
            </div>

            <div>
              <h3
                className="
                  font-bold
                  text-lg
                  text-[#131b2e]
                "
              >
                Cadastrar Novo Paciente
              </h3>

              <p className="text-xs text-slate-500">
                Preencha os dados do paciente para criar um novo registro.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="
              p-1.5
              rounded-lg
              text-slate-400
              hover:text-slate-700
              hover:bg-slate-100
              disabled:opacity-50
            "
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* FORMULÁRIO */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs sm:text-sm"
        >

          {/* ERRO */}

          {errorMsg && (
            <div
              className="
                p-3
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-red-600
                text-xs
              "
            >
              {errorMsg}
            </div>
          )}

          {/* SUCESSO */}

          {successMsg && (
            <div
              className="
                p-3
                rounded-xl
                bg-green-50
                border
                border-green-200
                text-green-600
                text-xs
              "
            >
              {successMsg}
            </div>
          )}

          {/* NOME */}

          <div>
            <label
              className="
                font-semibold
                text-slate-700
                block
                mb-1
              "
            >
              Nome Completo *
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Ex.: João Manuel"
              className="
                w-full
                p-2.5
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                focus:ring-2
                focus:ring-[#0058be]
                focus:outline-none
              "
            />
          </div>

          {/* DATA + SEXO */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Data de Nascimento *
              </label>

              <input
                type="date"
                required
                value={dob}
                onChange={(e) =>
                  setDob(e.target.value)
                }
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              />
            </div>

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Sexo
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value as Gender
                  )
                }
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              >
                <option value="Feminino">
                  Feminino
                </option>

                <option value="Masculino">
                  Masculino
                </option>

                <option value="Outro">
                  Outro
                </option>
              </select>
            </div>

          </div>

          {/* TELEFONE + ENDEREÇO */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Telefone
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
                placeholder="Ex.: 923 000 000"
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              />
            </div>

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Endereço
              </label>

              <input
                type="text"
                value={endereco}
                onChange={(e) =>
                  setEndereco(e.target.value)
                }
                placeholder="Ex.: Uíge, Centro"
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              />
            </div>

          </div>

          {/* TIPO SANGUÍNEO + MÉDICO */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Tipo Sanguíneo
              </label>

              <select
                value={bloodType}
                onChange={(e) =>
                  setBloodType(e.target.value)
                }
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              >
                <option value="">
                  Não informado
                </option>

                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            <div>
              <label
                className="
                  font-semibold
                  text-slate-700
                  block
                  mb-1
                "
              >
                Médico Responsável
              </label>

              <input
                type="text"
                value={primaryCare}
                onChange={(e) =>
                  setPrimaryCare(e.target.value)
                }
                placeholder="Ex.: Dr. João Silva"
                className="
                  w-full
                  p-2.5
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-[#0058be]
                  focus:outline-none
                "
              />
            </div>

          </div>

          {/* ALERGIAS */}

          <div>
            <label
              className="
                font-semibold
                text-slate-700
                block
                mb-1
              "
            >
              Alergias Conhecidas
            </label>

            <input
              type="text"
              value={allergies}
              onChange={(e) =>
                setAllergies(e.target.value)
              }
              placeholder="Ex.: Penicilina, Látex"
              className="
                w-full
                p-2.5
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                focus:ring-2
                focus:ring-[#0058be]
                focus:outline-none
              "
            />

            <p className="text-[11px] text-slate-400 mt-1">
              Separe várias alergias usando vírgulas.
            </p>
          </div>

          {/* CONDIÇÕES */}

          <div>
            <label
              className="
                font-semibold
                text-slate-700
                block
                mb-1
              "
            >
              Condições ou Sintomas Atuais
            </label>

            <input
              type="text"
              value={activeConditions}
              onChange={(e) =>
                setActiveConditions(e.target.value)
              }
              placeholder="Ex.: Hipertensão, Asma"
              className="
                w-full
                p-2.5
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                focus:ring-2
                focus:ring-[#0058be]
                focus:outline-none
              "
            />

            <p className="text-[11px] text-slate-400 mt-1">
              Separe várias condições usando vírgulas.
            </p>
          </div>

          {/* BOTÕES */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              pt-3
            "
          >

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                px-4
                py-2
                border
                border-slate-200
                hover:bg-slate-50
                rounded-xl
                font-semibold
                text-slate-700
                text-xs
                sm:text-sm
                disabled:opacity-50
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                ai-gradient
                text-white
                font-semibold
                text-xs
                sm:text-sm
                px-6
                py-2.5
                rounded-xl
                shadow-md
                flex
                items-center
                gap-2
                hover:opacity-90
                active:scale-95
                transition-all
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <Check className="w-4 h-4" />

              <span>
                {isSubmitting
                  ? 'A guardar...'
                  : 'Cadastrar Paciente'}
              </span>

            </button>

          </div>

        </form>
      </div>
    </div>
  );
};