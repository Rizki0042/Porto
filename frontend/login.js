const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://hypetext-api.vercel.app";

const loginForm = document.querySelector("#login-form");
const loginButton = document.querySelector("#login-button");
const loginStatus = document.querySelector("#login-status");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;

    loginButton.disabled = true;
    loginStatus.textContent = "Sedang memverifikasi login...";

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login gagal.");
        }

        sessionStorage.setItem("adminToken", result.token);

        window.location.href = "dashboard.html";
    } catch (error) {
        loginStatus.textContent =
            error.message || "Tidak dapat menghubungi server.";

        loginButton.disabled = false;
    }
});
