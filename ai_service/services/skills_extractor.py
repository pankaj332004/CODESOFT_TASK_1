import re
from typing import Set, List, Dict

CATEGORIZED_TAXONOMY: Dict[str, List[str]] = {
    "Frontend": [
        "react", "react.js", "javascript", "typescript", "html", "html5", "css", "css3",
        "tailwind", "tailwindcss", "redux", "next.js", "vue", "vue.js", "angular", "svelte",
        "sass", "scss", "bootstrap", "webpack", "vite", "responsive design", "graphql",
        "web components", "storybook", "jest", "cypress"
    ],
    "Backend": [
        "node.js", "node", "express", "express.js", "python", "fastapi", "django", "flask",
        "java", "spring boot", "c++", "c#", ".net", "asp.net", "go", "golang", "rust",
        "php", "laravel", "ruby", "ruby on rails", "rest", "restful api", "microservices",
        "grpc", "websockets", "socket.io", "kafka", "rabbitmq"
    ],
    "Database": [
        "mongodb", "postgresql", "postgres", "mysql", "sql", "sqlite", "redis", "prisma",
        "mongoose", "elasticsearch", "dynamodb", "cassandra", "mariadb", "oracle"
    ],
    "Cloud & DevOps": [
        "docker", "kubernetes", "aws", "amazon web services", "azure", "gcp", "google cloud",
        "ci/cd", "git", "github", "gitlab", "linux", "bash", "terraform", "ansible",
        "nginx", "helm", "serverless", "cloudwatch", "prometheus", "grafana"
    ],
    "AI & Data Science": [
        "machine learning", "deep learning", "artificial intelligence", "pytorch", "tensorflow",
        "scikit-learn", "pandas", "numpy", "nlp", "natural language processing", "llm",
        "openai", "hugging face", "computer vision", "opencv", "data analysis", "data science"
    ],
    "Mobile": [
        "react native", "flutter", "swift", "kotlin", "android", "ios", "xcode"
    ],
    "Design": [
        "figma", "sketch", "adobe xd", "ui/ux", "ui design", "ux design", "wireframing",
        "prototyping", "user research", "design systems", "photoshop", "illustrator"
    ],
    "Management & Product": [
        "product management", "agile", "scrum", "kanban", "jira", "confluence",
        "system architecture", "technical leadership", "seo", "google analytics"
    ],
}

# Flat set of all known skill lowercase keys
ALL_SKILLS = {skill for cat_skills in CATEGORIZED_TAXONOMY.values() for skill in cat_skills}

DISPLAY_OVERRIDES = {
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "react.js": "React",
    "react": "React",
    "node.js": "Node.js",
    "node": "Node.js",
    "next.js": "Next.js",
    "vue.js": "Vue.js",
    "express.js": "Express.js",
    "html": "HTML5",
    "html5": "HTML5",
    "css": "CSS3",
    "css3": "CSS3",
    "sql": "SQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mongodb": "MongoDB",
    "mysql": "MySQL",
    "aws": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "ci/cd": "CI/CD",
    "ui/ux": "UI/UX",
    "restful api": "RESTful API",
    "graphql": "GraphQL",
    "seo": "SEO",
    "llm": "LLM",
    "nlp": "NLP",
    "socket.io": "Socket.IO",
    "fastapi": "FastAPI",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "git": "Git",
    "github": "GitHub",
    "linux": "Linux",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
}

class SkillsExtractor:
    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """
        Extracts a clean, deduplicated list of skills from free-form text.
        """
        if not text:
            return []

        lower_text = text.lower()
        extracted: Set[str] = set()

        for skill in ALL_SKILLS:
            escaped = re.escape(skill)
            pattern = rf"(?:\b|\A){escaped}(?:\b|\Z)"
            if re.search(pattern, lower_text):
                display = DISPLAY_OVERRIDES.get(skill, skill.title())
                extracted.add(display)

        return sorted(list(extracted))

    @staticmethod
    def extract_categorized_skills(text: str) -> Dict[str, List[str]]:
        """
        Extracts skills grouped by technical and domain category.
        """
        if not text:
            return {cat: [] for cat in CATEGORIZED_TAXONOMY}

        lower_text = text.lower()
        result: Dict[str, List[str]] = {}

        for category, skill_list in CATEGORIZED_TAXONOMY.items():
            found_in_category: Set[str] = set()
            for skill in skill_list:
                escaped = re.escape(skill)
                pattern = rf"(?:\b|\A){escaped}(?:\b|\Z)"
                if re.search(pattern, lower_text):
                    display = DISPLAY_OVERRIDES.get(skill, skill.title())
                    found_in_category.add(display)
            result[category] = sorted(list(found_in_category))

        return result
