# 📋 API de Tarefas com Autenticação JWT

API REST desenvolvida em Node.js com Express e PostgreSQL, permitindo cadastro de usuários, autenticação com JWT e gerenciamento de tarefas por usuário.

---

## 🚀 Funcionalidades

- Cadastro de usuários (register)
- Login com autenticação JWT
- Senhas criptografadas com bcrypt
- Proteção de rotas com middleware JWT
- CRUD completo de tarefas
- Cada usuário acessa apenas suas próprias tarefas

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt
- dotenv

---

## 📁 Estrutura do projeto
    src/
├── controllers/
│ ├── authController.js
│ └── tarefaController.js
│
├── routes/
│ ├── authRoutes.js
│ └── tarefaRoutes.js
│
├── middleware/
│ └── authMiddleware.js
│
├── db.js
├── app.js
server.js