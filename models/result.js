import mongoose from "mongoose";

// --- Mongoose Schema Definition ---
// This defines the structure for documents in the 'results' collection.
const resultSchema = new mongoose.Schema({
  pastExamResults: [
    {
      subject: String,
      totalMarks: Number,
      marksScored: Number,
    },
  ],
});

// Create and export the Mongoose model
const Result = mongoose.model("Result", resultSchema);
export default Result;