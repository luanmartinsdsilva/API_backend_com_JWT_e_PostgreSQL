require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/authRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");

const app = express();

// ===============================
// 🔧 MIDDLEWARE GLOBAL
// ===============================
app.use(express.json());

// ===============================
// 📌 ROTAS
// ===============================
app.use(authRoutes); // /register e /login
app.use("/tarefas", tarefaRoutes); // /tarefas/*

// ===============================
// 📦 EXPORTA APP
// ===============================
module.exports = app;