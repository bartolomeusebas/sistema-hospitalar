const express = require("express");
const router = express.Router();
const logController = require("../controllers/logs.controller");
const { authMiddleware } = require("../controllers/auth.controller");

router.use(authMiddleware);

// IMPORTANTE: rotas específicas ANTES das genéricas
router.get("/user/:usuario_id", logController.getLogsByUser);
router.post("/", logController.createLog);
router.get("/", logController.getLogs);
router.get("/:id", logController.getLogById);
router.delete("/:id", logController.deleteLog);

module.exports = router;