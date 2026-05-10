const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

// ===============================
// CONFIGURAÇÕES GLOBAIS
// ===============================
const SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

// ===============================
// CORS (CORRIGIDO PARA RENDER + FRONTEND)
// ===============================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// resolve preflight (OPTIONS)
app.options("*", cors());

app.use(express.json());

console.log("API rodando com JWT + PostgreSQL");

// ===============================
// MIDDLEWARE DE AUTENTICAÇÃO
// ===============================
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

    req.user = user;
    next();
  });
}

// ===============================
// REGISTER
// ===============================
app.post("/register", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha obrigatórios" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id, email",
      [email, senhaCriptografada]
    );

    res.json({
      mensagem: "Usuário criado",
      usuario: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    res.status(500).json({ erro: "Erro ao registrar" });
  }
});

// ===============================
// LOGIN
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro no login" });
  }
});

// ===============================
// LISTAR TAREFAS
// ===============================
app.get("/tarefas", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
});

// ===============================
// CRIAR TAREFA
// ===============================
app.post("/tarefas", autenticarToken, async (req, res) => {
  try {
    const { nome } = req.body;

    const result = await pool.query(
      "INSERT INTO tarefas (nome, user_id) VALUES ($1, $2) RETURNING *",
      [nome, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
});

// ===============================
// ATUALIZAR TAREFA
// ===============================
app.put("/tarefas/:id", autenticarToken, async (req, res) => {
  try {
    const { nome } = req.body;

    const result = await pool.query(
      "UPDATE tarefas SET nome = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [nome, req.params.id, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
});

// ===============================
// DELETAR TAREFA
// ===============================
app.delete("/tarefas/:id", autenticarToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tarefas WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    res.json({ mensagem: "Tarefa removida" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});