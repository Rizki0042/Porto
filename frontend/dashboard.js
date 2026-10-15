
async function loadDashboard() {
  try {
    const response = await fetch("https://hypetext-api.vercel.app/contact");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
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
    document.getElementById("total-contact").textContent = contacts.length;
    document.getElementById("total-baru").textContent = totalBaru;
    document.getElementById("total-dibaca").textContent = totalDibaca;
    document.getElementById("total-selesai").textContent = totalSelesai;

    // Tampilkan pesan terbaru
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

// Jalankan ketika halaman dibuka
loadDashboard();
