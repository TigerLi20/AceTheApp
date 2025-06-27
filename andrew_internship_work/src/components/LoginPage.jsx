import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { login } from "../api"; // <-- Import your API login function
import { useCollegeList } from "./CollegeProvider";

export default function LoginPage({ setLoggedIn }) {
  const navigate = useNavigate();
  const { refreshColleges } = useCollegeList();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call backend API to log in
      await login({ email: form.email, password: form.password });
      // login() in api.js should set the token in localStorage
      setLoggedIn(true);
      await refreshColleges(); // Ensure college list is loaded after login
      navigate("/home");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}