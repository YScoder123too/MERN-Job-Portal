import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  status: {
    type: String,
    enum: ["assigned", "in-progress", "completed"],
    default: "assigned",
  },
  score: { type: Number },
  assignedAt: { type: Date, default: Date.now },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
