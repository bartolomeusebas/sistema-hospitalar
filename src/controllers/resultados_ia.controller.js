const ResultadoIA = require("../models/resultados_ia.model");
const iaService = require("../../service/iaService");
const Exame = require("../models/exames.model");
const path = require("path");

// Analisar exame com IA
exports.analisarExameComIA = async (req, res) => {
    try {
        const { exame_id, tipoExame, descricao } = req.body;

        // Buscar exame
        const exame = await Exame.getById(exame_id);
        if (!exame) {
            return res.status(404).json({ erro: "Exame não encontrado" });
        }

        let resultado;

        // Se tem imagem, analisar com imagem
        if (exame.imagem) {
            const caminhoImagem = path.join(__dirname, "../../public/uploads", exame.imagem);
            resultado = await iaService.analisarExame(caminhoImagem, tipoExame, descricao);
        } else {
            // Senão, analisar apenas descrição
            resultado = await iaService.analisarDescricao(tipoExame, descricao);
        }

        if (!resultado.sucesso) {
            return res.status(500).json({ erro: resultado.erro });
        }

        // Salvar resultado na BD
        await ResultadoIA.create({
            exame_id,
            diagnostico: resultado.diagnostico,
            probabilidade: 0, // Pode extrair do texto se quiser
            observacao: resultado.demonstracao
                ? `DEMONSTRAÇÃO LOCAL: ${resultado.motivo}`
                : `Analisado com ${resultado.modelo}`
        });

        res.status(201).json({
            mensagem: "Exame analisado com sucesso!",
            exame_id,
            diagnostico: resultado.diagnostico,
            modelo: resultado.modelo,
            demonstracao: Boolean(resultado.demonstracao),
            aviso: resultado.demonstracao
                ? "Resultado demonstrativo, não representa diagnóstico médico real."
                : undefined
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
};

// Criar resultado manual
exports.createResultado = async (req, res) => {
    try {
        await ResultadoIA.create(req.body);
        res.json({ mensagem: "Resultado da IA salvo com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar todos
exports.getResultados = async (req, res) => {
    try {
        const results = await ResultadoIA.getAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Buscar por ID
exports.getResultadoById = async (req, res) => {
    try {
        const result = await ResultadoIA.getById(req.params.id);
        if (!result) return res.status(404).json({ mensagem: "Resultado não encontrado" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Buscar por exame
exports.getResultadoByExame = async (req, res) => {
    try {
        const results = await ResultadoIA.getByExame(req.params.exame_id);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Deletar
exports.deleteResultado = async (req, res) => {
    try {
        await ResultadoIA.delete(req.params.id);
        res.json({ mensagem: "Resultado removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};