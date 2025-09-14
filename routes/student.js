// routes/students.js
import express from "express";
import Student from "../models/Student.js";
import Marks from "../models/Marks.js";
import { auth, requireTeacher } from "../middleware/auth.js";

const router = express.Router();

// Add a new student (teacher only)
router.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { name, regNo, class: studentClass, batch } = req.body;
    if (!name || !regNo) return res.status(400).json({ msg: "name and regNo required" });

    const exists = await Student.findOne({ regNo });
    if (exists) return res.status(400).json({ msg: "Student with this regNo exists" });

    const student = new Student({ name, regNo, class: studentClass, batch });
    await student.save();

    // create default marks doc
    const markDoc = new Marks({ student: student._id });
    await markDoc.save();

    res.json({ msg: "Student created", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all students (public for logged users)
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get a student + marks
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const marks = await Marks.findOne({ student: student._id });
    res.json({ student, marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
