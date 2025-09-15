import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  cia1: {
    type: Number,
    default: 0
  },
  cia2: {
    type: Number,
    default: 0
  },
  cia3: {
    type: Number,
    default: 0
  },
  endsem: {
    type: Number,
    default: 0
  },
  midsem: {
    type: Number,
    default: 0
  },
  weekly: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    default: 'F'
  }
}, {
  timestamps: true
});

const Marks = mongoose.model("Marks", marksSchema);
export default Marks;
