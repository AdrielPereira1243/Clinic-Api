const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarDentista = async (req, res) => {
  try {
    const { nome, email, telefone, cro } = req.body;

    const dentista = await prisma.dentista.create({
      data: { nome, email, telefone, cro },
    });

    res.status(201).json(dentista);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const listarDentistas = async (req, res) => {
  try {
    const dentistas = await prisma.dentista.findMany();
    res.json(dentistas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar dentistas" });
  }
};

const buscarDentista = async (req, res) => {
  try {
    const { id } = req.params;
    const dentista = await prisma.dentista.findUnique({
      where: { id: Number(id) },
    });

    if (!dentista) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    res.json(dentista);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dentista" });
  }
};

module.exports = { criarDentista, listarDentistas, buscarDentista };
