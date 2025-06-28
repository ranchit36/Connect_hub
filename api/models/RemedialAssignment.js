const mongoose = require("mongoose");

const RemedialAssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    file: { type: String, required: true }, // Path to assignment file (image or document)
    fileType: { type: String, required: true, enum: ['image', 'document'] }, // Type of file uploaded
    maxMarks: { type: Number, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedialAssignment", RemedialAssignmentSchema); 