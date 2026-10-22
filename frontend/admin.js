const contactTable = document.getElementById("contact-table");
let contactsData = [];
const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://hypetext-api.vercel.app";

const adminToken = sessionStorage.getItem("adminToken");

if (!adminToken) {
    window.location.replace("login.html");
}

async function adminFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${adminToken}`,
        },
    });

    if (response.status === 401) {
        sessionStorage.removeItem("adminToken");
        window.location.replace("login.html");

        throw new Error("Sesi berakhir. Silakan login kembali.");
    }

    return response;
}

// GET ALL CONTACT
async function getContacts() {
  try {
    const response = await adminFetch(`${API_URL}/contact`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    contactsData = result.data;
    contactTable.replaceChildren();

    contactsData.forEach((contact) => {
      const row = document.createElement("tr");

      // Data kontak ditampilkan sebagai teks biasa
      [contact.id, contact.nama, contact.email, contact.pesan, contact.created_at]
        .forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value ?? "";
          row.appendChild(cell);
        });

      // Dropdown status
      const statusCell = document.createElement("td");
      const select = document.createElement("select");
      const status = contact.status || "Baru";

      select.className = `status-select status-${status.toLowerCase()}`;

      [
        ["Baru", "🔵 Baru"],
        ["Dibaca", "🟡 Dibaca"],
        ["Selesai", "🟢 Selesai"],
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.selected = status.toLowerCase() === value.toLowerCase();
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        updateStatus(contact.id, select);
      });

      statusCell.appendChild(select);
      row.appendChild(statusCell);

      // Tombol aksi
      const actionCell = document.createElement("td");

      const editButton = document.createElement("button");
      editButton.className = "edit-button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        editContact(contact.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Hapus";
      deleteButton.addEventListener("click", () => {
        deleteContact(contact.id);
      });

      actionCell.append(editButton, deleteButton);
      row.appendChild(actionCell);

      contactTable.appendChild(row);
    });
  } catch (error) {
    console.error("Gagal mengambil data contact:", error);

    contactTable.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 7;
    cell.textContent = "Gagal mengambil data contact.";

    row.appendChild(cell);
    contactTable.appendChild(row);
  }
}


// DELETE CONTACT
async function deleteContact(id) {
  const yakin = confirm("Yakin ingin menghapus pesan ini?");

  if (!yakin) {
    return;
  }

  try {
    const response = await adminFetch(`${API_URL}/contact/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert(result.message);

    getContacts();
  } catch (error) {
    console.error(error);

    alert("Gagal menghapus contact");
  }
}

//Update Status
async function updateStatus(id, selectElement) {
  const status = selectElement.value;

  try {
    const response = await adminFetch(`${API_URL}/contact/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }
    console.log(result.message);

    // Hapus class status sebelumnya
    selectElement.classList.remove(
      "status-baru",
      "status-dibaca",
      "status-selesai",
    );

    // Tambahkan class sesuai status baru
    selectElement.classList.add(`status-${status.toLowerCase()}`);
  } catch (error) {
    console.error("Gagal mengubah status:", error);

    alert("Gagal mengubah status");

    // Kalau gagal, ambil ulang data dari database
    getContacts();
  }
}

// EDIT CONTACT
function editContact(id) {
  const contact = contactsData.find((contact) => contact.id === id);

  if (!contact) {
    alert("Data contact tidak ditemukan");

    return;
  }

  document.getElementById("edit-id").value = contact.id;

  document.getElementById("edit-nama").value = contact.nama;

  document.getElementById("edit-email").value = contact.email;

  document.getElementById("edit-pesan").value = contact.pesan;

  document.getElementById("edit-modal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
}

//UPDATE CONTACT
const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("edit-id").value;

  const nama = document.getElementById("edit-nama").value;

  const email = document.getElementById("edit-email").value;

  const pesan = document.getElementById("edit-pesan").value;

  try {
    const response = await adminFetch(`${API_URL}/contact/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: nama,
        email: email,
        pesan: pesan,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert(result.message);

    closeModal();

    getContacts();
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    alert("Gagal mengupdate contact");
  }
});

if (adminToken){
  getContacts();
}

const logoutButton = document.getElementById("logout-button");

logoutButton?.addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.removeItem("adminToken");
    window.location.replace("login.html");
});