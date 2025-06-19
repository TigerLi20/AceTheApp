import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  // Redirect if already registered
  useEffect(() => {
    if (localStorage.getItem("registered") === "1") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill out all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Save user info (for demo, use localStorage)
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    );
    // Mark as registered
    localStorage.setItem("registered", "1");
    localStorage.removeItem("usaMapClickedChain");
    // Go to home page (map)
    navigate("/home");
  };

  return (
    <div className="create-account-outer">
      <form className="create-account-box" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {error && <div className="create-account-error">{error}</div>}
        <button type="submit" className="create-account-btn">
          Create Account
        </button>
      </form>
    </div>
  );
}