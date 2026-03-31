const express = require("express");
const router = express.Router();
const logController = require("../controllers/logs.controller");

// Rotas
router.post("/logs", logController.createLog);
router.get("/logs", logController.getLogs);
router.get("/logs/:id", logController.getLogById);
router.get("/logs/user/:usuario_id", logController.getLogsByUser);
router.delete("/logs/:id", logController.deleteLog);

module.exports = router;