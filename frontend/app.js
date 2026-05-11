const API = "https://api-backend-com-jwt-e-postgresql.onrender.com";

let token = localStorage.getItem("token");

// =====================
// LOGIN
// =====================
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    showDashboard();
    loadTasks();
  } else {
    document.getElementById("msg").innerText = data.erro;
  }
}

// =====================
// REGISTER
// =====================
async function register() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  document.getElementById("msg").innerText =
    data.mensagem || data.erro;
}

// =====================
// TAREFAS
// =====================
async function loadTasks() {
  const res = await fetch(`${API}/tarefas`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(t => {
    list.innerHTML += `
      <div class="task">
        ${t.nome}
      </div>
    `;
  });
}

async function addTask() {
  const nome = document.getElementById("taskName").value;

  await fetch(`${API}/tarefas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nome })
  });

  document.getElementById("taskName").value = "";
  loadTasks();
}

// =====================
// UI CONTROL
// =====================
function showDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

// auto login
if (token) {
  showDashboard();
  loadTasks();
}