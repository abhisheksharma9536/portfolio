export type SkillCategory = {
  id: string;
  name: string;
  /** Where these skills show up in Abhishek's work — only resume-backed context. */
  context: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    name: "Backend",
    context:
      "GoodieBag's core Node.js/Express.js backend and its Python/FastAPI AI service; secure REST APIs for Avery Telehealth.",
    skills: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST APIs",
      "Microservices",
      "JWT Authentication",
      "RBAC",
      "Webhooks",
      "Background Jobs",
      "Async Processing",
    ],
  },
  {
    id: "frontend-mobile",
    name: "Frontend & Mobile",
    context:
      "The GoodieBag Flutter app on iOS, Android and web; React.js provider and patient portals for Avery Telehealth.",
    skills: [
      "Flutter",
      "Dart",
      "Cross-platform (iOS / Android / Web)",
      "State Management",
      "React.js",
      "Redux",
      "React Hooks",
      "Responsive Design",
      "HTML5",
      "CSS3",
    ],
  },
  {
    id: "ai",
    name: "AI & LLM",
    context:
      "The GoodieBag AI chatbot service on the Anthropic Claude API, three Claude Academy certifications, and AI coding tools in day-to-day development.",
    skills: [
      "Anthropic Claude API",
      "LLM API Integration",
      "AI Chatbot Development",
      "Prompt Engineering",
      "Structured Outputs",
      "Model Context Protocol (MCP)",
      "Retrieval-Augmented Generation (RAG)",
      "Claude Code",
      "GitHub Copilot",
    ],
  },
  {
    id: "data-cloud",
    name: "Databases & Cloud",
    context:
      "PostgreSQL optimization and AWS Lambda, S3 and Cognito on GoodieBag; MongoDB on Avery Telehealth; Docker and CI/CD for releases.",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Query Optimization",
      "Indexing",
      "Data Modeling",
      "AWS S3",
      "AWS Lambda",
      "AWS Cognito",
      "Serverless",
      "Docker",
      "CI/CD",
      "GitHub Actions",
    ],
  },
  {
    id: "integrations",
    name: "Integrations",
    context:
      "Every one of these is integrated into GoodieBag — POS, payments, messaging and analytics.",
    skills: [
      "Square POS",
      "Clover POS",
      "Stripe",
      "Customer.io",
      "Firebase Cloud Messaging",
      "PostHog",
    ],
  },
  {
    id: "languages",
    name: "Languages",
    context: "The languages used across backend, mobile and data work.",
    skills: ["JavaScript (ES6+)", "Python", "Dart", "SQL"],
  },
  {
    id: "tools",
    name: "Tools & Process",
    context:
      "API testing, issue tracking, test management and version control — in Agile/Scrum teams.",
    skills: ["Postman", "Jira", "TestRail", "Git", "Agile / Scrum"],
  },
];

/** Technologies for the homepage marquee — all taken from the resume. */
export const marqueeTech = [
  "Node.js",
  "Python",
  "FastAPI",
  "JavaScript",
  "Dart",
  "SQL",
  "React.js",
  "Flutter",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Claude API",
  "Stripe",
  "Square",
  "Clover",
  "PostHog",
  "Customer.io",
];
