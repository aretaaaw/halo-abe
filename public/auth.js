const backendURL = "http://localhost:3001";

// =======================
// CEK USER LOGIN OTOMATIS
// =======================
const currentUser = JSON.parse(localStorage.getItem("user"));
if (currentUser) {
  if (window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html")) {
    window.location.href = "/pages/index.html";
  }
}

// =======================
// REGISTER
// =======================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const msg = document.getElementById("message");

    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("Frontend register response:", data);

      if (res.status !== 200) {
        msg.innerText = data.error || "Gagal mendaftar";
        msg.style.color = "red";
      } else {
        // Simpan user di localStorage agar langsung login
        localStorage.setItem("user", JSON.stringify(data.data));
        msg.innerText = "Registrasi berhasil! Mengalihkan ke dashboard...";
        msg.style.color = "green";

        setTimeout(() => window.location.href = "/pages/index.html", 1500);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      msg.innerText = "Terjadi kesalahan koneksi";
      msg.style.color = "red";
    }
  });
}

// =======================
// LOGIN
// =======================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const msg = document.getElementById("message");

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Frontend login response:", data);

      if (res.status !== 200) {
        msg.innerText = data.error || "Gagal login";
        msg.style.color = "red";
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        msg.innerText = "Login berhasil! Mengalihkan ke dashboard...";
        msg.style.color = "green";

        setTimeout(() => window.location.href = "/pages/index.html", 1500);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      msg.innerText = "Terjadi kesalahan koneksi";
      msg.style.color = "red";
    }
  });
}

// =======================
// LOGOUT (opsional di index.html)
// =======================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
