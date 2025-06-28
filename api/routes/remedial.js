const router = require("express").Router();
const RemedialAssignment = require("../models/RemedialAssignment");
const RemedialSubmission = require("../models/RemedialSubmission");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = ["public/images", "public/documents"];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// Multer storage configuration for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine file type and store in appropriate directory
    const fileType = getFileType(file.mimetype);
    const destination = fileType === 'image' ? 'public/images' : 'public/documents';
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Function to determine file type based on mimetype
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype === 'application/pdf' || 
             mimetype.includes('document') || 
             mimetype.includes('text/')) {
    return 'document';
  }
  return 'document'; // Default to document for unknown types
};

// File filter to accept images and documents
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// TEACHER: Create remedial assignment (file upload - image or document)
router.post("/assignment", upload.single("file"), async (req, res) => {
  try {
    const { title, description, maxMarks, teacherId } = req.body;
    const uploadedFile = req.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileType = getFileType(uploadedFile.mimetype);
    
    const assignment = new RemedialAssignment({
      title,
      description,
      file: uploadedFile.filename,
      fileType,
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

// STUDENT: Submit solution (file upload - image or document)
router.post("/submission", upload.single("file"), async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    const uploadedFile = req.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileType = getFileType(uploadedFile.mimetype);
    
    const submission = new RemedialSubmission({
      assignmentId,
      studentId,
      file: uploadedFile.filename,
      fileType,
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