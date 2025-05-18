const router = require("express").Router();
const QAConversation = require("../models/QAConversation");
const User = require("../models/User");

// Create new Q&A conversation
router.post("/", async (req, res) => {
  const newQA = new QAConversation({
    question: req.body.question,
    chatbotAnswer: req.body.chatbotAnswer,
    studentId: req.body.studentId,
  });

  try {
    const savedQA = await newQA.save();
    res.status(200).json(savedQA);
  } catch (err) {
    console.error("Error saving Q&A:", err);
    res.status(500).json({ message: "Error saving Q&A", error: err.message });
  }
});

// Get all Q&A conversations with pagination

// Get all Q&A conversations
router.get("/", async (req, res) => {
  try {
    // Simple direct query to get all documents
    const conversations = await QAConversation.find({});
    
    console.log("Query result:", conversations);

    res.status(200).json({
      conversations: conversations
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Could not fetch conversations" });
  }
});

// Update Q&A status
router.put("/:id", async (req, res) => {
  try {
    const qa = await QAConversation.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ message: "Q&A not found" });
    }

    if (req.body.teacherModifiedAnswer) {
      qa.teacherModifiedAnswer = req.body.teacherModifiedAnswer;
      qa.status = "modified";
    } else {
      qa.teacherApproved = true;
      qa.status = "approved";
    }

    const updatedQA = await qa.save();
    res.status(200).json(updatedQA);
  } catch (err) {
    console.error("Error updating Q&A:", err);
    res.status(500).json({ message: "Error updating Q&A", error: err.message });
  }
});

module.exports = router;