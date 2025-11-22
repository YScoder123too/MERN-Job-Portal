// // // import express from "express";
// // // import multer from "multer";
// // // import path from "path";
// // // import fs from "fs";
// // // import Job from "../models/Job.js";
// // // import { protect } from "../middleware/auth.js";

// // // const router = express.Router();

// // // const uploadDir = "uploads/resumes";
// // // if (!fs.existsSync(uploadDir)) {
// // //   fs.mkdirSync(uploadDir, { recursive: true });
// // // }

// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     cb(null, uploadDir);
// // //   },
// // //   filename: (req, file, cb) => {
// // //     cb(null, `${Date.now()}-${file.originalname}`);
// // //   },
// // // });

// // // const upload = multer({
// // //   storage,
// // //   fileFilter: (req, file, cb) => {
// // //     const filetypes = /pdf|doc|docx/;
// // //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// // //     if (extname) {
// // //       return cb(null, true);
// // //     }
// // //     cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
// // //   },
// // // });

// // // router.get("/suggest-jobs", async (req, res) => {
// // //   try {
// // //     const { q } = req.query;
// // //     if (!q) return res.json([]);

// // //     const regex = new RegExp(q, "i");
// // //     const jobs = await Job.find(
// // //       { $or: [{ title: regex }, { company: regex }] },
// // //       { title: 1, company: 1 }
// // //     ).limit(10);

// // //     const suggestions = [
// // //       ...new Set(jobs.map((job) => job.title)),
// // //       ...new Set(jobs.map((job) => job.company)),
// // //     ].slice(0, 10);

// // //     res.json(suggestions);
// // //   } catch (err) {
// // //     res.status(500).json({ message: "Error fetching suggestions" });
// // //   }
// // // });

// // // router.get("/suggest-locations", async (req, res) => {
// // //   try {
// // //     const { q } = req.query;
// // //     if (!q) return res.json([]);

// // //     const regex = new RegExp(q, "i");
// // //     const jobs = await Job.find(
// // //       { location: regex },
// // //       { location: 1 }
// // //     ).limit(10);

// // //     const suggestions = [...new Set(jobs.map((job) => job.location))];
// // //     res.json(suggestions);
// // //   } catch (err) {
// // //     res.status(500).json({ message: "Error fetching location suggestions" });
// // //   }
// // // });

// // // router.post("/upload-resume", upload.single("resume"), (req, res) => {
// // //   try {
// // //     if (!req.file) {
// // //       return res.status(400).json({ message: "No file uploaded" });
// // //     }
// // //     res.status(200).json({
// // //       message: "Resume uploaded successfully",
// // //       filePath: req.file.path,
// // //     });
// // //   } catch (err) {
// // //     res.status(500).json({ message: "Server error during upload" });
// // //   }
// // // });

// // // router.get("/", async (req, res) => {
// // //   try {
// // //     const {
// // //       q = "",
// // //       jobType,
// // //       pay,
// // //       remote,
// // //       company,
// // //       datePosted,
// // //       experience,
// // //       jobLanguage,
// // //       programmingLanguage,
// // //       education,
// // //       industry,
// // //       location,
// // //       page = 1,
// // //       limit = 20,
// // //     } = req.query;

// // //     let filter = {
// // //       $or: [
// // //         { title: { $regex: q, $options: "i" } },
// // //         { company: { $regex: q, $options: "i" } },
// // //         { description: { $regex: q, $options: "i" } }, // ADDED: Search description
// // //         { skills: { $in: [new RegExp(q, "i")] } },
// // //       ],
// // //     };

// // //     if (jobType && jobType !== "Any") filter.jobType = jobType;
// // //     if (pay && pay !== "Any") filter.pay = pay;
// // //     if (remote && remote !== "Any") filter.remote = remote;
// // //     if (company) filter.company = { $regex: company, $options: "i" };
    
// // //     if (datePosted && datePosted !== "Any") {
// // //       const days =
// // //         datePosted === "Last 24 hours" ? 1 : datePosted === "Last 7 days" ? 7 : 30;
// // //       filter.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
// // //     }

// // //     if (experience && experience !== "Any") filter.experience = experience;
// // //     if (jobLanguage && jobLanguage !== "Any") filter.jobLanguage = jobLanguage;
// // //     if (programmingLanguage && programmingLanguage !== "Any")
// // //       filter.programmingLanguage = programmingLanguage;
// // //     if (education && education !== "Any") filter.education = education;
// // //     if (industry && industry !== "Any") filter.industry = industry;
// // //     if (location && location !== "Any")
// // //       filter.location = { $regex: location, $options: "i" };

// // //     const jobs = await Job.find(filter)
// // //       .sort({ createdAt: -1 })
// // //       .skip((page - 1) * limit)
// // //       .limit(Number(limit));

// // //     const total = await Job.countDocuments(filter);

// // //     res.json({
// // //       page: Number(page),
// // //       limit: Number(limit),
// // //       total,
// // //       totalPages: Math.ceil(total / limit),
// // //       data: jobs,
// // //     });
// // //   } catch (err) {
// // //     console.error("Error fetching jobs:", err);
// // //     res.status(500).json({ message: "Server error fetching jobs" });
// // //   }
// // // });

// // // router.get("/:id", async (req, res) => {
// // //   try {
// // //     const job = await Job.findById(req.params.id);
// // //     if (!job) return res.status(404).json({ message: "Job not found" });
// // //     res.json(job);
// // //   } catch (err) {
// // //     console.error("Error fetching job:", err);
// // //     res.status(500).json({ message: "Server error fetching job" });
// // //   }
// // // });

// // // // router.post("/", protect, async (req, res) => {
// // // //   try {
// // // //     const job = await Job.create({ ...req.body, postedBy: req.user.id });
// // // //     res.status(201).json(job);
// // // //   } catch (err) {
// // // //     console.error("Error creating job:", err);
// // // //     res.status(500).json({ message: "Server error creating job" });
// // // //   }
// // // // });
// // // router.post("/", protect, async (req, res) => {
// // //   try {
// // //     const newJob = new Job({ 
// // //       ...req.body, 
// // //       postedBy: req.user.id 
// // //     });
    
// // //     const job = await newJob.save();
    
// // //     res.status(201).json(job);
// // //   } catch (err) {
// // //     let errorMessage = "Server error creating job";
    
// // //     if (err.name === 'ValidationError') {
// // //         const fields = Object.keys(err.errors).join(', ');
// // //         errorMessage = `Validation failed! Missing or invalid fields: ${fields}`;
// // //     }
    
// // //     console.error("Error creating job:", errorMessage, err); 
// // //     res.status(400).json({ message: errorMessage }); 
// // //   }
// // // });
// // // export default router;
// // import express from "express";
// // import multer from "multer";
// // import path from "path";
// // import fs from "fs";
// // import Job from "../models/Job.js";
// // import { protect } from "../middleware/auth.js";
// // import mongoose from "mongoose"; // CRITICAL: Added Mongoose import here for the fix

// // import { fileURLToPath } from 'url';
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const router = express.Router();

// // const uploadDir = "uploads/resumes";
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, uploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   },
// // });

// // const upload = multer({
// //   storage,
// //   fileFilter: (req, file, cb) => {
// //     const filetypes = /pdf|doc|docx/;
// //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// //     if (extname) {
// //       return cb(null, true);
// //     }
// //     cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
// //   },
// // });

// // router.get("/suggest-jobs", async (req, res) => {
// //   try {
// //     const { q } = req.query;
// //     if (!q) return res.json([]);

// //     const regex = new RegExp(q, "i");
// //     const jobs = await Job.find(
// //       { $or: [{ title: regex }, { company: regex }] },
// //       { title: 1, company: 1 }
// //     ).limit(10);

// //     const suggestions = [
// //       ...new Set(jobs.map((job) => job.title)),
// //       ...new Set(jobs.map((job) => job.company)),
// //     ].slice(0, 10);

// //     res.json(suggestions);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching suggestions" });
// //   }
// // });

// // router.get("/suggest-locations", async (req, res) => {
// //   try {
// //     const { q } = req.query;
// //     if (!q) return res.json([]);

// //     const regex = new RegExp(q, "i");
// //     const jobs = await Job.find(
// //       { location: regex },
// //       { location: 1 }
// //     ).limit(10);

// //     const suggestions = [...new Set(jobs.map((job) => job.location))];
// //     res.json(suggestions);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching location suggestions" });
// //   }
// // });

// // router.post("/upload-resume", upload.single("resume"), (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }
// //     res.status(200).json({
// //       message: "Resume uploaded successfully",
// //       filePath: req.file.path,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error during upload" });
// //   }
// // });

// // router.get("/", async (req, res) => {
// //   try {
// //     const {
// //       q = "",
// //       jobType,
// //       pay,
// //       remote,
// //       company,
// //       datePosted,
// //       experience,
// //       jobLanguage,
// //       programmingLanguage,
// //       education,
// //       industry,
// //       location,
// //       page = 1,
// //       limit = 20,
// //     } = req.query;

// //     let filter = {
// //       $or: [
// //         { title: { $regex: q, $options: "i" } },
// //         { company: { $regex: q, $options: "i" } },
// //         { description: { $regex: q, $options: "i" } },
// //         { skills: { $in: [new RegExp(q, "i")] } },
// //       ],
// //     };

// //     // if (jobType && jobType !== "Any") filter.jobType = jobType;
// //     // if (pay && pay !== "Any") filter.pay = pay;
// //     // if (remote && remote !== "Any") filter.remote = remote;
// //     // if (company) filter.company = { $regex: company, $options: "i" };
    
// //     // if (datePosted && datePosted !== "Any") {
// //     //   const days =
// //     //     datePosted === "Last 24 hours" ? 1 : datePosted === "Last 7 days" ? 7 : 30;
// //     //   filter.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
// //     // }

// //     // if (experience && experience !== "Any") filter.experience = experience;
// //     // if (jobLanguage && jobLanguage !== "Any") filter.jobLanguage = jobLanguage;
// //     // if (programmingLanguage && programmingLanguage !== "Any")
// //     //   filter.programmingLanguage = programmingLanguage;
// //     // if (education && education !== "Any") filter.education = education;
// //     // if (industry && industry !== "Any") filter.industry = industry;
// //     // if (location && location !== "Any")
// //     //   filter.location = { $regex: location, $options: "i" };
// // // ... existing code ...
// //     if (jobType && jobType !== "Any") filter.type = jobType; // Changed from filter.jobType to filter.type (matches Schema)
// //     if (pay && pay !== "Any") filter.pay = pay;
    
// //     // FIX: Your Schema doesn't have a 'remote' field, it uses 'location'
// //     // We assume if they ask for remote, we check the location field
// //     if (remote && remote !== "Any") {
// //         if (remote.toLowerCase() === 'remote') {
// //              filter.location = { $regex: 'remote', $options: 'i' };
// //         }
// //     }

// //     if (company) filter.company = { $regex: company, $options: "i" };
// //     // ... rest of code ...



// //     const jobs = await Job.find(filter)
// //       .sort({ createdAt: -1 })
// //       .skip((page - 1) * limit)
// //       .limit(Number(limit));

// //     const total = await Job.countDocuments(filter);

// //     res.json({
// //       page: Number(page),
// //       limit: Number(limit),
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //       data: jobs,
// //     });
// //   } catch (err) {
// //     console.error("Error fetching jobs:", err);
// //     res.status(500).json({ message: "Server error fetching jobs" });
// //   }
// // });

// // router.get("/:id", async (req, res) => {
// //   try {
// //     const job = await Job.findById(req.params.id);
// //     if (!job) return res.status(404).json({ message: "Job not found" });
// //     res.json(job);
// //   } catch (err) {
// //     console.error("Error fetching job:", err);
// //     res.status(500).json({ message: "Server error fetching job" });
// //   }
// // });

// // // router.post("/", protect, async (req, res) => {
// // //   try {
// // //     const newJob = new Job({ 
// // //       ...req.body, 
// // //       // CRITICAL FIX: Ensure the ID is a Mongoose ObjectId type
// // //       postedBy: new mongoose.Types.ObjectId(req.user.id)
// // //     });
    
// // //     const job = await newJob.save();
    
// // //     console.log(`Job successfully saved: ${job._id}`); 

// // //     res.status(201).json(job);
// // //   } catch (err) {
// // //     let errorMessage = "Server error creating job";
    
// // //     if (err.name === 'ValidationError') {
// // //         const fields = Object.keys(err.errors).join(', ');
// // //         errorMessage = `Validation failed! Missing or invalid fields: ${fields}`;
// // //     }
    
// // //     console.error("Error creating job:", errorMessage, err.message); 
// // //     res.status(400).json({ message: errorMessage }); 
// // //   }
// // // });
// // router.post("/", protect, async (req, res) => {
// //   try {
// //     console.log("Received Job Data:", req.body); // Debugging: See exactly what the frontend sends

// //     // FIX: Map incoming frontend fields to the Database Schema fields
// //     const jobData = {
// //       title: req.body.title || req.body.jobTitle || "Untitled Job",
// //       company: req.body.company || req.body.companyName || "Unknown Company",
// //       location: req.body.location || req.body.jobLocation || "Remote",
// //       type: req.body.type || req.body.jobType || "Full-time",
// //       description: req.body.description || "",
// //       skills: req.body.skills || [],
// //       postedBy: req.user.id // This comes from the 'protect' middleware
// //     };

// //     const newJob = new Job(jobData);
// //     const job = await newJob.save();
    
// //     console.log(`SUCCESS: Job saved to database with ID: ${job._id}`); 
// //     res.status(201).json(job);

// //   } catch (err) {
// //     let errorMessage = "Server error creating job";
    
// //     if (err.name === 'ValidationError') {
// //         const fields = Object.keys(err.errors).join(', ');
// //         errorMessage = `Validation failed! Missing fields: ${fields}`;
// //     }
    
// //     console.error("FAILED to save job:", errorMessage, err.message); 
// //     res.status(400).json({ message: errorMessage }); 
// //   }
// // });


// // // SERVE RESUME FILE
// // router.get("/resume/:filename", (req, res) => {
// //   // Adjust path to reach 'server/uploads/resumes'
// //   // Assuming jobs.js is in server/src/routes
// //   const filePath = path.join(__dirname, "../../uploads/resumes", req.params.filename);
  
// //   if (fs.existsSync(filePath)) {
// //     res.sendFile(filePath);
// //   } else {
// //     res.status(404).send("Resume file not found on server.");
// //   }
// // });
// // export default router;

// import express from "express";
// import Job from "../models/Job.js";
// import { protect } from "../middleware/auth.js";
// import mongoose from "mongoose";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const router = express.Router();

// // --- 1. SETUP FILE UPLOAD STORAGE (Absolute Path) ---
// // This finds the root of your project and looks for 'uploads/resumes'
// const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');

// // Create folder if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log(`Created directory: ${uploadDir}`);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Clean filename to avoid weird characters
//     const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
//     cb(null, `${Date.now()}-${safeName}`);
//   },
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
// });

// // --- 2. UPLOAD ROUTE (The one that was failing) ---
// router.post("/upload-resume", upload.single("resume"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     console.log("File uploaded successfully:", req.file.filename);
    
//     // Return the path so Frontend can save it
//     res.status(200).json({
//       message: "Resume uploaded successfully",
//       filePath: req.file.filename, // We just send the filename back
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     res.status(500).json({ message: "Server error during upload" });
//   }
// });

// // --- 3. SERVE RESUME FILE (The View Link) ---
// router.get("/resume/:filename", (req, res) => {
//   const filePath = path.join(uploadDir, req.params.filename);
  
//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.status(404).send("Resume file not found on server.");
//   }
// });

// // --- 4. SUGGESTIONS ROUTES ---
// router.get("/suggest-jobs", async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q) return res.json([]);
//     const regex = new RegExp(q, "i");
//     const jobs = await Job.find({ $or: [{ title: regex }, { company: regex }] }).limit(10);
//     const suggestions = [...new Set(jobs.map((job) => job.title))].slice(0, 10);
//     res.json(suggestions);
//   } catch (err) { res.status(500).json({ message: "Error" }); }
// });

// router.get("/suggest-locations", async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q) return res.json([]);
//     const regex = new RegExp(q, "i");
//     const jobs = await Job.find({ location: regex }).limit(10);
//     const suggestions = [...new Set(jobs.map((job) => job.location))];
//     res.json(suggestions);
//   } catch (err) { res.status(500).json({ message: "Error" }); }
// });

// // --- 5. CRUD ROUTES ---
// router.get("/", async (req, res) => {
//   try {
//     const { q = "", jobType, company, location } = req.query;
//     let filter = {
//       $or: [
//         { title: { $regex: q, $options: "i" } },
//         { company: { $regex: q, $options: "i" } },
//       ],
//     };
//     if (jobType && jobType !== "Any") filter.type = jobType;
//     if (company) filter.company = { $regex: company, $options: "i" };
//     if (location) filter.location = { $regex: location, $options: "i" };

//     const jobs = await Job.find(filter).sort({ createdAt: -1 });
//     res.json({ data: jobs });
//   } catch (err) {
//     console.error("Error fetching jobs:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     res.json(job);
//   } catch (err) { res.status(500).json({ message: "Server error" }); }
// });

// router.post("/", protect, async (req, res) => {
//   try {
//     const jobData = {
//       ...req.body,
//       postedBy: new mongoose.Types.ObjectId(req.user.id)
//     };
//     const newJob = new Job(jobData);
//     const job = await newJob.save();
//     res.status(201).json(job);
//   } catch (err) {
//     console.error("Error creating job:", err); 
//     res.status(400).json({ message: "Failed to create job" }); 
//   }
// });

// router.delete("/:id", protect, async (req, res) => {
//     try {
//         await Job.findByIdAndDelete(req.params.id);
//         res.json({ message: "Deleted" });
//     } catch(e) { res.status(500).send("Error"); }
// });

// export default router;

import express from "express";
import Job from "../models/Job.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// --- 1. CLOUD-SAFE STORAGE SETUP ---
// This ensures we find the folder on Render no matter where the script runs
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');

// Create folder if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Clean filename to avoid weird characters
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// --- 2. ROUTES ---

router.post("/upload-resume", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file.filename);
    
    res.status(200).json({
      message: "Resume uploaded successfully",
      filePath: req.file.filename, // Send back ONLY the filename
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
});

router.get("/suggest-jobs", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const regex = new RegExp(q, "i");
    const jobs = await Job.find({ $or: [{ title: regex }, { company: regex }] }).limit(10);
    const suggestions = [...new Set(jobs.map((job) => job.title))].slice(0, 10);
    res.json(suggestions);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.get("/suggest-locations", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const regex = new RegExp(q, "i");
    const jobs = await Job.find({ location: regex }).limit(10);
    const suggestions = [...new Set(jobs.map((job) => job.location))];
    res.json(suggestions);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.get("/", async (req, res) => {
  try {
    const { q = "", jobType, company, location } = req.query;
    let filter = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
      ],
    };
    if (jobType && jobType !== "Any") filter.type = jobType;
    if (company) filter.company = { $regex: company, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ data: jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.post("/", protect, async (req, res) => {
  try {
    const newJob = new Job({ 
      ...req.body, 
      postedBy: new mongoose.Types.ObjectId(req.user.id)
    });
    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err); 
    res.status(400).json({ message: "Failed to create job" }); 
  }
});

export default router;