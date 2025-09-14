import express from "express";
import Marks from "../models/Marks.js";

const router = express.Router();

// Save marks
router.post("/save", async (req, res) => {
  try {
    const marks = new Marks(req.body);
    await marks.save();
    res.json({ msg: "Marks saved successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Error saving marks", error: err.message });
  }
});

// Get all marks
router.get("/all", async (req, res) => {
  try {
    const data = await Marks.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching marks", error: err.message });
  }
});

export default router;
