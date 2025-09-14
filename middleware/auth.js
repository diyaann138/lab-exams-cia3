// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const requireTeacher = (req, res, next) => {
  if (req.user?.role !== "teacher") return res.status(403).json({ msg: "Teacher role required" });
  next();
};
