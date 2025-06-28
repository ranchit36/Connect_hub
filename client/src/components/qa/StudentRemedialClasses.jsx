import React, { useState, useEffect } from "react";
import {
  getRemedialAssignments,
  submitRemedialSolution,
} from "../../apiCalls";

const StudentRemedialClasses = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [solutionImage, setSolutionImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await getRemedialAssignments();
      setAssignments(res.data);
    } catch (err) {
      setError("Failed to load assignments");
    }
    setLoading(false);
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!solutionImage || !selectedAssignment) {
      setError("Please select an assignment and upload an image");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment);
    formData.append("studentId", studentId);
    formData.append("image", solutionImage);
    try {
      await submitRemedialSolution(formData);
      setSuccess("Solution submitted successfully!");
      setSolutionImage(null);
      setSelectedAssignment(null);
    } catch (err) {
      setError("Failed to submit solution");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Remedial Classes - Student</h2>
      <h3>Assignments</h3>
      {assignments.length === 0 && <div>No assignments yet.</div>}
      <ul>
        {assignments.map((a) => (
          <li key={a._id} style={{ marginBottom: 20 }}>
            <b>{a.title}</b> (Max Marks: {a.maxMarks})<br />
            Teacher: {a.teacherId?.username || "Unknown"}<br />
            {a.description && <span>Description: {a.description}<br /></span>}
            <img
              src={`http://localhost:8800/images/${a.image}`}
              alt="assignment"
              style={{ width: 100, marginTop: 5 }}
            />
            <br />
            <button onClick={() => setSelectedAssignment(a._id)}>
              Upload Solution
            </button>
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <form onSubmit={handleSolutionSubmit} style={{ marginTop: 20 }}>
          <h4>Upload Solution for Assignment</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSolutionImage(e.target.files[0])}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Submit Solution"}
          </button>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && <div style={{ color: "green" }}>{success}</div>}
        </form>
      )}
    </div>
  );
};

export default StudentRemedialClasses; 