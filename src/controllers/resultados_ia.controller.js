const ResultadoIA = require("../models/resultados_ia.model");

// Criar resultado manual (ou vindo da IA)
exports.createResultado = (req, res) => {
    const resultado = req.body;

    ResultadoIA.create(resultado, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({
            mensagem: "Resultado da IA salvo com sucesso!"
        });
    });
};

// Listar todos
exports.getResultados = (req, res) => {
    ResultadoIA.getAll((err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Buscar por ID
exports.getResultadoById = (req, res) => {
    const { id } = req.params;

    ResultadoIA.getById(id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Resultado não encontrado" });
        }
        res.json(results[0]);
    });
};

// Buscar resultado por exame
exports.getResultadoByExame = (req, res) => {
    const { exame_id } = req.params;

    ResultadoIA.getByExame(exame_id, (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
};

// Deletar
exports.deleteResultado = (req, res) => {
    const { id } = req.params;

    ResultadoIA.delete(id, (err, result) => {
        if (err) return res.status(500).json({ erro: err });

        res.json({ mensagem: "Resultado removido com sucesso!" });
    });
};