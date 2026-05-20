const express = require("express");
const router = express.Router();
const {
  criarAgendamento,
  listarAgendamentos,
  buscarAgendamento,
  cancelarAgendamento,
} = require("../controllers/agendamentoController");

router.post("/", criarAgendamento);
router.get("/", listarAgendamentos);
router.get("/:id", buscarAgendamento);
router.patch("/:id/cancelar", cancelarAgendamento);

module.exports = router;
