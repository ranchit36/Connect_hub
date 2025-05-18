import { useState, useEffect } from "react";
import axios from "axios";
import "./teacherQADashboard.css";

export default function StudentQAView() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQAHistory();
  }, []);

  const fetchQAHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/qa");
      // Filter only approved or modified Q&As
      const approvedQAs = res.data.conversations.filter(
        qa => qa.status === "approved" || qa.status === "modified"
      );
      setConversations(approvedQAs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Q&A history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="studentQAView">
      <h2>Q&A History</h2>
      <div className="qaList">
        {conversations.map((qa) => (
          <div key={qa._id} className="qaItem">
            <div className="question">Q: {qa.question}</div>
            {qa.status === "approved" ? (
              <div className="chatbotAnswer">A: {qa.chatbotAnswer}</div>
            ) : (
              <div className="modifiedAnswer">A: {qa.teacherModifiedAnswer}</div>
            )}
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="noQA">No approved Q&A conversations yet.</div>
        )}
      </div>
    </div>
  );
}