import { useState, useEffect } from "react";
import axios from "axios";
import "./teacherQADashboard.css";

export default function TeacherQADashboard() {
  const [conversations, setConversations] = useState([]);
  const [modifiedAnswer, setModifiedAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/qa");
      console.log("API Response:", res.data); // Debug log
      
      if (!res.data || !Array.isArray(res.data.conversations)) {
        setError("Invalid data format received");
        console.error("Invalid data format:", res.data);
        return;
      }
      
      setConversations(res.data.conversations);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Q&A conversations");
      console.error("Fetch error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (qaId) => {
    try {
      await axios.put(`/api/qa/${qaId}`, {
        teacherApproved: true
      });
      fetchConversations();
    } catch (err) {
      setError("Failed to approve answer");
      console.error(err);
    }
  };

  const handleModify = async (qaId) => {
    try {
      if (!modifiedAnswer.trim()) {
        setError("Modified answer cannot be empty");
        return;
      }
      await axios.put(`/api/qa/${qaId}`, {
        teacherModifiedAnswer: modifiedAnswer
      });
      setModifiedAnswer("");
      fetchConversations();
    } catch (err) {
      setError("Failed to modify answer");
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teacherQADashboard">
      <h2>Q&A Review Dashboard</h2>
      <div className="qaList">
        {conversations.map((qa) => (
          <div key={qa._id} className="qaItem">
            <div className="qaHeader">
              <span className="student">Student: {qa.studentId.username}</span>
              <span className={`status ${qa.status}`}>Status: {qa.status}</span>
            </div>
            <div className="question">Q: {qa.question}</div>
            <div className="chatbotAnswer">Chatbot A: {qa.chatbotAnswer}</div>
            {qa.teacherModifiedAnswer && (
              <div className="modifiedAnswer">
                Modified A: {qa.teacherModifiedAnswer}
              </div>
            )}
            {qa.status === "pending" && (
              <div className="actions">
                <button 
                  className="approveBtn"
                  onClick={() => handleApprove(qa._id)}
                >
                  Approve Answer
                </button>
                <div className="modifySection">
                  <textarea
                    placeholder="Enter modified answer..."
                    value={modifiedAnswer}
                    onChange={(e) => setModifiedAnswer(e.target.value)}
                  />
                  <button 
                    className="modifyBtn"
                    onClick={() => handleModify(qa._id)}
                  >
                    Submit Modified Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}