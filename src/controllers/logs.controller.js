const Log = require("../models/logs.model");

// Criar log manual (ou automático)
exports.createLog = (req, res) => {
    const log = req.body;

    Log.create(log, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Log registrado com sucesso!" });
    });
};

// Listar logs
exports.getLogs = (req, res) => {
    Log.getAll((err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Buscar por ID
exports.getLogById = (req, res) => {
    const { id } = req.params;

    Log.getById(id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Log não encontrado" });
        }
        res.json(results[0]);
    });
};

// Buscar por usuário
exports.getLogsByUser = (req, res) => {
    const { usuario_id } = req.params;

    Log.getByUser(usuario_id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Deletar
exports.deleteLog = (req, res) => {
    const { id } = req.params;

    Log.delete(id, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Log removido com sucesso!" });
    });
};