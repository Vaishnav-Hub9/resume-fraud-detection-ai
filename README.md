# 🛡 ResumeGuard - AI-Based Resume Validation & Fraud Detection

## 🚩 Problem Statement

Recruitment processes increasingly suffer from fraudulent or exaggerated resumes. HR teams face challenges such as:

- Duplicate resume submissions  
- Inflated skill claims  
- Inconsistent employment timelines  
- Missing or unverifiable contact details  
- Overstated project ownership  

Manual screening is time-consuming and error-prone. There is a need for an intelligent, automated system that assists HR teams in identifying suspicious resumes early in the hiring pipeline.

---

## 💡 Proposed Solution

ResumeGuard AI is a **hybrid fraud detection system** that combines deterministic validation techniques with AI-based contextual analysis to evaluate resumes and generate a composite risk score.

The system operates in multiple layers:

### 1️⃣ **Duplicate Detection Layer**
- Uses **SHA-256 hashing** to detect identical resumes  
- Tracks duplicate submission frequency  
- Escalates risk score for repeated submissions  

### 2️⃣ **Structured Data Extraction Layer**
- Extracts email using **regex pattern matching**  
- Extracts phone numbers using the `phonenumbers` library  
- Flags resumes missing verified contact details  

### 3️⃣ **AI-Based Contextual Analysis Layer**
- Integrates a **Large Language Model (LLM)** via API  
- Detects inconsistencies in employment timelines  
- Flags exaggerated or vague skill claims  
- Identifies suspicious project descriptions  
- Returns structured JSON analysis  

### 4️⃣ **Hybrid Risk Scoring Engine**
Combines:
- Duplicate count  
- Missing contact details  
- AI-detected inconsistencies  

Generates:
- **Risk Score (0–100)**  
- **Risk Level (Low / Medium / High)**  

### 5️⃣ **Admin Analytics Dashboard**
- Displays total resume submissions  
- Tracks duplicate counts  
- Visualizes risk distribution using Pie and Bar charts  
- Allows resume PDF download for manual HR review  

---

## 🏗 System Architecture
React Frontend
↓
FastAPI Backend (REST API)
↓
MongoDB Database
↓
LLM API Integration


Each resume passes through validation layers before a final risk score is stored in the database.

---

## ⭐ Key Features

- Duplicate Resume Detection  
- Risk Score Escalation on Repeated Submission  
- Email & Phone Extraction  
- AI-Powered Inconsistency Detection  
- Structured JSON-Based Analysis  
- Interactive Admin Dashboard  
- Resume PDF Download  
- Secure API Key Management via `.env`  

---

## 📊 Risk Scoring Logic

The final risk score is calculated based on:

- Duplicate submission frequency  
- Missing email or phone  
- AI-detected inconsistencies  
- AI-detected suspicious patterns  

### Risk Classification

- **Low Risk:** 0–29  
- **Medium Risk:** 30–59  
- **High Risk:** 60–100  

This hybrid scoring approach improves transparency and avoids over-reliance on generative AI outputs.

---

## 🛠 Technology Stack

### 🔹 Backend
- FastAPI  
- MongoDB Atlas  
- PyMongo  
- pdfplumber  
- phonenumbers  
- hashlib (SHA-256 hashing)  
- Groq API (LLM integration)  
- Uvicorn  

### 🔹 Frontend
- React.js  
- Axios  
- Chart.js  
- Custom CSS  

---

## ⚙️ Setup & Run Instructions

### 🔹 Prerequisites

- Python 3.10+  
- Node.js 18+  
- MongoDB Atlas account  
- Groq API key  
- Git  

---

### 🔹 Step 1 – Clone Repository

```bash
git clone https://github.com/Vaishnav-Hub9/resume-fraud-detection-ai.git
cd resume-fraud-detection-ai


Each resume passes through validation layers before a final risk score is stored in the database.

---

## ⭐ Key Features

- Duplicate Resume Detection  
- Risk Score Escalation on Repeated Submission  
- Email & Phone Extraction  
- AI-Powered Inconsistency Detection  
- Structured JSON-Based Analysis  
- Interactive Admin Dashboard  
- Resume PDF Download  
- Secure API Key Management via `.env`  

---

## 📊 Risk Scoring Logic

The final risk score is calculated based on:

- Duplicate submission frequency  
- Missing email or phone  
- AI-detected inconsistencies  
- AI-detected suspicious patterns  

### Risk Classification

- **Low Risk:** 0–29  
- **Medium Risk:** 30–59  
- **High Risk:** 60–100  

This hybrid scoring approach improves transparency and avoids over-reliance on generative AI outputs.

---

## 🛠 Technology Stack

### 🔹 Backend
- FastAPI  
- MongoDB Atlas  
- PyMongo  
- pdfplumber  
- phonenumbers  
- hashlib (SHA-256 hashing)  
- Groq API (LLM integration)  
- Uvicorn  

### 🔹 Frontend
- React.js  
- Axios  
- Chart.js  
- Custom CSS  

---

## ⚙️ Setup & Run Instructions

### 🔹 Prerequisites

- Python 3.10+  
- Node.js 18+  
- MongoDB Atlas account  
- Groq API key  
- Git  

---

### 🔹 Step 1 – Clone Repository

```bash
git clone https://github.com/username/nameofrepo.git
cd resume-fraud-detection-ai

Run backend server:

uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000

🔹 Step 2 – Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

Create a .env file inside the backend folder:

GROQ_API_KEY=your_api_key_here
MONGO_URL=your_mongodb_connection_string

Run backend server:

uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000
🔹 Step 3 – Frontend Setup
open a new terminal:
cd frontend-react
npm install
npm start

Frontend runs at:

http://localhost:3000
🔐 Admin Credentials

Username: admin

Password: hack2026

🔗 Third-Party Resources & References

FastAPI – https://fastapi.tiangolo.com/

MongoDB Atlas – https://www.mongodb.com/atlas

PyMongo – https://pymongo.readthedocs.io/

pdfplumber – https://github.com/jsvine/pdfplumber

phonenumbers – https://github.com/daviddrysdale/python-phonenumbers

Groq API – https://console.groq.com/docs

React.js – https://react.dev/

Chart.js – https://www.chartjs.org/

Axios – https://axios-http.com/

🛡 Security Measures

API keys stored securely in .env

.env excluded from version control via .gitignore

Duplicate detection via SHA-256 hashing

Controlled CORS configuration

Resume files stored locally with path reference

🚀 Future Enhancements

Role-based authentication

Timeline anomaly detection

ATS integration

Cloud deployment

Advanced NLP-based pattern detection

👥 Team Members

Vaishnav – Backend Development & AI Integration

[P.Sai theja reddy] – Frontend & Dashboard Development

[Avaneesh and Raghava] – Architecture & Risk Modeling
