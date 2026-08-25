const contactTable = document.getElementById("contact-table");

let contactsData = [];

// ===============================
// GET ALL CONTACT
// ===============================

async function getContacts() {
  try {
    console.log("Mengambil data contact...");

    const response = await fetch("http://localhost:3000/contact");

    console.log("Response:", response);

    const result = await response.json();

    console.log("Data:", result);

    if (!response.ok) {
      throw new Error(result.message);
    }

    contactsData = result.data;

    contactTable.innerHTML = "";

    result.data.forEach((contact) => {
      const row = document.createElement("tr");

      row.innerHTML = `

                <td>${contact.id}</td>

                <td>${contact.nama}</td>

                <td>${contact.email}</td>

                <td>${contact.pesan}</td>

                <td>${contact.created_at}</td>

                <td>

                    <select
                        onchange="updateStatus(${contact.id}, this.value)"
                    >

                        <option value="Baru"
                            ${contact.status === "Baru" ? "selected" : ""}>
                            🔵 Baru
                        </option>

                        <option value="Dibaca"
                            ${contact.status === "Dibaca" ? "selected" : ""}>
                            🟡 Dibaca
                        </option>

                        <option value="Selesai"
                            ${contact.status === "Selesai" ? "selected" : ""}>
                            🟢 Selesai
                        </option>

                    </select>

                </td>

                <td>

                    <button
                        class="edit-button"
                        onclick="editContact(${contact.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteContact(${contact.id})"
                    >
                        Hapus
                    </button>

                </td>

            `;

      contactTable.appendChild(row);
    });
  } catch (error) {
    console.error("ERROR:", error);

    contactTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Gagal mengambil data contact.
                </td>
            </tr>
        `;
  }
}

// ===============================
// DELETE CONTACT
// ===============================

async function deleteContact(id) {
  const yakin = confirm("Yakin ingin menghapus pesan ini?");

  if (!yakin) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/contact/${id}`, {
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

// ===============================
// UPDATE STATUS
// ===============================

async function updateStatus(id, status) {
  try {
    console.log("Mengubah status ID:", id, "menjadi:", status);

    const response = await fetch(`http://localhost:3000/contact/${id}/status`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: status,
      }),
    });

    const result = await response.json();

    console.log("Response update status:", result);

    if (!response.ok) {
      throw new Error(result.message);
    }

    console.log(result.message);

    getContacts();
  } catch (error) {
    console.error("Gagal mengubah status:", error);

    alert("Gagal mengubah status");
  }
}

// ===============================
// EDIT CONTACT
// ===============================

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

// ===============================
// CLOSE MODAL
// ===============================

function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
}

// ===============================
// UPDATE CONTACT
// ===============================

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("edit-id").value;

  const nama = document.getElementById("edit-nama").value;

  const email = document.getElementById("edit-email").value;

  const pesan = document.getElementById("edit-pesan").value;

  console.log("Data yang akan diupdate:", {
    id,
    nama,
    email,
    pesan,
  });

  try {
    const response = await fetch(`http://localhost:3000/contact/${id}`, {
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

    console.log("Response dari server:", result);

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

// ===============================
// JALANKAN SAAT HALAMAN DIBUKA
// ===============================

getContacts();
