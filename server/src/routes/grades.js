import express from "express";
import Quiz from "../models/Quiz.js";
import Assignment from "../models/Assignment.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * Student submits answers for a quiz
 * Body: { quizId, answers: [{ questionId, answer }] }
 */
router.post("/submit", protect, authorize("student"), async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Fetch quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Auto-grading for MCQs
    let totalMcq = 0;
    let correct = 0;

    for (const q of quiz.questions) {
      if (q.type === "mcq") totalMcq++;
    }

    for (const a of answers) {
      const question = quiz.questions.id(a.questionId);
      if (!question) continue;

      if (question.type === "mcq") {
        const correctAnswer = question.answer;

        if (Array.isArray(correctAnswer)) {
          // multiple correct indices
          const areEqual =
            Array.isArray(a.answer) &&
            a.answer.length === correctAnswer.length &&
            a.answer.every((v) => correctAnswer.includes(v));
          if (areEqual) correct++;
        } else {
          if (a.answer === correctAnswer) correct++;
        }
      }
      // subjective/coding: skip auto-grading (pending)
    }

    const score = totalMcq ? Math.round((correct / totalMcq) * 100) : 0;

    // Save or update assignment record
    let assignment = await Assignment.findOne({ user: req.user._id, quiz: quizId });

    if (!assignment) {
      assignment = await Assignment.create({
        user: req.user._id,
        quiz: quizId,
        status: "completed",
        score,
      });
    } else {
      assignment.status = "completed";
      assignment.score = score;
      await assignment.save();
    }

    res.json({ score, totalMcq, correct });
  } catch (err) {
    console.error("Quiz submission error:", err);
    res.status(500).json({ message: "Server error submitting quiz" });
  }
});

export default router;
