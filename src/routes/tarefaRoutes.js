const express = require("express");
const router = express.Router();

const {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa,
} = require("../controllers/tarefaController");

const autenticarToken = require("../middleware/authMiddleware");

// 🔐 TODAS AS ROTAS PROTEGIDAS
router.get("/", autenticarToken, listarTarefas);
router.post("/", autenticarToken, criarTarefa);
router.put("/:id", autenticarToken, atualizarTarefa);
router.delete("/:id", autenticarToken, deletarTarefa);

module.exports = router;