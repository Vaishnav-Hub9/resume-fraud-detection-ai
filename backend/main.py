from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io
import re
import phonenumbers
import os
import hashlib
from dotenv import load_dotenv
from groq import Groq
from pymongo import MongoClient
from bson import ObjectId

# -------------------------
# App Setup
# -------------------------

app = FastAPI()

# 🔥 VERY IMPORTANT — Allow all origins for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# -------------------------
# External Services
# -------------------------

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

mongo_client = MongoClient(os.getenv("MONGO_URL"))
db = mongo_client["resume_fraud_db"]
collection = db["resumes"]

print("Mongo Connected Successfully")

# -------------------------
# Utility Functions
# -------------------------

def extract_email(text):
    pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    match = re.findall(pattern, text)
    return match[0] if match else None


def extract_phone(text):
    for match in phonenumbers.PhoneNumberMatcher(text, "IN"):
        return phonenumbers.format_number(
            match.number,
            phonenumbers.PhoneNumberFormat.E164
        )
    return None


def check_resume_consistency(text):
    try:
        prompt = f"""
Analyze this resume for inconsistencies or suspicious patterns.

Return STRICT JSON:
{{
  "inconsistencies": [],
  "suspicious_patterns": [],
  "summary": ""
}}

Resume:
{text[:1500]}
"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a resume fraud detection assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        return response.choices[0].message.content

    except Exception as e:
        print("LLM ERROR:", e)
        return ""


def calculate_risk_score(duplicate_count, email, phone, llm_output):
    score = 0

    # Duplicate escalation (max 30)
    score += min(duplicate_count * 10, 30)

    # Missing contact
    if not email:
        score += 10
    if not phone:
        score += 10

    # AI flags
    if llm_output:
        if "inconsistencies" in llm_output.lower():
            score += 20
        if "suspicious" in llm_output.lower():
            score += 20

    return min(score, 100)

# -------------------------
# Upload Endpoint
# -------------------------

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            return JSONResponse({"error": "Only PDF files allowed"}, status_code=400)

        contents = await file.read()

        # Extract text safely
        text = ""
        try:
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print("PDF Extraction Error:", e)

        # Save PDF
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)

        unique_filename = hashlib.sha256(contents).hexdigest() + ".pdf"
        file_path = os.path.join(upload_folder, unique_filename)

        with open(file_path, "wb") as f:
            f.write(contents)

        # Duplicate detection using text hash
        resume_hash = hashlib.sha256(text.encode()).hexdigest()
        existing_resume = collection.find_one({"hash": resume_hash})

        if existing_resume:
            collection.update_one(
                {"_id": existing_resume["_id"]},
                {"$inc": {"duplicate_count": 1}}
            )

            updated = collection.find_one({"_id": existing_resume["_id"]})
            dup_count = updated.get("duplicate_count", 0)

            new_risk = calculate_risk_score(
                dup_count,
                updated.get("email"),
                updated.get("phone"),
                updated.get("llm_analysis")
            )

            risk_level = "Low" if new_risk < 30 else "Medium" if new_risk < 60 else "High"

            collection.update_one(
                {"_id": existing_resume["_id"]},
                {"$set": {"risk_score": new_risk, "risk_level": risk_level}}
            )

            return {"message": "Duplicate resume detected.", "is_duplicate": True}

        # New Resume
        email = extract_email(text)
        phone = extract_phone(text)
        llm_analysis = check_resume_consistency(text)

        risk_score = calculate_risk_score(0, email, phone, llm_analysis)
        risk_level = "Low" if risk_score < 30 else "Medium" if risk_score < 60 else "High"

        collection.insert_one({
            "filename": file.filename,
            "file_path": file_path,
            "hash": resume_hash,
            "duplicate_count": 0,
            "email": email,
            "phone": phone,
            "llm_analysis": llm_analysis,
            "risk_score": risk_score,
            "risk_level": risk_level
        })

        return {"message": "Resume submitted successfully.", "is_duplicate": False}

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return JSONResponse({"error": str(e)}, status_code=500)

# -------------------------
# Admin APIs
# -------------------------

@app.get("/all-resumes")
def get_all_resumes():
    resumes = list(collection.find({}))
    for r in resumes:
        r["_id"] = str(r["_id"])
    return resumes


@app.get("/resume/{resume_id}")
def get_resume(resume_id: str):
    resume = collection.find_one({"_id": ObjectId(resume_id)})
    if resume:
        resume["_id"] = str(resume["_id"])
        return resume
    return {"error": "Resume not found"}


@app.get("/download/{resume_id}")
def download_resume(resume_id: str):
    resume = collection.find_one({"_id": ObjectId(resume_id)})
    if resume and "file_path" in resume:
        return FileResponse(
            resume["file_path"],
            media_type="application/pdf",
            filename=resume["filename"]
        )
    return {"error": "File not found"}