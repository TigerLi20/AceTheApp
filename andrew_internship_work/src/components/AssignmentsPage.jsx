import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoPage.css";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    // Load from localStorage if present
    const saved = localStorage.getItem("assignmentAnswers");
    return saved ? JSON.parse(saved) : { q1: "", q2: "", q3: "", q4: "" };
  });

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("assignmentAnswers", JSON.stringify(answers));
  }, [answers]);

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    localStorage.setItem("assignmentAnswers", JSON.stringify(answers));
    navigate("/video");
  };

  return (
    <div className="video-page-bg">
      <div className="video-page-content">
        <h2 className="video-page-title">Assignments & Questions</h2>
        <form style={{ textAlign: "left", fontSize: "1.1rem", marginBottom: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label>
              1. What is the main topic of the video?
              <br />
              <input
                type="text"
                name="q1"
                value={answers.q1}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 6, border: "1px solid #bbb" }}
                placeholder="Type your answer here"
              />
            </label>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>
              2. What is the correct answer?
              <br />
              <select
                name="q2"
                value={answers.q2}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 6, border: "1px solid #bbb" }}
              >
                <option value="">Select an option</option>
                <option value="A">A. The video is about college admissions</option>
                <option value="B">B. The video is about cooking</option>
                <option value="C">C. The video is about traveling</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>
              3. List two things you learned from the video:
              <br />
              <textarea
                name="q3"
                value={answers.q3}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 6, border: "1px solid #bbb", minHeight: 60 }}
                placeholder="Type your answer here"
              />
            </label>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>
              4. How could you apply this information in real life?
              <br />
              <select
                name="q4"
                value={answers.q4}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 6, border: "1px solid #bbb" }}
              >
                <option value="">Select an option</option>
                <option value="A">A. Use it for my college applications</option>
                <option value="B">B. Share it with friends</option>
                <option value="C">C. Ignore it</option>
              </select>
            </label>
          </div>
        </form>
        <button
          className="next-btn"
          onClick={handleNext}
        >
          Next College &rarr;
        </button>
      </div>
    </div>
  );
}