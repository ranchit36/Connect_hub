const mongoose = require("mongoose");

const QAConversationSchema = new mongoose.Schema(
  {
    question: String,
    chatbotAnswer: String,
    teacherApproved: Boolean,
    teacherModifiedAnswer: String,
    status: String,
    studentId: String
  },
  { 
    collection: 'Q_a'  // Make sure this matches exactly
  }
);

module.exports = mongoose.model("QAConversation", QAConversationSchema);