const autorizarPapeis = (...papeisPermitidos) => {
  return (req, res, next) => {
    // garante que a autenticacao rodou antes da autorizacao
    if (!req.usuario) {
      return res.status(401).json({ error: "Usuario nao autenticado" });
    }

    // bloqueia usuarios com papel fora da lista permitida
    if (!papeisPermitidos.includes(req.usuario.papel)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
};

module.exports = { autorizarPapeis };
