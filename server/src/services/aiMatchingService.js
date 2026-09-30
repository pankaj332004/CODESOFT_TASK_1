/**
 * Node.js AI Client Service
 * Dispatches requests to the Python FastAPI Microservice (:8000)
 * Architecture:
 *   Node.js -> POST http://localhost:8000/ai/match -> Python FastAPI (Resume Parser + Skills Extractor + Job Matcher) -> Match Score -> Node.js -> React
 */

const FASTAPI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Common tech, design, marketing skills vocabulary for local fallback
const COMMON_SKILLS = [
  'react', 'node.js', 'javascript', 'typescript', 'python', 'java', 'html', 'css',
  'tailwind', 'mongodb', 'postgresql', 'docker', 'aws', 'figma', 'ui/ux', 'seo'
];

const localCalculateJobMatch = (candidate, job) => {
  if (!candidate || !job) {
    return { score: 60, match_level: 'Moderate Match', matching_skills: [], reason: 'Opportunity fit' };
  }

  const candidateText = [
    candidate.bio || '',
    candidate.location || '',
    Array.isArray(candidate.skills) ? candidate.skills.join(' ') : (candidate.skills || ''),
  ].join(' ').toLowerCase();

  const jobText = [
    job.title || '',
    job.category || '',
    job.description || '',
    Array.isArray(job.requirements) ? job.requirements.join(' ') : '',
  ].join(' ').toLowerCase();

  const matchingSkills = [];
  COMMON_SKILLS.forEach((skill) => {
    if (candidateText.includes(skill) && jobText.includes(skill)) {
      matchingSkills.push(skill.toUpperCase());
    }
  });

  let score = 55;
  if (job.category && candidateText.includes(job.category.toLowerCase())) score += 15;
  score += Math.min(25, matchingSkills.length * 8);
  score = Math.min(98, Math.max(62, Math.round(score)));

  return {
    score,
    match_level: score >= 85 ? 'Strong Match' : score >= 75 ? 'High Match' : 'Good Fit',
    matching_skills: matchingSkills.slice(0, 5),
    reason: `Calculated ${score}% match with your profile.`,
  };
};

/**
 * Invokes Python FastAPI Microservice: POST /ai/match
 */
const calculateJobMatch = async (candidate, job) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/ai/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate, job }),
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] FastAPI (:8000) unavailable (${err.message}). Using local engine fallback.`);
  }

  return localCalculateJobMatch(candidate, job);
};

/**
 * Invokes Python FastAPI Microservice: POST /ai/recommend
 */
const getRecommendedJobs = async (candidate, allJobs = []) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate, jobs: allJobs }),
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] FastAPI (:8000) unavailable (${err.message}). Using local engine fallback.`);
  }

  // Local fallback
  return allJobs.map((job) => ({
    ...job,
    aiMatch: localCalculateJobMatch(candidate, job),
  })).sort((a, b) => b.aiMatch.score - a.aiMatch.score);
};

/**
 * Invokes Python FastAPI Microservice: POST /ai/parse-resume
 */
const parseResume = async (text) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/ai/parse-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] parseResume fallback (${err.message})`);
  }

  return {
    email: '',
    phone: '',
    years_experience: 1,
    education: [],
    skills: [],
    categorized_skills: {},
  };
};

/**
 * Invokes Python FastAPI Microservice: POST /ai/extract-skills
 */
const extractSkills = async (text) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/ai/extract-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.warn(`[AI Service] extractSkills fallback (${err.message})`);
  }

  const matching = COMMON_SKILLS.filter((s) => text.toLowerCase().includes(s));
  return {
    skills: matching.map((s) => s.toUpperCase()),
    categorized: { General: matching },
    count: matching.length,
  };
};

module.exports = {
  calculateJobMatch,
  getRecommendedJobs,
  parseResume,
  extractSkills,
};

