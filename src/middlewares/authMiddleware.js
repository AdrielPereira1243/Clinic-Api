const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const autenticar = async (req, res, next) => {
  try {
    // pega o cabecalho authorization enviado na requisicao
    const authHeader = req.headers.authorization;

    // bloqueia requisicoes sem token
    if (!authHeader) {
      return res.status(401).json({ error: "Token nao informado" });
    }

    // separa o tipo bearer do valor do token
    const [tipo, token] = authHeader.split(" ");

    // valida o formato esperado: bearer token
    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token invalido" });
    }

    // garante que a chave jwt existe no ambiente
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }

    // valida e decodifica o token jwt
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = Number(payload.sub || payload.id);

    // bloqueia tokens sem id de usuario valido
    if (!usuarioId) {
      return res.status(401).json({ error: "Token invalido" });
    }

    // busca  usuario atual e seus vinculos de perfil
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        paciente: { select: { id: true } },
        dentista: { select: { id: true } },
      },
    });

    // bloqueia token de usuario que nao existe mais
    if (!usuario) {
      return res.status(401).json({ error: "Usuario nao encontrado" });
    }

    // mostra os dados do usuario para as proximas camadas
    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
      pacienteId: usuario.paciente ? usuario.paciente.id : null,
      dentistaId: usuario.dentista ? usuario.dentista.id : null,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido ou expirado" });
  }
};

module.exports = { autenticar };
