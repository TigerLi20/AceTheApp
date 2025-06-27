<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import "./TopCollegesButton.css";
import { useNavigate } from "react-router-dom";
import { getUsaMapClickedChain } from "../api";

export default function TopCollegesButton() {
  const navigate = useNavigate();
  const [clickedChain, setClickedChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsaMapClickedChain()
      .then(setClickedChain)
      .catch(() => setClickedChain([]))
      .finally(() => setLoading(false));
  }, []);

=======
import React from "react";
import "./TopCollegesButton.css";
import { useNavigate } from "react-router-dom";

export default function TopCollegesButton() {
  const navigate = useNavigate();
  // Read the clicked chain from localStorage
  const clickedChain = JSON.parse(localStorage.getItem('usaMapClickedChain') || '[]');
>>>>>>> main
  const isEnabled = Array.isArray(clickedChain) && clickedChain.length >= 3;

  return (
    <div className="button-group-centered">
      <button
        className="top-colleges-btn"
        onClick={() => isEnabled && navigate("/top-colleges")}
<<<<<<< HEAD
        disabled={!isEnabled || loading}
=======
        disabled={!isEnabled}
>>>>>>> main
      >
        Top Colleges
      </button>
    </div>
  );
}