const express = require("express");
const router = express.Router();
const historicoController = require("../controllers/historico_clinico.controller");

// Rotas
router.post("/historico", historicoController.createHistorico);
router.get("/historico", historicoController.getHistoricos);
router.get("/historico/:id", historicoController.getHistoricoById);
router.get("/historico/paciente/:paciente_id", historicoController.getHistoricoByPaciente);
router.put("/historico/:id", historicoController.updateHistorico);
router.delete("/historico/:id", historicoController.deleteHistorico);

module.exports = router;