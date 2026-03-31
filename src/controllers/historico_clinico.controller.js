const Historico = require("../models/historico_clinico.model");

// Criar histórico
exports.createHistorico = (req, res) => {
    const dados = req.body;

    Historico.create(dados, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Histórico clínico registrado com sucesso!" });
    });
};

// Listar todos
exports.getHistoricos = (req, res) => {
    Historico.getAll((err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Buscar por ID
exports.getHistoricoById = (req, res) => {
    const { id } = req.params;

    Historico.getById(id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Histórico não encontrado" });
        }
        res.json(results[0]);
    });
};

// Buscar por paciente
exports.getHistoricoByPaciente = (req, res) => {
    const { paciente_id } = req.params;

    Historico.getByPaciente(paciente_id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Atualizar
exports.updateHistorico = (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    Historico.update(id, dados, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Histórico atualizado com sucesso!" });
    });
};

// Deletar
exports.deleteHistorico = (req, res) => {
    const { id } = req.params;

    Historico.delete(id, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Histórico removido com sucesso!" });
    });
};