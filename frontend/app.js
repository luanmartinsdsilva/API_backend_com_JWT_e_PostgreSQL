const API = "https://api-backend-com-jwt-e-postgresql.onrender.com";

let token = localStorage.getItem("token");

// ENTER ADD TASK
document.getElementById("taskName")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// LOGIN
async function login() {

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.erro;
    return;
  }

  token = data.token;
  localStorage.setItem("token", token);

  showDashboard();
  loadTasks();

  toast("Login realizado!");
}

// REGISTER
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

// LOAD TASKS + STATS
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

        <label>
          <input type="checkbox"
            ${t.concluida ? "checked" : ""}
            onchange="toggleTask(${t.id}, ${t.concluida})"
          >
          ${t.nome}
        </label>

        <div class="actions">
          <button onclick="editTask(${t.id}, '${t.nome}')">✏️</button>
          <button onclick="deleteTask(${t.id})">🗑</button>
        </div>

      </div>
    `;
  });

  // STATS
  const total = tasks.length;
  const done = tasks.filter(t => t.concluida).length;
  const pending = total - done;

  document.getElementById("total").innerText = total;
  document.getElementById("done").innerText = done;
  document.getElementById("pending").innerText = pending;
}

// ADD TASK
async function addTask() {

  const input = document.getElementById("taskName");
  const nome = input.value.trim();

  if (!nome) return;

  await fetch(`${API}/tarefas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nome })
  });

  input.value = "";

  loadTasks();
  toast("Tarefa criada!");
}

// EDIT
async function editTask(id, nomeAtual) {

  const novoNome = prompt("Editar:", nomeAtual);
  if (!novoNome) return;

  await fetch(`${API}/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nome: novoNome })
  });

  loadTasks();
}

// TOGGLE
async function toggleTask(id, atual) {

  await fetch(`${API}/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ concluida: !atual })
  });

  loadTasks();
}

// DELETE
async function deleteTask(id) {

  await fetch(`${API}/tarefas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadTasks();
}

// UI
function showDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

// TOAST
function toast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.opacity = 1;

  setTimeout(() => {
    t.style.opacity = 0;
  }, 1500);
}

// AUTO LOGIN
if (token) {
  showDashboard();
  loadTasks();
}