import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">

      <h1>AI Resume Fraud Detection System</h1>

      <p>
        Detect duplicate resumes, analyze inconsistencies using AI,
        and generate intelligent risk scores to secure hiring pipelines.
      </p>

      <div style={{ marginTop: "40px" }}>
        <button
          className="button-primary"
          onClick={() => navigate("/upload")}
        >
          Upload Resume
        </button>
      </div>

      {/* ===== HOW IT WORKS CARDS ===== */}

      <div className="features">
        <div className="feature-card">
          <h3>1️⃣ Duplicate Detection</h3>
          <p>
            We generate a unique SHA-256 hash of the resume content to
            detect identical submissions and track duplicate frequency.
          </p>
        </div>

        <div className="feature-card">
          <h3>2️⃣ AI Inconsistency Analysis</h3>
          <p>
            Our LLM analyzes timelines, exaggerated claims,
            vague certifications, and suspicious patterns.
          </p>
        </div>

        <div className="feature-card">
          <h3>3️⃣ Hybrid Risk Scoring</h3>
          <p>
            A combined score is generated based on duplicates,
            missing contact info, and AI-detected inconsistencies.
          </p>
        </div>
      </div>

      {/* ===== RULES SECTION ===== */}

      <div className="rules-section">
        <h2>Before Uploading Your Resume</h2>

        <ul>
          <li>✔ Include verified contact details</li>
          <li>✔ Avoid inconsistent employment timelines</li>
          <li>✔ Mention clear project ownership</li>
          <li>✔ Avoid exaggerated skill claims</li>
          <li>✔ Keep structured education & experience sections</li>
        </ul>
      </div>

    </div>
  );
}

export default Home;