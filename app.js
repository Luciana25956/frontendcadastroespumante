const API_URL = "http://localhost:3000/cadastroEspumante";

const form = document.getElementById("entry-form");
const entriesList = document.getElementById("entries-list");
const message = document.getElementById("message");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const happenedAtInput = document.getElementById("happenedAt");
const entryIdInput = document.getElementById("entry-id");

const cancelBtn = document.getElementById("cancel-edit");
const reloadBtn = document.getElementById("reload-btn");

// 🔄 LISTAR REGISTROS
async function fetchEntries() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    renderEntries(data);
  } catch (err) {
    showMessage("Erro ao carregar registros", true);
  }
}

// 🧾 RENDERIZAR LISTA
function renderEntries(entries) {
  entriesList.innerHTML = "";

  if (!entries.length) {
    entriesList.innerHTML = "<p class='text-muted'>Nenhum registro encontrado</p>";
    return;
  }

  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "border rounded p-3 mb-2";

    div.innerHTML = `
      <h5>${entry.title || entry.cadastroEspumante}</h5>
      <p>${entry.description}</p>
      <small class="text-muted">
        ${new Date(entry.happenedAt).toLocaleString()}
      </small>

      <div class="mt-2 d-flex gap-2">
        <button class="btn btn-sm btn-warning" onclick="editEntry('${entry._id}')">
          Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteEntry('${entry._id}')">
          Deletar
        </button>
      </div>
    `;

    entriesList.appendChild(div);
  });
}

// 💾 SALVAR (CREATE / UPDATE)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = entryIdInput.value;

  const payload = {
    title: titleInput.value,
    description: descriptionInput.value,
    happenedAt: happenedAtInput.value
  };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      showMessage("Atualizado com sucesso!");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      showMessage("Criado com sucesso!");
    }

    form.reset();
    entryIdInput.value = "";
    cancelBtn.classList.add("hidden");

    fetchEntries();
  } catch (err) {
    showMessage("Erro ao salvar registro", true);
  }
});

// ✏️ EDITAR
window.editEntry = async function (id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();

  entryIdInput.value = data._id;
  titleInput.value = data.title || data.cadastroEspumante;
  descriptionInput.value = data.description;
  happenedAtInput.value = data.happenedAt?.slice(0, 16);

  cancelBtn.classList.remove("hidden");
};

// ❌ CANCELAR EDIÇÃO
cancelBtn.addEventListener("click", () => {
  form.reset();
  entryIdInput.value = "";
  cancelBtn.classList.add("hidden");
});

// 🗑 DELETE
window.deleteEntry = async function (id) {
  if (!confirm("Tem certeza que deseja deletar?")) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  showMessage("Removido com sucesso!");
  fetchEntries();
};

// 🔁 RELOAD
reloadBtn.addEventListener("click", fetchEntries);

// 📢 MENSAGEM
function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "text-danger mt-3" : "text-success mt-3";

  setTimeout(() => {
    message.textContent = "";
  }, 3000);
}

// 🚀 INIT
fetchEntries();