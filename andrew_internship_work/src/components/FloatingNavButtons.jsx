import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FloatingNavButtons.css";
import bookIcon from "../assets/book.svg";
import gavelIcon from "../assets/gavel.webp";
import calculatorIcon from "../assets/calculator.png";
import settingsIcon from "../assets/settings.png";
import SettingsMenu from "./SettingsMenu";
import EditApplicationsPopup from "./EditApplicationsPopup";
import { setToken } from "../api"; // <-- Import setToken to clear token on logout
import { getSurveyAnswers } from "../api"; // Add this import

export default function FloatingNavButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSettingsClick = () => setShowSettings(true);

  const handleOptions = () => {
    setShowSettings(false);
    navigate("/settings");
  };

  const handleEditSurvey = async () => {
    setShowSettings(false);
    try {
      const answers = await getSurveyAnswers();
      if (Array.isArray(answers) && answers.length === 10 && answers.every(a => a !== null && a !== "")) {
        navigate("/survey?recap=1");
      } else {
        navigate("/survey");
      }
    } catch (e) {
      navigate("/survey");
    }
  };

  const handleEditAssignments = () => {
    setShowSettings(false);
    navigate("/assignments");
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="floating-nav-buttons">
      <button
        className="floating-btn"
        title="Assignments"
        onClick={() => setShowPopup(true)}
      >
        <img src={bookIcon} alt="Assignments" width={32} height={32} />
      </button>
      <button
        className="floating-btn"
        title="Legal"
        onClick={() => navigate("/legal")}
      >
        <img src={gavelIcon} alt="Legal" width={32} height={32} />
      </button>
      <button
        className="floating-btn"
        title="Calculator"
        onClick={() => navigate("/calculator")}
      >
        <img src={calculatorIcon} alt="Calculator" width={32} height={32} />
      </button>
      <button
        className="floating-btn"
        title="Settings"
        onClick={handleSettingsClick}
      >
        <img src={settingsIcon} alt="Settings" width={32} height={32} />
      </button>
      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          onOptions={handleOptions}
          onEditSurvey={handleEditSurvey}
          onEditAssignments={handleEditAssignments}
          onLogout={handleLogout}
        />
      )}
      {showPopup && (
        <EditApplicationsPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}