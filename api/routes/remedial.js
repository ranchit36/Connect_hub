const router = require("express").Router();
const RemedialAssignment = require("../models/RemedialAssignment");
const RemedialSubmission = require("../models/RemedialSubmission");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Use the same multer config as in index.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// TEACHER: Create remedial assignment (image + max marks)
router.post("/assignment", upload.single("image"), async (req, res) => {
  try {
    const { title, description, maxMarks, teacherId } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) return res.status(400).json({ message: "Image is required" });
    const assignment = new RemedialAssignment({
      title,
      description,
      image,
      maxMarks,
      teacherId,
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STUDENT: Get all remedial assignments
router.get("/assignments", async (req, res) => {
  try {
    const assignments = await RemedialAssignment.find().populate("teacherId", "username");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STUDENT: Submit solution (image upload)
router.post("/submission", upload.single("image"), async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) return res.status(400).json({ message: "Image is required" });
    const submission = new RemedialSubmission({
      assignmentId,
      studentId,
      image,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TEACHER: View all submissions for an assignment
router.get("/assignment/:id/submissions", async (req, res) => {
  try {
    const submissions = await RemedialSubmission.find({ assignmentId: req.params.id })
      .populate("studentId", "username email");
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TEACHER: Assign marks to a submission
router.patch("/submission/:id/marks", async (req, res) => {
  try {
    const { marksAwarded } = req.body;
    const submission = await RemedialSubmission.findByIdAndUpdate(
      req.params.id,
      { marksAwarded },
      { new: true }
    );
    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TEACHER: Get remedial report (total marks per student, performance label, total assignments, assignments submitted)
router.get("/report", async (req, res) => {
  try {
    // Aggregate total marks per student
    const aggregation = await RemedialSubmission.aggregate([
      { $match: { marksAwarded: { $ne: null } } },
      {
        $group: {
          _id: "$studentId",
          totalMarks: { $sum: "$marksAwarded" },
          count: { $sum: 1 },
        },
      },
    ]);
    // Get all assignments
    const assignments = await RemedialAssignment.find();
    const maxTotal = assignments.reduce((sum, a) => sum + Number(a.maxMarks), 0);
    const totalAssignments = assignments.length;
    // Attach student info and performance label
    const report = await Promise.all(
      aggregation.map(async (entry) => {
        const student = await User.findById(entry._id);
        const percent = maxTotal ? (entry.totalMarks / maxTotal) * 100 : 0;
        let performance = "Poor";
        if (percent > 90) performance = "Excellent";
        else if (percent > 75) performance = "Good";
        else if (percent > 50) performance = "Average";
        else if (percent > 33) performance = "Below Average";
        // Count how many assignments this student submitted
        const assignmentsSubmitted = await RemedialSubmission.countDocuments({ studentId: entry._id });
        return {
          student: student ? student.username : "Unknown",
          email: student ? student.email : "",
          totalMarks: entry.totalMarks,
          percent: percent.toFixed(2),
          performance,
          totalAssignments,
          assignmentsSubmitted,
        };
      })
    );
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 