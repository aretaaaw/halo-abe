const backendURL = "http://localhost:3001";

// =======================================
// REGISTER
// =======================================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(backendURL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    const msg = document.getElementById("message");

    if (data.error) {
      msg.innerText = data.error;
      msg.style.color = "red";
    } else {
      msg.innerText = "Registrasi berhasil! Mengalihkan ke halaman login...";
      msg.style.color = "green";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  });
}

// =======================================
// LOGIN
// =======================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(backendURL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    const msg = document.getElementById("message");

    if (data.error) {
      msg.innerText = data.error;
      msg.style.color = "red";
    } else {
      msg.innerText = "Login berhasil! Masuk ke dashboard...";
      msg.style.color = "green";

      // simpan user di localStorage (biar bisa dipakai di halaman lain)
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = "/pages/index.html"; // Ubah sesuai home kamu
      }, 1500);
    }
  });
}
