import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SurveyPage.css";

const QUESTIONS = [
  "How likely are you to thrive in a highly competitive academic environment?",
  "How likely are you to enjoy small, discussion-based classes?",
  "How likely are you to be self-directed in your learning?",
  "How likely are you to want a strong sense of campus community?",
  "How likely are you to prefer a politically active student body?",
  "How likely are you to want to attend college in a major city?",
  "How likely are you to live on campus for all four years?",
  "How likely are you to participate actively in extracurricular clubs or student organizations?",
  "How likely are you to prioritize job placement or salary after graduation?",
  "How likely are you to feel most comfortable at a college with a diverse range of identities and perspectives?"
];

const OPTIONS = [
  "Very Unlikely",
  "Unlikely",
  "Neutral",
  "Likely",
  "Very Likely"
];

export default function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load answers from localStorage if available
  const [answers, setAnswers] = useState(() => {
    const stored = localStorage.getItem("surveyAnswers");
    return stored ? JSON.parse(stored) : Array(QUESTIONS.length).fill(null);
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [recap, setRecap] = useState(false);

  // If ?recap=1 is in the URL and answers exist, show recap immediately
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      params.get("recap") === "1" &&
      Array.isArray(answers) &&
      answers.length === QUESTIONS.length &&
      answers.every(a => a !== null)
    ) {
      setRecap(true);
    }
  }, [location.search, answers]);

  const handleNext = () => {
    if (selected === null) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    localStorage.setItem("surveyAnswers", JSON.stringify(updated));
    setSelected(null);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setRecap(true);
    }
  };

  const handleConfirm = () => {
    navigate("/create-account");
  };

  if (recap) {
    return (
      <div className="survey-outer">
        <div className="survey-box survey-recap">
          <div className="survey-title">Recap: Your Answers</div>
          <ol className="survey-list">
            {QUESTIONS.map((q, idx) => (
              <li key={q} className="survey-list-item">
                <div className="survey-question">{q}</div>
                <div className="survey-recap-row">
                  <span className="survey-answer">
                    {answers[idx] !== null ? OPTIONS[answers[idx]] : <span style={{ color: "#c00" }}>No answer</span>}
                  </span>
                  <select
                    value={answers[idx] !== null ? answers[idx] : ""}
                    onChange={e => {
                      const updated = [...answers];
                      updated[idx] = Number(e.target.value);
                      setAnswers(updated);
                      localStorage.setItem("surveyAnswers", JSON.stringify(updated));
                    }}
                    className="survey-dropdown"
                  >
                    <option value="" disabled>Change answer...</option>
                    {OPTIONS.map((option, optionIdx) => (
                      <option key={option} value={optionIdx}>{option}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ol>
          <button
            onClick={handleConfirm}
            className="survey-confirm-btn"
            onMouseOver={e => e.currentTarget.style.background = "#274060"}
            onMouseOut={e => e.currentTarget.style.background = "#415a77"}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  // Normal survey mode
  return (
    <div className="survey-outer">
      <div className="survey-box">
        <div className="survey-question-main">
          {QUESTIONS[current]}
        </div>
        <div className="survey-options-row">
          {OPTIONS.map((option, idx) => (
            <button
              key={option}
              onClick={() => setSelected(idx)}
              className={`survey-option-btn${selected === idx ? " selected" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
        {selected !== null && (
          <div className="survey-next-row">
            <span>
              You selected: <b>{OPTIONS[selected]}</b>
            </span>
            <button
              onClick={handleNext}
              className="survey-next-btn"
              onMouseOver={e => e.currentTarget.style.background = "#e0e7ef"}
              onMouseOut={e => e.currentTarget.style.background = "#f7fafc"}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}