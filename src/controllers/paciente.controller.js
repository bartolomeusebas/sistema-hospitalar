const Paciente = require("../models/paciente.model");

const calculateAge = (date) => {
    if (!date) return 0;
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const mapGender = (sexo) => {
    const value = String(sexo || "").trim().toLowerCase();
    if (value === "m" || value === "masculino" || value === "male") return "Masculino";
    if (value === "f" || value === "feminino" || value === "female") return "Feminino";
    return "Outro";
};

const mapStatus = (status) => {
    const labels = {
        Active: "Ativo",
        Inactive: "Inativo",
        "Needs Review": "Em revisão",
        "In Treatment": "Em tratamento",
        Stable: "Estável"
    };
    return labels[status] || status || "Ativo";
};

const presentPatient = (patient) => {
    if (!patient) return null;
    const id = String(patient.id);
    return {
        id,
        mrn: patient.mrn || `MRN-${id.padStart(6, "0")}`,
        name: patient.nome,
        gender: mapGender(patient.sexo),
        dob: patient.data_nascimento,
        age: calculateAge(patient.data_nascimento),
        bloodType: patient.tipo_sanguineo || "Não informado",
        allergies: patient.alergias ? String(patient.alergias).split(",").map((item) => item.trim()).filter(Boolean) : [],
        height: patient.altura || "Não informado",
        weight: patient.peso || "Não informado",
        primaryCare: patient.medico_responsavel || "Não atribuído",
        activeConditions: patient.condicoes_ativas ? String(patient.condicoes_ativas).split(",").map((item) => item.trim()).filter(Boolean) : [],
        lastVisit: patient.ultima_visita || "Sem visitas registradas",
        status: mapStatus(patient.status),
        examCount: Number(patient.exam_count || 0),
        avatar: patient.avatar || undefined
    };
};

exports.getAll = async (req, res) => {
    try {
        const pacientes = await Paciente.getAll();
        res.json(pacientes.map(presentPatient));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const paciente = await Paciente.getById(req.params.id);

        if (!paciente) {
            return res.status(404).json({ mensagem: "Paciente não encontrado" });
        }

        res.json(presentPatient(paciente));
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await Paciente.create(req.body);
        const paciente = await Paciente.getById(result.insertId);
        res.status(201).json({ mensagem: "Paciente criado!", id: result.insertId, paciente: presentPatient(paciente) });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const result = await Paciente.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Paciente não encontrado" });
        }
        res.json({ mensagem: "Atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Paciente.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Paciente não encontrado" });
        }
        res.json({ mensagem: "Eliminado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};