const Paciente = require("../models/paciente.model");

exports.getAll = async (req, res) => {
    try {
        const pacientes = await Paciente.getAll();
        res.json(pacientes);
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

        res.json(paciente);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await Paciente.create(req.body);
        res.json({ mensagem: "Paciente criado!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        await Paciente.update(req.params.id, req.body);
        res.json({ mensagem: "Atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Paciente.delete(req.params.id);
        res.json({ mensagem: "Eliminado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};