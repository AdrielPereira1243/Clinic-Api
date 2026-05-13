const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarAgendamento = async (req, res) => {
  try {
    const { data, procedimento, pacienteId, dentistaId } = req.body;

    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        procedimento,
        pacienteId: Number(pacienteId),
        dentistaId: Number(dentistaId),
      },
      include: {
        paciente: true,
        dentista: true,
      },
    });

    res.status(201).json(agendamento);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        paciente: true,
        dentista: true,
      },
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar agendamentos" });
  }
};

const buscarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: {
        paciente: true,
        dentista: true,
      },
    });

    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamento" });
  }

const cancelarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: { status: "cancelado" },
    });

    res.json(agendamento);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cancelar agendamento" });
  }
  };
}
module.exports = { criarAgendamento, listarAgendamentos, buscarAgendamento, cancelarAgendamento };
