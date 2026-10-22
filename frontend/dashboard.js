const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://hypetext-api.vercel.app";

const adminToken = sessionStorage.getItem("adminToken");

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

async function loadDashboard() {
    if (!adminToken) {
        window.location.replace("login.html");
        return;
    }

    try {
        const response = await adminFetch(`${API_URL}/contact`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal mengambil data.");
        }

        const contacts = result.data;

        // Hitung total kontak berdasarkan status
        const totalBaru = contacts.filter(
            (contact) => contact.status?.toLowerCase() === "baru"
        ).length;

        const totalDibaca = contacts.filter(
            (contact) => contact.status?.toLowerCase() === "dibaca"
        ).length;

        const totalSelesai = contacts.filter(
            (contact) => contact.status?.toLowerCase() === "selesai"
        ).length;

        // Tampilkan statistik
        document.getElementById("total-contact").textContent =
            contacts.length;

        document.getElementById("total-baru").textContent = totalBaru;
        document.getElementById("total-dibaca").textContent = totalDibaca;
        document.getElementById("total-selesai").textContent = totalSelesai;

        // Tampilkan tiga pesan terbaru
        const latestContact = document.getElementById("latest-contact");
        latestContact.replaceChildren();

        if (contacts.length === 0) {
            latestContact.textContent = "Tidak ada pesan.";
            return;
        }

        const latest = contacts.slice(0, 3);

        latest.forEach((contact) => {
            const item = document.createElement("div");
            item.className = "contact-item";

            const header = document.createElement("div");
            header.className = "contact-header";

            const name = document.createElement("span");
            name.className = "contact-name";
            name.textContent = contact.nama;

            const email = document.createElement("span");
            email.className = "contact-email";
            email.textContent = contact.email;

            const message = document.createElement("div");
            message.className = "contact-message";
            message.textContent = contact.pesan;

            const date = document.createElement("div");
            date.className = "contact-date";
            date.textContent = contact.created_at;

            header.append(name, email);
            item.append(header, message, date);
            latestContact.appendChild(item);
        });
    } catch (error) {
        console.error("Dashboard ERROR:", error);
    }
}
loadDashboard();

const logoutButton = document.getElementById("logout-button");

logoutButton?.addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.removeItem("adminToken");
    window.location.replace("login.html");
});
