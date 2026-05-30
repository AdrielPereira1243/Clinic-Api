const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "sua_chave_secreta_super_segura_aqui";

// Registro de novo paciente
const registrar = async (req, res) => {
  try {
    const { email, senha, nome, cpf, telefone } = req.body;

    // Validações básicas
    if (!email || !senha || !nome || !cpf || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário e paciente
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

    // Gerar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
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
    res.status(500).json({ error: "Erro ao registrar paciente" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
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

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
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
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

module.exports = { registrar, login };
