const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const gerarToken = (usuario) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET nao configurado");
  }

  return jwt.sign(
    { id: usuario.id, email: usuario.email, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );
};

const registrar = async (req, res) => {
  try {
    const { email, senha, nome, cpf, telefone } = req.body;

    if (!email || !senha || !nome || !cpf || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos sao obrigatorios" });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Email ja cadastrado" });
    }

    const pacienteExistente = await prisma.paciente.findUnique({
      where: { cpf },
    });

    if (pacienteExistente) {
      return res.status(400).json({ error: "CPF ja cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        email,
        senha: senhaHash,
        papel: "paciente",
        paciente: {
          create: {
            nome,
            email,
            cpf,
            telefone,
          },
        },
      },
      include: {
        paciente: true,
      },
    });

    const token = gerarToken(usuario);

    return res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        papel: usuario.papel,
        paciente: usuario.paciente,
      },
    });
  } catch (error) {
    console.log(error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email ou CPF ja cadastrado" });
    }

    if (error.message === "JWT_SECRET nao configurado") {
      return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }

    return res.status(500).json({ error: "Erro ao registrar paciente" });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha sao obrigatorios" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        paciente: true,
        dentista: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = gerarToken(usuario);

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        papel: usuario.papel,
        paciente: usuario.paciente,
        dentista: usuario.dentista,
      },
    });
  } catch (error) {
    console.log(error);

    if (error.message === "JWT_SECRET nao configurado") {
      return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }

    return res.status(500).json({ error: "Erro ao fazer login" });
  }
};

module.exports = { registrar, login };
