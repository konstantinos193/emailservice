const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser to parse incoming JSON data
app.use(bodyParser.json());

// GET endpoint to provide usage instructions
app.get("/email", (req, res) => {
  res.status(200).json({
    message: "This is an email service API",
    usage: "This endpoint receives webhooks from ForwardEmail.net"
  });
});

// Endpoint to receive incoming emails from ForwardEmail
app.post("/email", async (req, res) => {
  try {
    // ForwardEmail webhook format
    const { from, to, subject, text, html } = req.body;

    console.log("Received an email from ForwardEmail!");
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text Body: ${text}`);
    if (html) console.log(`HTML Body: ${html}`);

    // Save the email data to Supabase
    await saveEmailToSupabase(from, subject, text || html, to);
    res.status(200).send("Email received and stored successfully.");
  } catch (error) {
    console.error("Error processing email:", error);
    res.status(500).send("Error processing email.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Email service is running on port ${port}`);
});

// Function to save the email to Supabase
async function saveEmailToSupabase(email, subject, body, recipient) {
  // Initialize Supabase client
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    'https://vzytnrfkvnlbnsiskbbf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6eXRucmZrdm5sYm5zaXNrYmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTQxOTIsImV4cCI6MjA1OTQzMDE5Mn0.HXAv0lCjrNqWizRxLP6fcqdwIv101kXlqS-k8G-67po'
  );

  // Insert email into the database
  const { data, error } = await supabase
    .from('emails')
    .insert([
      { email, subject, body, recipient }
    ]);

  if (error) {
    throw error;
  }

  console.log("Email saved to Supabase:", data);
}
