const Log = require("../models/logs.model");

// Middleware para registar logs automaticamente
const logMiddleware = async (req, res, next) => {
    // Só registar POST, PUT, DELETE (não GET)
    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return next();
    }

    // Capturar a resposta original
    const originalJson = res.json;

    res.json = function(data) {
        // Só registar se foi sucesso (status 2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const acao = `${req.method} ${req.originalUrl}`;
            const usuario_id = req.body?.usuario_id || 1; // Default: 1

            Log.create({ usuario_id, acao }).catch(err => {
                console.error("Erro ao registar log:", err);
            });
        }

        // Chamar o json original
        return originalJson.call(this, data);
    };

    next();
};

module.exports = logMiddleware;