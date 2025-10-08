// api/webhook.js
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/webhook", (req, res) => {
  res.status(200).json({ status: "Webhook endpoint active" });
});

app.post("/api/webhook", (req, res) => {
  console.log("Webhook recibido:", req.body);
  res.status(200).json({ message: "Webhook recibido correctamente" });
});

export default app;
