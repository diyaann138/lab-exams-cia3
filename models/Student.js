import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  regNo: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
