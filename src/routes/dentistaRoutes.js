const express = require("express");
const router = express.Router();
const {
  criarDentista,
  listarDentistas,
  buscarDentista,
} = require("../controllers/dentistaController");
const { autenticar } = require("../middlewares/authMiddleware");
const { autorizarPapeis } = require("../middlewares/autorizarMiddleware");

router.use(autenticar);

router.post("/", autorizarPapeis("dentista", "admin"), criarDentista);
router.get("/", autorizarPapeis("dentista", "admin"), listarDentistas);
router.get("/:id", autorizarPapeis("dentista", "admin"), buscarDentista);

module.exports = router;
