import React, { useState, useEffect } from "react";
import {
  createRemedialAssignment,
  getRemedialAssignments,
  getRemedialSubmissions,
  assignRemedialMarks,
} from "../../apiCalls";
import "./teacherRemedial.css";

const TeacherRemedialClasses = ({ teacherId }) => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [file, setFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
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
    try {
      const res = await getRemedialAssignments();
      setAssignments(res.data);
    } catch (err) {
      setError("Failed to load assignments");
    }
    setLoading(false);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!title || !maxMarks || !file) {
      setError("Title, max marks, and file are required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("maxMarks", maxMarks);
    formData.append("teacherId", teacherId);
    formData.append("file", file);
    try {
      await createRemedialAssignment(formData);
      setSuccess("✅ Assignment posted successfully!");
      setTitle("");
      setDescription("");
      setMaxMarks("");
      setFile(null);
      fetchAssignments();
    } catch (err) {
      setError("❌ Failed to create assignment");
    }
    setLoading(false);
  };

  const handleViewSubmissions = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await getRemedialSubmissions(assignmentId);
      setSubmissions(res.data);
      setSuccess(`📋 Loaded ${res.data.length} submission(s) for this assignment`);
    } catch (err) {
      setError("❌ Failed to load submissions");
    }
    setLoading(false);
  };

  const handleAssignMarks = async (submissionId, marks) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await assignRemedialMarks(submissionId, marks);
      setSuccess(`🎯 Marks awarded: ${marks} points`);
      handleViewSubmissions(selectedAssignment);
    } catch (err) {
      setError("❌ Failed to assign marks");
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
    <div className="remedial-container">
      <h2>Remedial Classes - Teacher</h2>
      
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

      <form className="remedial-form" onSubmit={handleAssignmentSubmit} style={{ marginBottom: 20 }}>
        <h3>Post New Assignment</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Marks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt,.csv"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
          Accepted formats: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX, TXT, CSV)
        </small>
        <button type="submit" disabled={loading}>
          {loading ? "📤 Posting..." : "📝 Post Assignment"}
        </button>
      </form>

      <h3>All Assignments</h3>
      {assignments.length === 0 && <div>No assignments yet.</div>}
      <ul className="remedial-assignments-list">
        {assignments.map((a) => (
          <li key={a._id} className="remedial-assignment-card">
            <div>
              <b>{a.title}</b> (Max Marks: {a.maxMarks})
              <button onClick={() => handleViewSubmissions(a._id)} style={{ marginLeft: 10 }}>
                👁️ View Submissions
              </button>
              <br />
              {renderFilePreview(a.file, a.fileType)}
            </div>
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <div>
          <h4>Submissions for Assignment</h4>
          {submissions.length === 0 && <div>No submissions yet.</div>}
          <ul className="remedial-submissions-list">
            {submissions.map((s) => (
              <li key={s._id} className="remedial-submission-card">
                <div>
                  Student: {s.studentId?.username || "Unknown"} <br />
                  {renderFilePreview(s.file, s.fileType)}
                  <br />
                  Marks Awarded: {s.marksAwarded !== null ? s.marksAwarded : "Not graded"}
                  <br />
                  <input
                    type="number"
                    placeholder="Assign Marks"
                    min="0"
                    max={assignments.find((a) => a._id === selectedAssignment)?.maxMarks || 100}
                    onBlur={(e) => {
                      if (e.target.value) handleAssignMarks(s._id, Number(e.target.value));
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeacherRemedialClasses; 