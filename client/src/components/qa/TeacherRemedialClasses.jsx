import React, { useState, useEffect } from "react";
import {
  createRemedialAssignment,
  getRemedialAssignments,
  getRemedialSubmissions,
  assignRemedialMarks,
  uploadRemedialReview,
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
  
  // Review states
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewFile, setReviewFile] = useState(null);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText && !reviewFile) {
      setError("❌ Please provide either review text or upload a review file");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData();
    formData.append("reviewText", reviewText);
    formData.append("teacherId", teacherId);
    if (reviewFile) {
      formData.append("reviewFile", reviewFile);
    }
    
    try {
      await uploadRemedialReview(selectedSubmission, formData);
      setSuccess("✅ Review uploaded successfully!");
      setReviewText("");
      setReviewFile(null);
      setSelectedSubmission(null);
      handleViewSubmissions(selectedAssignment);
    } catch (err) {
      setError("❌ Failed to upload review");
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

  const renderReviewPreview = (file, fileType) => {
    if (fileType === 'image') {
      return (
        <img
          src={`http://localhost:8800/images/${file}`}
          alt="review"
          style={{ width: 80, marginTop: 5 }}
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
              padding: '6px 10px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            📄 View Review
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
                  <strong>Submitted:</strong> {new Date(s.createdAt).toLocaleDateString()}
                  {s.updatedAt && s.updatedAt !== s.createdAt && (
                    <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                      {" "}(Resubmitted: {new Date(s.updatedAt).toLocaleDateString()})
                    </span>
                  )}
                  <br />
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
                  <br />
                  <button 
                    onClick={() => setSelectedSubmission(s._id)}
                    style={{ marginTop: '10px', backgroundColor: '#28a745' }}
                  >
                    📝 Add Review
                  </button>
                  
                  {/* Show existing review if available */}
                  {s.reviewText && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <strong>Review:</strong> {s.reviewText}
                      {s.reviewFile && renderReviewPreview(s.reviewFile, s.reviewFileType)}
                      <br />
                      <small style={{ color: '#666' }}>
                        Reviewed on: {new Date(s.reviewDate).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Upload Form */}
      {selectedSubmission && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h4>Upload Review for Submission</h4>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              placeholder="Enter review text/feedback..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ 
                width: '100%', 
                minHeight: '100px', 
                padding: '10px', 
                marginBottom: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv"
              onChange={(e) => setReviewFile(e.target.files[0])}
              style={{ marginBottom: '10px' }}
            />
            <small style={{ color: '#666', display: 'block', marginBottom: '10px' }}>
              Accepted formats: Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX, TXT, CSV)
            </small>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading}>
                {loading ? "📤 Uploading..." : "📝 Upload Review"}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setSelectedSubmission(null);
                  setReviewText("");
                  setReviewFile(null);
                }}
                style={{ backgroundColor: '#6c757d' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherRemedialClasses; 