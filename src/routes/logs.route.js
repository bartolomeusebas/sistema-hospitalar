const express = require("express");
const router = express.Router();
const logController = require("../controllers/logs.controller");

// IMPORTANTE: rotas específicas ANTES das genéricas
router.get("/user/:usuario_id", logController.getLogsByUser);
router.post("/", logController.createLog);
router.get("/", logController.getLogs);
router.get("/:id", logController.getLogById);
router.delete("/:id", logController.deleteLog);

module.exports = router;