const mongoose = require("mongoose");

const RemedialSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "RemedialAssignment", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: String, required: true }, // Path to submission file (image or document)
    fileType: { type: String, required: true, enum: ['image', 'document'] }, // Type of file uploaded
    marksAwarded: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedialSubmission", RemedialSubmissionSchema); 