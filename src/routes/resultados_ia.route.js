const express = require("express");
const router = express.Router();
const resultadoController = require("../controllers/resultados_ia.controller");

// Rotas
router.post("/resultados", resultadoController.createResultado);
router.get("/resultados", resultadoController.getResultados);
router.get("/resultados/:id", resultadoController.getResultadoById);
router.get("/resultados/exame/:exame_id", resultadoController.getResultadoByExame);
router.delete("/resultados/:id", resultadoController.deleteResultado);

module.exports = router;