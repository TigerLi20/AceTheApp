const API_URL = "http://localhost:5000/api";

let jwt = null; // Store JWT in memory

export function setToken(token) {
  jwt = token;
  // Optionally persist in localStorage for persistent login
  // localStorage.setItem("jwt", token);
}

export function getToken() {
  // Optionally retrieve from localStorage
  // if (!jwt) jwt = localStorage.getItem("jwt");
  return jwt;
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function getProfile() {
  const res = await fetch(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveCollegeDoc(collegeId, docUrl) {
  const res = await fetch(`${API_URL}/profile/college-doc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ collegeId, docUrl }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCollegeDocs() {
  const res = await fetch(`${API_URL}/profile/college-docs`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}