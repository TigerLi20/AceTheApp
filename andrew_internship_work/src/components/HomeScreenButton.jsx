import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home.png";
import "./HomeScreenButton.css";

export default function HomeScreenButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const registered = localStorage.getItem("registered") === "1";
    if (registered) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <button
      className="home-screen-btn"
      title="Go Home"
      onClick={handleClick}
    >
      <img src={homeIcon} alt="Home" width={40} height={40} />
    </button>
  );
}