const mongoose = require("mongoose");

const RemedialSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "RemedialAssignment", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: String, required: true }, // Path to submission file (image or document)
    fileType: { type: String, required: true, enum: ['image', 'document'] }, // Type of file uploaded
    marksAwarded: { type: Number, default: null },
    // Review fields
    reviewFile: { type: String }, // Path to review file (image or document)
    reviewFileType: { type: String, enum: ['image', 'document'] }, // Type of review file
    reviewText: { type: String }, // Text review/feedback
    reviewDate: { type: Date }, // When review was added
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Teacher who reviewed
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedialSubmission", RemedialSubmissionSchema); 