const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/miniCRM")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  notes: String,
  status: { type: String, default: "new" }
});

const Lead = mongoose.model("Lead", leadSchema);

// GET
app.get("/leads", async (req, res) => {
  const leads = await Lead.find();

  const formatted = leads.map(l => ({
    _id: l._id.toString(),
    name: l.name,
    email: l.email,
    source: l.source,
    notes: l.notes,
    status: l.status
  }));

  res.json(formatted);
});

// ADD
app.post("/leads", async (req, res) => {
  const { name, email, source, notes } = req.body;
  await Lead.create({ name, email, source, notes });
  res.json({ success: true });
});

// DELETE
app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// EDIT
app.put("/leads/:id", async (req, res) => {
  const { name, email, source, notes } = req.body;
  await Lead.findByIdAndUpdate(req.params.id, {
    name,
    email,
    source,
    notes
  });
  res.json({ success: true });
});

// STATUS
app.put("/leads/status/:id", async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (lead.status === "new") lead.status = "contacted";
  else if (lead.status === "contacted") lead.status = "converted";
  else lead.status = "new";

  await lead.save();
  res.json({ success: true });
});

app.listen(5000, () =>
  console.log("Server running on http://127.0.0.1:5000")
);