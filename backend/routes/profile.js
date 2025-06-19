import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Save/update a college doc link
router.post("/college-doc", auth, async (req, res) => {
  const { collegeId, docUrl } = req.body;
  const user = await User.findById(req.user.id);
  user.collegeDocs.set(collegeId, docUrl);
  await user.save();
  res.json({ success: true });
});

// Get all college doc links
router.get("/college-docs", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.collegeDocs || {});
});

export default router;