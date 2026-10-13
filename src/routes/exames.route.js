const express = require("express");
const router = express.Router();
const controller = require("../controllers/exames.controller"); 
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../controllers/auth.controller");

// ROTAS CORRETAS
router.use(authMiddleware);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", upload.single("imagem"), controller.create);
router.delete("/:id", controller.delete);

module.exports = router;


