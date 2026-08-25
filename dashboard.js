const totalContact =
    document.getElementById("total-contact");

const latestContact =
    document.getElementById("latest-contact");


async function getTotalContact() {

    try {

        const response = await fetch(
            "http://localhost:3000/contact/count"
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.message);

        }

        totalContact.textContent = result.total;

    } catch (error) {

        console.error(
            "Gagal mengambil jumlah contact:",
            error
        );

        totalContact.textContent = "Error";

    }

}

async function getLatestContact() {

    try {

        const response = await fetch(
            "http://localhost:3000/contact/latest"
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        latestContact.innerHTML = "";

        if (result.data.length === 0) {

            latestContact.innerHTML = `
                <p class="loading">
                    Belum ada pesan.
                </p>
            `;

            return;
        }

        result.data.forEach((contact) => {

            const item =
                document.createElement("div");

            item.className = "contact-item";

            item.innerHTML = `
                <div class="contact-header">

                    <div class="contact-name">
                        ${contact.nama}
                    </div>

                    <div class="contact-email">
                        ${contact.email}
                    </div>

                </div>

                <div class="contact-message">
                    ${contact.pesan}
                </div>

                <div class="contact-date">
                    ${contact.created_at}
                </div>
            `;

            latestContact.appendChild(item);

        });

    } catch (error) {

        console.error(
            "Gagal mengambil contact terbaru:",
            error
        );

        latestContact.innerHTML = `
            <p class="loading">
                Gagal mengambil pesan terbaru.
            </p>
        `;

    }

}


getTotalContact();
getLatestContact();