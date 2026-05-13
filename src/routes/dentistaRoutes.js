const express = require("express");
const router = express.Router();
const {
  criarDentista,
  listarDentistas,
  buscarDentista,
} = require("../controllers/dentistaController");

router.post("/", criarDentista);
router.get("/", listarDentistas);
router.get("/:id", buscarDentista);

module.exports = router;
