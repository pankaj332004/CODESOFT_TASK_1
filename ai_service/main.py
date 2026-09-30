import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

from services.resume_parser import ResumeParser
from services.skills_extractor import SkillsExtractor
from services.job_matcher import JobMatcher

app = FastAPI(
    title="Job Board AI Matching & Intelligence Service",
    description="Python FastAPI Microservice: Resume Parser -> Skills Extraction -> Job Matching -> Match Score",
    version="2.0.0",
)

# Enable CORS for Node.js Express server and React client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    candidate: Dict[str, Any]
    job: Dict[str, Any]

class RecommendRequest(BaseModel):
    candidate: Dict[str, Any]
    jobs: List[Dict[str, Any]]

class TextPayload(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI AI Job Matching Microservice",
        "port": 8000,
        "capabilities": [
            "resume_parsing",
            "skills_extraction",
            "job_matching",
            "match_score_breakdown",
            "recommendation_engine",
        ]
    }

@app.post("/ai/match")
def match_single_job(payload: MatchRequest):
    """
    Evaluates semantic and structural fit between a candidate and a specific job.
    Pipeline: Resume Parser -> Skills Extractor -> Job Matcher -> Match Score
    """
    try:
        parsed_candidate = ResumeParser.parse_candidate_profile(payload.candidate)
        result = JobMatcher.match_job(parsed_candidate, payload.job)
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/recommend")
def recommend_jobs(payload: RecommendRequest):
    """
    Scores and ranks a list of candidate jobs by AI match score.
    """
    try:
        parsed_candidate = ResumeParser.parse_candidate_profile(payload.candidate)
        scored_jobs = []

        for job in payload.jobs:
            match_res = JobMatcher.match_job(parsed_candidate, job)
            scored_jobs.append({
                **job,
                "aiMatch": match_res,
            })

        # Sort descending by match score
        scored_jobs.sort(key=lambda x: x["aiMatch"]["score"], reverse=True)

        return {
            "success": True,
            "count": len(scored_jobs),
            "data": scored_jobs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/parse-resume")
def parse_resume(payload: TextPayload):
    """
    Direct endpoint to parse resume text into structured contact info,
    years of experience, education, and extracted skills.
    """
    try:
        parsed = ResumeParser.parse_resume_text(payload.text)
        return {
            "success": True,
            "data": parsed,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/extract-skills")
def extract_skills(payload: TextPayload):
    """
    Direct endpoint to extract and categorize skills from text.
    """
    try:
        categorized = SkillsExtractor.extract_categorized_skills(payload.text)
        flat = SkillsExtractor.extract_skills(payload.text)
        return {
            "success": True,
            "data": {
                "skills": flat,
                "categorized": categorized,
                "count": len(flat),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
