import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "hack2026";

  const login = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuth(true);
      fetchResumes();
    } else {
      alert("Invalid Credentials");
    }
  };

  const fetchResumes = async () => {
    const res = await axios.get("http://127.0.0.1:8000/all-resumes");
    setResumes(res.data);
  };

  const viewResume = async (id) => {
    const res = await axios.get(`http://127.0.0.1:8000/resume/${id}`);
    setSelected(res.data);
  };

  const parseLLM = (analysis) => {
    try {
      const cleaned = analysis.replace(/```json|```/g, "");
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  };

  // ===== AUTH SCREEN =====
  if (!isAuth) {
    return (
      <div className="center-page">
        <div className="card">
          <h2>Admin Login</h2>

          <input
            className="input-field"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="input-field"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button-primary" onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // ===== STATS =====

  const total = resumes.length;
  const high = resumes.filter(r => r.risk_level === "High").length;
  const medium = resumes.filter(r => r.risk_level === "Medium").length;
  const low = resumes.filter(r => r.risk_level === "Low").length;

  const duplicateTotal = resumes.reduce(
    (sum, r) => sum + (r.duplicate_count || 0),
    0
  );

  const pieData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      data: [high, medium, low],
      backgroundColor: ["#ef4444", "#facc15", "#22c55e"]
    }]
  };

  const barData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      label: "Risk Count",
      data: [high, medium, low],
      backgroundColor: ["#ef4444", "#facc15", "#22c55e"]
    }]
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* ===== TABLE ===== */}
      <div className="stat-card">
        <h3>Resume Records</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Risk</th>
              <th>Score</th>
              <th>Duplicates</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {resumes.map((r) => (
              <tr key={r._id}>
                <td>{r.filename}</td>
                <td>{r.risk_level}</td>
                <td>{r.risk_score}</td>
                <td>{r.duplicate_count}</td>
                <td>
                  <button
                    className="button-primary small-btn"
                    onClick={() => viewResume(r._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== DETAILS BELOW TABLE ===== */}
      {selected && (
        <div className="stat-card" style={{ marginTop: "40px" }}>
          <h2>{selected.filename}</h2>

          <p><b>Email:</b> {selected.email || "Not Found"}</p>
          <p><b>Phone:</b> {selected.phone || "Not Found"}</p>
          <p><b>Risk Score:</b> {selected.risk_score}</p>
          <p><b>Risk Level:</b> {selected.risk_level}</p>
          <p><b>Duplicate Count:</b> {selected.duplicate_count}</p>

          <h3>AI Analysis</h3>

          {parseLLM(selected.llm_analysis) ? (
            <>
              <h4>Inconsistencies</h4>
              <ul>
                {parseLLM(selected.llm_analysis).inconsistencies.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>Suspicious Patterns</h4>
              <ul>
                {parseLLM(selected.llm_analysis).suspicious_patterns.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>Summary</h4>
              <p>{parseLLM(selected.llm_analysis).summary}</p>
            </>
          ) : (
            <pre>{selected.llm_analysis}</pre>
          )}

          <br />

          <a
            href={`http://127.0.0.1:8000/download/${selected._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary"
          >
            Download PDF
          </a>
        </div>
      )}

      {/* ===== ANALYTICS ===== */}
      <div style={{ marginTop: "60px" }}>
        <h2>Analytics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Resumes</h3>
            <p>{total}</p>
          </div>

          <div className="stat-card">
            <h3>Total Duplicates</h3>
            <p>{duplicateTotal}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "50px", marginTop: "40px" }}>
          <div style={{ width: "400px" }}>
            <Pie data={pieData} />
          </div>

          <div style={{ width: "500px" }}>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;