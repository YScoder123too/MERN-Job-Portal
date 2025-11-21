import express from "express";
import Assignment from "../models/Assignment.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * Get leaderboard for a quiz or course
 * Query params: quizId, courseId, limit (default 10)
 */
router.get("/", protect, async (req, res) => {
  try {
    const { quizId, courseId, limit = 10 } = req.query;

    const query = {};
    if (quizId) query.quiz = quizId;
    if (courseId) query.course = courseId;

    const leaderboard = await Assignment.find(query)
      .sort({ score: -1 })
      .limit(parseInt(limit))
      .populate("user", "name email");

    // Map result to only essential info
    const result = leaderboard.map((entry) => ({
      user: entry.user,
      score: entry.score,
      status: entry.status,
    }));

    res.json(result);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
});

export default router;
