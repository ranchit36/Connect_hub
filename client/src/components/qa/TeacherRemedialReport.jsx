import React, { useEffect, useState } from "react";
import { getRemedialReport } from "../../apiCalls";
import "./teacherRemedial.css";

const TeacherRemedialReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  // Auto-dismiss flash messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await getRemedialReport();
      setReport(res.data);
      if (res.data.length > 0) {
        setSuccess(`📊 Report loaded: ${res.data.length} student(s) found`);
      }
    } catch (err) {
      setError("❌ Failed to load report");
    }
    setLoading(false);
  };

  return (
    <div className="remedial-container">
      <h2>Remedial Report</h2>
      
      {/* Flash Messages */}
      {success && (
        <div className="flash-message success">
          <span>✅</span>
          {success}
        </div>
      )}
      
      {error && (
        <div className="flash-message error">
          <span>❌</span>
          {error}
        </div>
      )}

      {loading && <div>📊 Loading report...</div>}
      {report.length === 0 && !loading && <div>No data available.</div>}
      {report.length > 0 && (
        <table className="remedial-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Total Marks</th>
              <th>Percentage</th>
              <th>Performance</th>
              <th>Total Assignments</th>
              <th>Assignments Submitted</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r, idx) => (
              <tr key={idx}>
                <td>{r.student}</td>
                <td>{r.email}</td>
                <td>{r.totalMarks}</td>
                <td>{r.percent}%</td>
                <td className={
                  r.performance === "Excellent" ? "remedial-status-excellent" :
                  r.performance === "Good" ? "remedial-status-good" :
                  r.performance === "Average" ? "remedial-status-average" :
                  r.performance === "Below Average" ? "remedial-status-below" :
                  "remedial-status-poor"
                }>{r.performance}</td>
                <td>{r.totalAssignments}</td>
                <td>{r.assignmentsSubmitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherRemedialReport; 