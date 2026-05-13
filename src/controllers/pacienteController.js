const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const criarPaciente = async (req, res) => {
  try {
    const { nome, email, telefone, cpf } = req.body;

    const paciente = await prisma.paciente.create({
      data: { nome, email, telefone, cpf },
    });

    res.status(201).json(paciente);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar pacientes" });
  }
};

const buscarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(id) },
    });

    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar paciente" });
  }
};

module.exports = { criarPaciente, listarPacientes, buscarPaciente };
