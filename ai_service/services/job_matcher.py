import re
from typing import Dict, Any, List
from .skills_extractor import SkillsExtractor

class JobMatcher:
    @staticmethod
    def match_job(candidate_data: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes multi-dimensional AI match score with breakdown, matching & missing skills,
        and actionable recommendations.
        """
        candidate_skills = set(s.lower() for s in candidate_data.get("skills", []))
        candidate_text = candidate_data.get("raw_text", "")
        cand_years_exp = candidate_data.get("years_experience", 1)

        # 1. Prepare Job Features
        job_title = job.get("title", "")
        job_category = job.get("category", "")
        job_type = job.get("type", "")
        job_desc = job.get("description", "")
        job_reqs = " ".join(job.get("requirements", [])) if isinstance(job.get("requirements"), list) else (job.get("requirements") or "")
        job_resps = " ".join(job.get("responsibilities", [])) if isinstance(job.get("responsibilities"), list) else (job.get("responsibilities") or "")
        job_exp_str = job.get("experience", "")

        job_full_text = f"{job_title} {job_category} {job_type} {job_desc} {job_reqs} {job_resps}"
        job_extracted_skills = SkillsExtractor.extract_skills(job_full_text)

        # 2. Skill Overlap (40% Weight)
        matching_skills = []
        for s in job_extracted_skills:
            if s.lower() in candidate_skills or s.lower() in candidate_text:
                matching_skills.append(s)

        missing_skills = [s for s in job_extracted_skills if s not in matching_skills]

        if job_extracted_skills:
            skills_ratio = len(matching_skills) / len(job_extracted_skills)
            skills_score = min(100, int(skills_ratio * 100) + 15)
        else:
            skills_score = 80

        # 3. Title & Role Domain Alignment (25% Weight)
        title_lower = job_title.lower()
        title_score = 60
        keywords = ["frontend", "backend", "fullstack", "full stack", "devops", "designer", "ui/ux", "product", "engineer", "developer", "lead"]
        matched_keywords = [k for k in keywords if k in title_lower and k in candidate_text]
        if matched_keywords:
            title_score += min(40, len(matched_keywords) * 20)

        if job_category.lower() in candidate_text:
            title_score = min(100, title_score + 10)

        # 4. Experience Fit (15% Weight)
        experience_score = 85
        req_exp_num = 2
        exp_match = re.search(r"(\d+)", job_exp_str)
        if exp_match:
            req_exp_num = int(exp_match.group(1))

        exp_diff = cand_years_exp - req_exp_num
        if exp_diff >= 0:
            experience_score = min(100, 90 + min(10, exp_diff * 2))
        elif exp_diff == -1:
            experience_score = 80
        else:
            experience_score = max(55, 80 + (exp_diff * 10))

        # 5. Location Alignment (10% Weight)
        job_loc = (job.get("location") or "").lower()
        cand_loc = (candidate_data.get("location") or "").lower()
        if "remote" in job_loc:
            location_score = 100
        elif cand_loc and (cand_loc in job_loc or job_loc in cand_loc):
            location_score = 100
        else:
            location_score = 75

        # 6. Context & Term Density (10% Weight)
        context_score = 75
        if len(matching_skills) >= 3:
            context_score = 95
        elif len(matching_skills) >= 1:
            context_score = 85

        # 7. Total Composite Score Calculation
        composite = (
            (skills_score * 0.40) +
            (title_score * 0.25) +
            (experience_score * 0.15) +
            (location_score * 0.10) +
            (context_score * 0.10)
        )
        final_score = int(round(composite))
        final_score = max(45, min(99, final_score))

        # 8. Tier & Actionable Recommendations
        recommendations = []
        if missing_skills:
            top_missing = ", ".join(missing_skills[:2])
            recommendations.append(f"Consider learning or highlighting {top_missing} to boost your match.")
        
        if "remote" in job_loc:
            recommendations.append("Emphasize your remote collaboration & self-starter capabilities.")
        else:
            recommendations.append(f"Confirm availability for onsite work in {job.get('location', 'the listed location')}.")

        if final_score >= 88:
            match_level = "Exceptional Match"
            matched_summary = ", ".join(matching_skills[:3]) if matching_skills else "core competencies"
            reason = f"Excellent candidate match! Your background in {matched_summary} strongly aligns with this position."
        elif final_score >= 78:
            match_level = "Strong Match"
            matched_summary = " & ".join(matching_skills[:2]) if matching_skills else "relevant experience"
            reason = f"Great role alignment with your {matched_summary} skills and experience level."
        elif final_score >= 68:
            match_level = "Good Match"
            reason = f"Solid foundational skills in {job_category}. Review missing qualifications to stand out."
        else:
            match_level = "Fair Fit"
            reason = f"Potential match opportunity in {job_category}. Upskilling in required tools recommended."

        return {
            "score": final_score,
            "match_level": match_level,
            "breakdown": {
                "skills_score": int(skills_score),
                "title_score": int(title_score),
                "experience_score": int(experience_score),
                "location_score": int(location_score),
            },
            "matching_skills": matching_skills[:8],
            "missing_skills": missing_skills[:6],
            "reason": reason,
            "recommendations": recommendations[:2],
        }
