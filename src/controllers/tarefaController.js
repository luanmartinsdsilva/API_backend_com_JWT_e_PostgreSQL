const pool = require("../db");

// ===============================
// 📖 LISTAR TAREFAS
// ===============================
async function listarTarefas(req, res) {
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
}

// ===============================
// ➕ CRIAR TAREFA
// ===============================
async function criarTarefa(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ erro: "Nome obrigatório" });
    }

    const result = await pool.query(
      "INSERT INTO tarefas (nome, user_id) VALUES ($1, $2) RETURNING *",
      [nome, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
}

// ===============================
// ✏️ ATUALIZAR TAREFA
// ===============================
async function atualizarTarefa(req, res) {
  try {
    const { nome } = req.body;
    const id = req.params.id;

    const result = await pool.query(
      "UPDATE tarefas SET nome = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [nome, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
}

// ===============================
// ❌ DELETAR TAREFA
// ===============================
async function deletarTarefa(req, res) {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({ mensagem: "Removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
}

module.exports = {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa,
};