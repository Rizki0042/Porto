const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

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