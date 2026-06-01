const express = require("express");
const router = express.Router();
const {
  criarPaciente,
  listarPacientes,
  buscarPaciente,
} = require("../controllers/pacienteController");
const { autenticar } = require("../middlewares/authMiddleware");
const { autorizarPapeis } = require("../middlewares/autorizarMiddleware");

router.use(autenticar);

router.post("/", autorizarPapeis("paciente", "admin"), criarPaciente);
router.get(
  "/",
  autorizarPapeis("paciente", "dentista", "admin"),
  listarPacientes,
);
router.get(
  "/:id",
  autorizarPapeis("paciente", "dentista", "admin"),
  buscarPaciente,
);

module.exports = router;
