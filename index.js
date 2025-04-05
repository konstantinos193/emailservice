require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Healthcheck / Info
app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ Email Service API is live!",
    endpoints: ["/email (POST)", "/inbox/:email (GET)"],
  });
});

// View inbox for specific email (optional helper)
app.get("/inbox/:email", async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .eq("recipient", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching emails:", error);
    return res.status(500).send("Failed to fetch inbox.");
  }

  res.json(data);
});

// Handle incoming webhook from ForwardEmail
app.post("/email", async (req, res) => {
  console.log("📩 Incoming Email Webhook Body:", req.body);

  try {
    const { from, to, subject, text, html } = req.body;

    await saveEmailToSupabase({
      sender: from,
      recipient: to,
      subject: subject || "(No subject)",
      body: text || html || "(No content)",
    });

    res.status(200).send("✅ Email received and saved.");
  } catch (err) {
    console.error("❌ Error saving email:", err);
    res.status(500).send("❌ Failed to process email.");
  }
});

// Save email to Supabase
async function saveEmailToSupabase({ sender, recipient, subject, body }) {
  const { data, error } = await supabase
    .from("emails")
    .insert([{ email: sender, recipient, subject, body }]);

  if (error) throw error;
  console.log("✅ Saved to Supabase:", data);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email service running on port ${PORT}`);
});
