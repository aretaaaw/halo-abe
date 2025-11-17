const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));
app.use(express.json());
app.use(express.static("../pages"));
app.use(express.static("../public"));

const supabaseUrl = "https://anyylsedulbqhtsxteej.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXlsc2VkdWxicWh0c3h0ZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI1NDA2NCwiZXhwIjoyMDc4ODMwMDY0fQ.V_3FdZZpsfmXTSsxbROgXHk499XbnQQvB-tSg_VzbbI"; // backend gunakan service role
const supabase = createClient(supabaseUrl, supabaseKey);

// --------------------
// USER PROFILE INSERT
// --------------------
app.post("/save-profile", async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username)
    return res.status(400).json({ error: "Data tidak lengkap" });

  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id, username }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json({ message: "Profile saved!", data });
});

// --------------------
// GET PROFILE
// --------------------
app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

app.listen(8080, () => console.log("Backend berjalan di http://localhost:8080"));
