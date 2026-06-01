const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const pacienteRoutes = require("./src/routes/pacienteRoutes");
const dentistaRoutes = require("./src/routes/dentistaRoutes");
const agendamentoRoutes = require("./src/routes/agendamentoRoutes");

app.use("/auth", authRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/dentistas", dentistaRoutes);
app.use("/agendamentos", agendamentoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Clinica funcionando!" });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
