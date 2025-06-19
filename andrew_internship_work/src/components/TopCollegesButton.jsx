import React from "react";
import "./TopCollegesButton.css";
import { useNavigate } from "react-router-dom";

export default function TopCollegesButton() {
  const navigate = useNavigate();
  // Read the clicked chain from localStorage
  const clickedChain = JSON.parse(localStorage.getItem('usaMapClickedChain') || '[]');
  const isEnabled = Array.isArray(clickedChain) && clickedChain.length >= 3;

  return (
    <div className="button-group-centered">
      <button
        className="top-colleges-btn"
        onClick={() => isEnabled && navigate("/top-colleges")}
        disabled={!isEnabled}
      >
        Top Colleges
      </button>
    </div>
  );
}