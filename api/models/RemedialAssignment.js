const mongoose = require("mongoose");

const RemedialAssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true }, // Path to assignment image
    maxMarks: { type: Number, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RemedialAssignment", RemedialAssignmentSchema); 