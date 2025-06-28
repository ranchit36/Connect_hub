import React, { useEffect, useState } from "react";
import { getRemedialReport } from "../../apiCalls";
import "./teacherRemedial.css";

const TeacherRemedialReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRemedialReport();
      setReport(res.data);
    } catch (err) {
      setError("Failed to load report");
    }
    setLoading(false);
  };

  return (
    <div className="remedial-container">
      <h2>Remedial Report</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
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