import schedule from "node-schedule";
import Interview from "../models/Interview.js";
import Notification from "../models/Notification.js";

// Check every 10 minutes
schedule.scheduleJob("*/10 * * * *", async () => {
  const now = new Date();
  const inNextHour = new Date(Date.now() + 60 * 60 * 1000);

  const upcoming = await Interview.find({
    scheduledAt: { $gte: now, $lte: inNextHour }
  });

  for (const interview of upcoming) {
    for (const candidateId of interview.candidates) {
      await Notification.create({
        user: candidateId,
        type: "interview",
        message: `Upcoming interview: ${interview.title} at ${interview.scheduledAt.toLocaleString()}`,
        link: `/dashboard/interviews/${interview._id}`
      });
    }
  }
});
