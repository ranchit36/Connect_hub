const express = require("express");
const router = express.Router();
const Club = require("../models/Club"); // Import the Club model

router.post("/add", async (req, res) => {
  try {
    const { name, description, president, eventsOrganized, establishedYear } = req.body;

    // Check if the organization already exists
    const existingOrganization = await StudentOrganization.findOne({ name });
    if (existingOrganization) {
      return res.status(400).json({ message: "Student organization with this name already exists!" });
    }

    // Create a new student organization
    const newOrganization = new StudentOrganization({
      name,
      description,
      president,
      eventsOrganized,
      establishedYear,
    });

    // Save to the database
    const savedOrganization = await newOrganization.save();
    res.status(201).json(savedOrganization);
  } catch (error) {
    console.error("Error adding student organization:", error);
    res.status(500).json({ message: error.message || "An error occurred while adding the student organization." });
  }
});



// GET: Fetch all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the clubs." });
  }
});

module.exports = router;