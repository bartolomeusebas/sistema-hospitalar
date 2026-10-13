const express = require("express");
const router = express.Router();
const resultadoController = require("../controllers/resultados_ia.controller");
const { authMiddleware } = require("../controllers/auth.controller");

router.use(authMiddleware);

// IMPORTANTE: rotas específicas ANTES das genéricas
router.post("/analisar", resultadoController.analisarExameComIA);
router.get("/exame/:exame_id", resultadoController.getResultadoByExame);
router.post("/", resultadoController.createResultado);
router.get("/", resultadoController.getResultados);
router.get("/:id", resultadoController.getResultadoById);
router.delete("/:id", resultadoController.deleteResultado);

module.exports = router;