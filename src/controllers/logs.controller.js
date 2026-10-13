const Log = require("../models/logs.model");

exports.createLog = async (req, res) => {
    try {
        await Log.create(req.body);
        res.json({ mensagem: "Log registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        console.log("GET /logs chamado"); // DEBUG
        const results = await Log.getAll();
        console.log("Logs encontrados:", results.length); // DEBUG
        res.json(results);
    } catch (err) {
        console.error("Erro ao listar logs:", err); // DEBUG
        res.status(500).json({ erro: err.message });
    }
};

exports.getLogById = async (req, res) => {
    try {
        console.log("GET /logs/:id chamado com ID:", req.params.id); // DEBUG
        const result = await Log.getById(req.params.id);
        if (!result) return res.status(404).json({ mensagem: "Log não encontrado" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getLogsByUser = async (req, res) => {
    try {
        console.log("GET /logs/user/:usuario_id chamado"); // DEBUG
        const results = await Log.getByUser(req.params.usuario_id);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        await Log.delete(req.params.id);
        res.json({ mensagem: "Log removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};