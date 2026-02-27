import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/upload-resume/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setMessage("Upload failed");
    }
  };

  return (
    <div className="center-page">
      <div className="card">
        <h2>Upload Resume</h2>

        <input
          type="file"
          accept="application/pdf"
          className="input-field"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="button-primary"
          onClick={uploadResume}
        >
          Submit Resume
        </button>

        <p style={{ marginTop: "20px" }}>{message}</p>
      </div>
    </div>
  );
}

export default Upload;