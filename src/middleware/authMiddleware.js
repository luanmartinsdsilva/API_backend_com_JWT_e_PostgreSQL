const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido" });
    }

    req.user = user; // 👈 aqui fica o ID do usuário
    next();
  });
}

module.exports = autenticarToken;