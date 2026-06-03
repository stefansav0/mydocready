from fastapi import FastAPI
from pydantic import BaseModel

# ============================================
# CREATE FASTAPI APP
# ============================================

app = FastAPI()

# ============================================
# ROOT ROUTE
# ============================================

@app.get("/")
def home():
    return {
        "message": "Resume Builder Backend Running 🚀"
    }

# ============================================
# DATA MODEL
# ============================================

class ResumeData(BaseModel):
    name: str
    email: str
    skills: str
    experience: str

# ============================================
# GENERATE RESUME API
# ============================================

@app.post("/generate-resume")
def generate_resume(data: ResumeData):

    return {
        "success": True,
        "message": f"Resume generated for {data.name}",
        "data": {
            "name": data.name,
            "email": data.email,
            "skills": data.skills,
            "experience": data.experience
        }
    }