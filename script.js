const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    themeToggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
    themeToggle.querySelector(".theme-toggle-text").textContent = isDark ? "Terang" : "Gelap";
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
});

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nama = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pesan = document.getElementById("message").value;

    try {
        const response = await fetch("http://localhost:3000/contact", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({
                nama: nama,
                email: email,
                pesan: pesan
            })
        });
        const result = await response.json();

        if (response.ok) {
            contactStatus.textContent = "Pesan berhasil dikirim!";
            contactForm.reset();
        }else {
            contactStatus.textContent = result.message;
        }
    } catch (error) {
        console.log(error);
        contactStatus.textContent = "Gagal menghubungi Server.";
    }
});
