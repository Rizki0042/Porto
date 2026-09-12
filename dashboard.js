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

async function loadDashboard() {

  try {

    console.log("Mengambil data contact untuk dashboard...");

    const response = await fetch("http://localhost:3000/contact");

    const result = await response.json();

    console.log("Data dashboard:", result);

    if (!response.ok) {
      throw new Error(result.message);
    }

    const contacts = result.data;

    // =========================
    // HITUNG TOTAL
    // =========================

    const total = contacts.length;


    // =========================
    // HITUNG STATUS
    // =========================

    const totalBaru = contacts.filter(
      (contact) => contact.STATUS === "Baru"
    ).length;

    const totalDibaca = contacts.filter(
      (contact) => contact.STATUS === "Dibaca"
    ).length;

    const totalSelesai = contacts.filter(
      (contact) => contact.STATUS === "Selesai"
    ).length;


    // =========================
    // TAMPILKAN KE DASHBOARD
    // =========================

    document.getElementById("total-contact").textContent = total;

    document.getElementById("total-baru").textContent = totalBaru;

    document.getElementById("total-dibaca").textContent = totalDibaca;

    document.getElementById("total-selesai").textContent = totalSelesai;


    // =========================
    // PESAN TERBARU
    // =========================

    const latestContact = document.getElementById("latest-contact");

    if (contacts.length === 0) {

      latestContact.innerHTML = `
        <p>Tidak ada pesan.</p>
      `;

      return;
    }


    // Ambil 3 pesan terakhir
    const latest = contacts.slice(-3).reverse();


    latestContact.innerHTML = latest.map((contact) => {

      return `
        <div class="contact-item">

          <div class="contact-header">

            <span class="contact-name">
              ${contact.nama}
            </span>

            <span class="contact-email">
              ${contact.email}
            </span>

          </div>

          <div class="contact-message">
            ${contact.pesan}
          </div>

          <div class="contact-date">
            ${contact.created_at}
          </div>

        </div>
      `;

    }).join("");


  } catch (error) {

    console.error("Dashboard ERROR:", error);

  }

}


// Jalankan ketika halaman dibuka
loadDashboard();


getTotalContact();
getLatestContact();