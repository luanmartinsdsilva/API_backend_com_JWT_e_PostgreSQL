const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = process.env.JWT_SECRET;

// ===============================
// 👤 REGISTER
// ===============================
async function register(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Email e senha obrigatórios",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id, email",
      [email, senhaCriptografada]
    );

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      usuario: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    // email duplicado (erro comum)
    if (error.code === "23505") {
      return res.status(400).json({
        erro: "Email já cadastrado",
      });
    }

    return res.status(500).json({
      erro: "Erro ao registrar usuário",
    });
  }
}

// ===============================
// 🔐 LOGIN
// ===============================
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Email e senha obrigatórios",
      });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        erro: "Usuário não encontrado",
      });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({
        erro: "Senha incorreta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro no login",
    });
  }
}

module.exports = {
  register,
  login,
};