const Historico = require("../models/historico_clinico.model");

exports.createHistorico = async (req, res) => {
    try {
        await Historico.create(req.body);
        res.json({ mensagem: "Histórico clínico registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getHistoricos = async (req, res) => {
    try {
        const results = await Historico.getAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getHistoricoById = async (req, res) => {
    try {
        const result = await Historico.getById(req.params.id);
        if (!result) return res.status(404).json({ mensagem: "Histórico não encontrado" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getHistoricoByPaciente = async (req, res) => {
    try {
        const results = await Historico.getByPaciente(req.params.paciente_id);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.updateHistorico = async (req, res) => {
    try {
        await Historico.update(req.params.id, req.body);
        res.json({ mensagem: "Histórico atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deleteHistorico = async (req, res) => {
    try {
        await Historico.delete(req.params.id);
        res.json({ mensagem: "Histórico removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};