import express from "express";
import Result from "../models/result.js"; // Import the model

// Initialize the express router
const resultrouter = express.Router();

// --- Controller & Route Definition ---
// GET /api/results/
// This controller logic now fetches ALL documents from the collection.
resultrouter.get("/iwp", async (req, res) => {
  try {
    // Use Result.find() with an empty object to get all documents
    const allResults = await Result.find({});

    // Send the array of documents as a JSON response
    res.status(200).json(allResults);
    
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ msg: "Server error occurred" });
  }
});

// Export the router
export default resultrouter;