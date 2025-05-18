const mongoose = require("mongoose");

const StudentOrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      max: 1000,
    },
    president: {
      type: String, // Name of the organization president
      required: true,
      max: 100,
    },
    eventsOrganized: {
      type: [String], // List of events organized by the student organization
      default: [],
    },
    establishedYear: {
      type: Number, // Year the organization was established
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentOrganization", StudentOrganizationSchema);
