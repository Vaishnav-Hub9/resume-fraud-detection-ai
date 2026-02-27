import streamlit as st
import requests

st.set_page_config(page_title="AI Resume Fraud Platform", layout="wide")

# --------- PREMIUM STYLING ----------
st.markdown("""
<style>
html, body, [class*="css"] {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: white;
}

.big-title {
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
}

.stButton>button {
    background: linear-gradient(90deg, #4A90E2, #9013FE);
    color: white;
    border-radius: 10px;
    height: 3em;
    transition: 0.3s;
}

.stButton>button:hover {
    transform: scale(1.05);
}

.stFileUploader {
    border: 2px dashed #4A90E2;
    padding: 15px;
    border-radius: 10px;
}
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="big-title">🛡️ AI Resume Fraud Detection Platform</div>', unsafe_allow_html=True)

# ---------- ADMIN AUTH ----------
if "admin_auth" not in st.session_state:
    st.session_state.admin_auth = False

def admin_login():
    st.subheader("Admin Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        if username == "admin" and password == "hack2026":
            st.session_state.admin_auth = True
        else:
            st.error("Invalid Credentials")


# ---------- NAVIGATION ----------
page = st.sidebar.radio("Navigation", ["User Panel", "Admin Panel"])


# ================= USER PANEL =================
if page == "User Panel":

    st.header("Submit Resume")

    uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])

    if uploaded_file and st.button("Submit Resume"):

        with st.spinner("Submitting..."):

            response = requests.post(
                "http://127.0.0.1:8000/upload-resume/",
                files={"file": (uploaded_file.name, uploaded_file, "application/pdf")}
            )

            data = response.json()

            if data.get("is_duplicate"):
                st.error("Duplicate resume detected. Submission rejected.")
            else:
                st.success("Resume submitted successfully.")


# ================= ADMIN PANEL =================
if page == "Admin Panel":

    if not st.session_state.admin_auth:
        admin_login()
        st.stop()

    st.header("Admin Dashboard")

    response = requests.get("http://127.0.0.1:8000/all-resumes")

    if response.status_code == 200:
        resumes = response.json()

        total = len(resumes)
        high = sum(1 for r in resumes if r["risk_level"] == "High")
        medium = sum(1 for r in resumes if r["risk_level"] == "Medium")

        col1, col2, col3 = st.columns(3)
        col1.metric("Total Resumes", total)
        col2.metric("High Risk", high)
        col3.metric("Medium Risk", medium)

        st.divider()

        for resume in resumes:
            with st.expander(f"{resume['filename']} | Risk: {resume['risk_level']}"):

                details = requests.get(
                    f"http://127.0.0.1:8000/resume/{resume['_id']}"
                ).json()

                st.write("Email:", details["email"])
                st.write("Phone:", details["phone"])
                st.write("Duplicate Score:", details["duplicate_score"])

                if details["risk_level"] == "High":
                    st.error(f"Risk Level: {details['risk_level']}")
                elif details["risk_level"] == "Medium":
                    st.warning(f"Risk Level: {details['risk_level']}")
                else:
                    st.success(f"Risk Level: {details['risk_level']}")

                st.write("LLM Analysis:")
                st.code(details["llm_analysis"])