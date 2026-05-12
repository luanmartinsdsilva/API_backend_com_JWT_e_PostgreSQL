
// =====================
// NAVEGAÇÃO DE TELAS
// =====================
function showLogin() {
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
}

function showDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

// =====================
// LOADING VISUAL
// =====================
function setLoading(state) {
  document.body.style.opacity = state ? "0.6" : "1";
}

// =====================
// TOAST (FEEDBACK GLOBAL)
// =====================
function showToast(msg) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.innerText = msg;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 1500);
}

// =====================
// RENDER HELPERS (OPCIONAL)
// =====================
function clearTasks() {
  const list = document.getElementById("taskList");
  if (list) list.innerHTML = "";
}