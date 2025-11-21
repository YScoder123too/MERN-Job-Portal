import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["HR", "Tech"], default: "Tech" },
    scheduledAt: { type: Date, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }],
    notes: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
