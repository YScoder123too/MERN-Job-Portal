import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("Fetching notifications error:", err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

// Mark a notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ message: "Server error updating notification" });
  }
});

export default router;
