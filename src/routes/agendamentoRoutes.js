const express = require("express");
const router = express.Router();
const {
  criarAgendamento,
  listarAgendamentos,
  buscarAgendamento,
  cancelarAgendamento,
} = require("../controllers/agendamentoController");
const { autenticar } = require("../middlewares/authMiddleware");
const { autorizarPapeis } = require("../middlewares/autorizarMiddleware");

router.use(autenticar);

router.post(
  "/",
  autorizarPapeis("paciente", "dentista", "admin"),
  criarAgendamento,
);
router.get(
  "/",
  autorizarPapeis("paciente", "dentista", "admin"),
  listarAgendamentos,
);
router.get(
  "/:id",
  autorizarPapeis("paciente", "dentista", "admin"),
  buscarAgendamento,
);
router.patch(
  "/:id/cancelar",
  autorizarPapeis("paciente", "dentista", "admin"),
  cancelarAgendamento,
);

module.exports = router;
