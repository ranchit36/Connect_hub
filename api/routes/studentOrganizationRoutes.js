const express = require("express");
const router = express.Router();
const StudentOrganization = require("../models/StudentOrganization");

router.post("/add", async (req, res) => {
  try {
    const { name, description, president, eventsOrganized, establishedYear } = req.body;
    const existingOrganization = await StudentOrganization.findOne({ name });
    if (existingOrganization) {
      return res.status(400).json({ message: "Student organization with this name already exists!" });
    }
    const newOrganization = new StudentOrganization({
      name,
      description,
      president,
      eventsOrganized,
      establishedYear,
    });
    const savedOrganization = await newOrganization.save();
    res.status(201).json(savedOrganization);
  } catch (error) {
    console.error("Error adding student organization:", error);
    res.status(500).json({ message: error.message || "An error occurred while adding the student organization." });
  }
});

router.get("/", async (req, res) => {
  try {
    const organizations = await StudentOrganization.find();
    res.status(200).json(organizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching student organizations." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const organization = await StudentOrganization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Student organization not found." });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the student organization." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrganization = await StudentOrganization.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedOrganization) {
      return res.status(404).json({ message: "Student organization not found." });
    }
    res.status(200).json(updatedOrganization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the student organization." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrganization = await StudentOrganization.findByIdAndDelete(req.params.id);
    if (!deletedOrganization) {
      return res.status(404).json({ message: "Student organization not found." });
    }
    res.status(200).json({ message: "Student organization deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the student organization." });
  }
});

module.exports = router;
