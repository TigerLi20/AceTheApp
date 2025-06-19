import React from "react";
import "./SettingsMenu.css";

export default function SettingsMenu({ onClose, onOptions, onEditSurvey, onLogout, onEditAssignments }) {
  return (
    <div className="settings-menu-overlay" onClick={onClose}>
      <div className="settings-menu" onClick={e => e.stopPropagation()}>
        <button className="settings-menu-btn" onClick={onOptions}>
          Options
        </button>
        <button className="settings-menu-btn" onClick={onEditSurvey}>
          Edit Survey Responses
        </button>
        <button
          className="settings-menu-btn"
          onClick={onEditAssignments}
        >
          Edit Assignment Questions
        </button>
        <button className="settings-menu-btn" onClick={onLogout}>
          Log Out
        </button>
        <button className="settings-menu-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}