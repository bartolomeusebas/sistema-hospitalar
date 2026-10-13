const express = require("express");
const router = express.Router();
const controller = require("../controllers/historico_clinico.controller");
const { authMiddleware } = require("../controllers/auth.controller");

router.use(authMiddleware);

// IMPORTANTE: rota específica vem antes da genérica

router.get("/paciente/:paciente_id", controller.getHistoricoByPaciente);

router.get("/", controller.getHistoricos);

router.get("/:id", controller.getHistoricoById);

router.post("/", controller.createHistorico);

router.put("/:id", controller.updateHistorico);

router.delete("/:id", controller.deleteHistorico);

module.exports = router;