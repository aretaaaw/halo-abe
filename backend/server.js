const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

// =======================================
// SETUP SERVER
// =======================================
const app = express();
app.use(cors());
app.use(express.json());

// =======================================
// KONEKSI KE SUPABASE
// =======================================
const supabaseUrl = "https://anyylsedulbqhtsxteej.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXlsc2VkdWxicWh0c3h0ZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTQwNjQsImV4cCI6MjA3ODgzMDA2NH0.aW6vDlR5P8uv2Nm6dVxNMWgArDQbc1fecfRLACYQrBE";

const supabase = createClient(supabaseUrl, supabaseKey);

// =======================================
// REGISTER
// =======================================
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, password: hashedPassword }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "User berhasil didaftarkan!", data });
});

// =======================================
// LOGIN
// =======================================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });

  if (!users || users.length === 0) {
    return res.status(400).json({ error: "Email tidak terdaftar" });
  }

  const user = users[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Password salah" });
  }

  res.json({
    message: "Login berhasil!",
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// =======================================
// START SERVER
// =======================================
app.listen(3001, () => {
  console.log("Backend berjalan di http://localhost:3001");
});
