import re
from typing import Dict, Any, List
from .skills_extractor import SkillsExtractor

class ResumeParser:
    @staticmethod
    def parse_resume_text(text: str) -> Dict[str, Any]:
        """
        Parses free-form resume text or uploaded document content.
        Extracts contact info, years of experience, education, and categorized skills.
        """
        if not text:
            return {
                "email": "",
                "phone": "",
                "links": [],
                "years_experience": 0,
                "education": [],
                "skills": [],
                "categorized_skills": {},
            }

        # 1. Email extraction
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        email = email_match.group(0) if email_match else ""

        # 2. Phone extraction
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
        phone = phone_match.group(0) if phone_match else ""

        # 3. Social / Portfolio links
        links = []
        for link_pat in [r"github\.com/[\w\.-]+", r"linkedin\.com/in/[\w\.-]+", r"https?://[\w\.-]+\.[a-z]{2,}(?:/\S*)?"]:
            matches = re.findall(link_pat, text, re.IGNORECASE)
            links.extend(matches)
        links = sorted(list(set(links)))[:4]

        # 4. Years of experience estimation
        years_exp = 0
        exp_matches = re.findall(r"(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience", text, re.IGNORECASE)
        if exp_matches:
            years_exp = max(int(m) for m in exp_matches)
        else:
            simple_matches = re.findall(r"(\d{1,2})\+?\s*(?:years?|yrs?)", text, re.IGNORECASE)
            if simple_matches:
                years_exp = min(25, max(int(m) for m in simple_matches))

        # 5. Education detection
        education_keywords = [
            "computer science", "software engineering", "information technology",
            "bachelor", "master", "ph.d", "b.tech", "b.s.", "m.s.", "degree"
        ]
        education_found = []
        lower_text = text.lower()
        for edu in education_keywords:
            if re.search(rf"\b{re.escape(edu)}\b", lower_text):
                education_found.append(edu.title())

        # 6. Categorized skills & flat list
        categorized_skills = SkillsExtractor.extract_categorized_skills(text)
        all_skills = SkillsExtractor.extract_skills(text)

        return {
            "email": email,
            "phone": phone,
            "links": links,
            "years_experience": years_exp,
            "education": education_found,
            "skills": all_skills,
            "categorized_skills": categorized_skills,
            "word_count": len(text.split()),
        }

    @staticmethod
    def parse_candidate_profile(candidate: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combines candidate user record and resume into a unified feature set for AI matching.
        """
        name = candidate.get("name", "")
        email = candidate.get("email", "")
        bio = candidate.get("bio", "")
        location = candidate.get("location", "")
        explicit_skills = candidate.get("skills", [])
        resume_text = candidate.get("resume", "") or ""

        # Merge candidate textual signals
        combined_text = f"{bio} {location} {' '.join(explicit_skills) if isinstance(explicit_skills, list) else explicit_skills} {resume_text}"

        parsed_resume = ResumeParser.parse_resume_text(combined_text)

        # Merge explicit skills with parsed skills
        all_skills = set(parsed_resume["skills"])
        if isinstance(explicit_skills, list):
            for s in explicit_skills:
                all_skills.add(s)

        # Default experience estimation if not found in text
        years_exp = parsed_resume.get("years_experience", 0)
        if years_exp == 0:
            if "senior" in combined_text.lower():
                years_exp = 5
            elif "lead" in combined_text.lower():
                years_exp = 7
            elif "experienced" in combined_text.lower() or len(all_skills) > 4:
                years_exp = 3
            else:
                years_exp = 1

        return {
            "name": name,
            "email": email or parsed_resume.get("email", ""),
            "bio": bio,
            "location": location,
            "years_experience": years_exp,
            "education": parsed_resume.get("education", []),
            "skills": sorted(list(all_skills)),
            "categorized_skills": parsed_resume.get("categorized_skills", {}),
            "raw_text": combined_text.lower(),
        }
