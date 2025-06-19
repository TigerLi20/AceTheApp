import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      !user ||
      user.email !== form.email ||
      user.password !== form.password
    ) {
      setError("Invalid email or password.");
      return;
    }
    localStorage.setItem("registered", "1");
    navigate("/home");
  };

  return (
    <div className="create-account-outer">
      <form className="create-account-box" onSubmit={handleSubmit}>
        <h2>Log In</h2>
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
          autoComplete="current-password"
        />
        {error && <div className="create-account-error">{error}</div>}
        <button type="submit" className="create-account-btn">
          Log In
        </button>
      </form>
    </div>
  );
}