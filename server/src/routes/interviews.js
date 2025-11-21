import express from "express";
import Interview from "../models/Interview.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// POST /api/interviews - schedule interview (HR/Admin)
router.post("/", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const { title, type, scheduledAt, candidates, notes } = req.body;
    const interview = await Interview.create({
      title,
      type,
      scheduledAt,
      candidates, // array of user IDs
      notes,
      createdBy: req.user._id,
    });
    res.status(201).json(interview);
  } catch (err) {
    console.error("Interview creation error:", err);
    res.status(500).json({ message: "Server error creating interview" });
  }
});

// GET /api/interviews - list interviews
router.get("/", protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "student") {
      query = { candidates: req.user._id };
    }
    const interviews = await Interview.find(query).populate("candidates", "name email");
    res.json(interviews);
  } catch (err) {
    console.error("Fetching interviews error:", err);
    res.status(500).json({ message: "Server error fetching interviews" });
  }
});

// GET /api/interviews/:id - single interview
router.get("/:id", protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("candidates", "name email");
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (req.user.role === "student" && !interview.candidates.some(c => c._id.equals(req.user._id))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(interview);
  } catch (err) {
    console.error("Fetching interview error:", err);
    res.status(500).json({ message: "Server error fetching interview" });
  }
});

// PUT /api/interviews/:id - update interview (HR/Admin)
router.put("/:id", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (err) {
    console.error("Updating interview error:", err);
    res.status(500).json({ message: "Server error updating interview" });
  }
});

// DELETE /api/interviews/:id - delete interview (HR/Admin)
router.delete("/:id", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.error("Deleting interview error:", err);
    res.status(500).json({ message: "Server error deleting interview" });
  }
});

export default router;
