import React, { useState, useEffect } from "react";
import {
  getRemedialAssignments,
  submitRemedialSolution,
} from "../../apiCalls";

const StudentRemedialClasses = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAssignments();
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

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await getRemedialAssignments();
      setAssignments(res.data);
      if (res.data.length > 0) {
        setSuccess(`📚 Loaded ${res.data.length} assignment(s) available`);
      }
    } catch (err) {
      setError("❌ Failed to load assignments");
    }
    setLoading(false);
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!solutionFile || !selectedAssignment) {
      setError("❌ Please select an assignment and upload a file");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment);
    formData.append("studentId", studentId);
    formData.append("file", solutionFile);
    try {
      await submitRemedialSolution(formData);
      setSuccess("✅ Solution submitted successfully!");
      setSolutionFile(null);
      setSelectedAssignment(null);
    } catch (err) {
      setError("❌ Failed to submit solution");
    }
    setLoading(false);
  };

  const renderFilePreview = (file, fileType) => {
    if (fileType === 'image') {
      return (
        <img
          src={`http://localhost:8800/images/${file}`}
          alt="assignment"
          style={{ width: 100, marginTop: 5 }}
        />
      );
    } else {
      return (
        <div style={{ marginTop: 5 }}>
          <a 
            href={`http://localhost:8800/documents/${file}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', 
              padding: '8px 12px', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            📄 View Document
          </a>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Remedial Classes - Student</h2>
      
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

      <h3>Assignments</h3>
      {assignments.length === 0 && <div>No assignments yet.</div>}
      <ul>
        {assignments.map((a) => (
          <li key={a._id} style={{ marginBottom: 20 }}>
            <b>{a.title}</b> (Max Marks: {a.maxMarks})<br />
            Teacher: {a.teacherId?.username || "Unknown"}<br />
            {a.description && <span>Description: {a.description}<br /></span>}
            {renderFilePreview(a.file, a.fileType)}
            <br />
            <button onClick={() => setSelectedAssignment(a._id)}>
              📤 Upload Solution
            </button>
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <form onSubmit={handleSolutionSubmit} style={{ marginTop: 20 }}>
          <h4>Upload Solution for Assignment</h4>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv"
            onChange={(e) => setSolutionFile(e.target.files[0])}
            required
          />
          <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
            Accepted formats: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX, TXT, CSV)
          </small>
          <button type="submit" disabled={loading}>
            {loading ? "📤 Uploading..." : "📝 Submit Solution"}
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentRemedialClasses; 