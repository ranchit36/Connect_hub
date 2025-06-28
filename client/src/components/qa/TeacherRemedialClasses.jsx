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
  const [image, setImage] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!title || !maxMarks || !image) {
      setError("Title, max marks, and image are required");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("maxMarks", maxMarks);
    formData.append("teacherId", teacherId);
    formData.append("image", image);
    try {
      await createRemedialAssignment(formData);
      setTitle("");
      setDescription("");
      setMaxMarks("");
      setImage(null);
      fetchAssignments();
    } catch (err) {
      setError("Failed to create assignment");
    }
    setLoading(false);
  };

  const handleViewSubmissions = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setLoading(true);
    try {
      const res = await getRemedialSubmissions(assignmentId);
      setSubmissions(res.data);
    } catch (err) {
      setError("Failed to load submissions");
    }
    setLoading(false);
  };

  const handleAssignMarks = async (submissionId, marks) => {
    setLoading(true);
    try {
      await assignRemedialMarks(submissionId, marks);
      handleViewSubmissions(selectedAssignment);
    } catch (err) {
      setError("Failed to assign marks");
    }
    setLoading(false);
  };

  return (
    <div className="remedial-container">
      <h2>Remedial Classes - Teacher</h2>
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
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Assignment"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>

      <h3>All Assignments</h3>
      {assignments.length === 0 && <div>No assignments yet.</div>}
      <ul className="remedial-assignments-list">
        {assignments.map((a) => (
          <li key={a._id} className="remedial-assignment-card">
            <div>
              <b>{a.title}</b> (Max Marks: {a.maxMarks})
              <button onClick={() => handleViewSubmissions(a._id)} style={{ marginLeft: 10 }}>
                View Submissions
              </button>
              <br />
              <img
                src={`http://localhost:8800/images/${a.image}`}
                alt="assignment"
                style={{ width: 100, marginTop: 5 }}
              />
            </div>
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <div style={{ marginTop: 30 }}>
          <h4>Submissions for Assignment</h4>
          {submissions.length === 0 && <div>No submissions yet.</div>}
          <ul className="remedial-submissions-list">
            {submissions.map((s) => (
              <li key={s._id} className="remedial-submission-card">
                <div>
                  Student: {s.studentId?.username || "Unknown"} <br />
                  <img
                    src={`http://localhost:8800/images/${s.image}`}
                    alt="submission"
                    style={{ width: 80, marginTop: 5 }}
                  />
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