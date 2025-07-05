import React, { useState, useEffect } from "react";
import {
  getRemedialAssignments,
  submitRemedialSolution,
  getStudentSubmissions,
} from "../../apiCalls";

const StudentRemedialClasses = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mySubmissions, setMySubmissions] = useState([]);

  useEffect(() => {
    fetchAssignments();
    if (studentId) {
      fetchMySubmissions();
    }
  }, [studentId]);

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

  const fetchMySubmissions = async () => {
    try {
      console.log("Fetching submissions for studentId:", studentId);
      const res = await getStudentSubmissions(studentId);
      console.log("Submissions response:", res.data);
      setMySubmissions(res.data);
      if (res.data.length > 0) {
        setSuccess(`📋 Loaded ${res.data.length} submission(s)`);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError("❌ Failed to load submissions");
    }
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
      const response = await submitRemedialSolution(formData);
      setSuccess(`✅ ${response.data.message}`);
      setSolutionFile(null);
      setSelectedAssignment(null);
      fetchMySubmissions(); // Refresh submissions after submitting
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

      <h3>Available Assignments</h3>
      {assignments.length === 0 && <div>No assignments yet.</div>}
      <ul>
        {assignments.map((a) => (
          <li key={a._id} style={{ marginBottom: 20, padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
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
        <form onSubmit={handleSolutionSubmit} style={{ marginTop: 20, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '4px',
            border: '1px solid #bbdefb'
          }}>
            <small style={{ color: '#1976d2' }}>
              💡 <strong>Note:</strong> If you've already submitted this assignment, your new submission will replace the previous one. 
              Any existing teacher reviews and feedback will be preserved.
            </small>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "📤 Uploading..." : "📝 Submit Solution"}
          </button>
        </form>
      )}

      <h3 style={{ marginTop: '40px' }}>My Submissions & Reviews</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span>Your submitted assignments and teacher feedback</span>
        <button 
          onClick={fetchMySubmissions}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      {mySubmissions.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            📋 You haven't submitted any assignments yet. Submit a solution to see it here along with teacher reviews.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {mySubmissions.map((submission) => (
            <div key={submission._id} style={{ 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h4>📝 {submission.assignmentId?.title || 'Assignment'}</h4>
              <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
              {submission.updatedAt && submission.updatedAt !== submission.createdAt && (
                <p><strong>Resubmitted:</strong> {new Date(submission.updatedAt).toLocaleDateString()}</p>
              )}
              
              <div style={{ marginTop: '15px' }}>
                <strong>Your Submission:</strong>
                {renderFilePreview(submission.file, submission.fileType)}
              </div>

              {/* Show teacher review if available */}
              {submission.reviewText && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <h5 style={{ color: '#28a745', marginBottom: '10px' }}>📋 Teacher Review</h5>
                  <p style={{ marginBottom: '10px' }}>{submission.reviewText}</p>
                  {submission.reviewFile && renderReviewPreview(submission.reviewFile, submission.reviewFileType)}
                  <small style={{ color: '#666' }}>
                    Reviewed by: {submission.reviewedBy?.username || 'Teacher'} on {new Date(submission.reviewDate).toLocaleDateString()}
                  </small>
                </div>
              )}

              {!submission.reviewText && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '4px',
                  border: '1px solid #ffeaa7'
                }}>
                  <small style={{ color: '#856404' }}>
                    ⏳ Teacher review pending...
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRemedialClasses; 