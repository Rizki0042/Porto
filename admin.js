const contactTable = document.getElementById("contact-table");

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
                <button class= "edit-button"
                onclick="editContact(${contact.id},
                '${contact.nama}',
                '${contact.email}',
                '${contact.pesan}')">Edit</button>

                    <button 
                        class="delete-button"
                        onclick="deleteContact(${contact.id})">
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
                <td colspan="6">
                    Gagal mengambil data contact.
                </td>
            </tr>
        `;
    }
}


async function deleteContact(id) {

    const yakin = confirm("Yakin ingin menghapus pesan ini?");

    if (!yakin) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/contact/${id}`,
            {
                method: "DELETE"
            }
        );

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

async function editContact(id, namaLama, emailLama, pesanLama) {

    const nama = prompt("Nama:", namaLama);

    if (nama === null) {
        return;
    }

    const email = prompt("Email:", emailLama);

    if (email === null) {
        return;
    }

    const pesan = prompt("Pesan:", pesanLama);

    if (pesan === null) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/contact/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nama: nama,
                    email: email,
                    pesan: pesan
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);

        getContacts();

    } catch (error) {

        console.error(error);

        alert("Gagal mengupdate contact");
    }
}


getContacts();