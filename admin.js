const contactTable = document.getElementById("contact-table");

async function getContacts() {

    try {

        const response = await fetch("http://localhost:3000/contact");

        const result = await response.json();

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
            `;

            contactTable.appendChild(row);
        });

    } catch (error) {

        console.log(error);

        contactTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Gagal mengambil data contact.
                </td>
            </tr>
        `;
    }
}

getContacts();