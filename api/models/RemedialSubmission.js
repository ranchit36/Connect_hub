const mongoose = require("mongoose");

const RemedialSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "RemedialAssignment", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true }, // Path to submission image
    marksAwarded: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedialSubmission", RemedialSubmissionSchema); 