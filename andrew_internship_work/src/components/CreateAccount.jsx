import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { register } from "../api"; // <-- Import your API register function
import { saveSurveyAnswers, getToken } from "../api";

const LOCAL_STORAGE_KEY = "guestSurveyAnswers";

export default function CreateAccount({ setLoggedIn }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  // Redirect if already authenticated (e.g., token exists)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill out all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      console.log("[DEBUG] Registration form data:", form);
      // Call backend API to register
      let res;
      try {
        res = await register({
          name: form.name,
          email: form.email,
          password: form.password
        });
      } catch (err) {
        // Clear any stale token on error
        localStorage.removeItem("token");
        // Show backend error message if available
        setError(err.message || "Registration failed.");
        return;
      }
      // Save survey answers if present
      const guestAnswers = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (guestAnswers) {
        await saveSurveyAnswers(JSON.parse(guestAnswers));
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      // Set token and mark as logged in
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        setLoggedIn(true);
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="create-account-root">
      <form className="create-account-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}