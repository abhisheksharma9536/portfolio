/**
 * Personal profile — the single source of truth for identity, contact and
 * positioning. Every fact here comes from Abhishek's resume. The AI
 * assistant's knowledge base is generated from these modules, so editing a
 * fact here updates both the website and the assistant.
 */

export const profile = {
  name: "Abhishek Sharma",
  firstName: "Abhishek",
  lastName: "Sharma",
  title: "Full Stack Developer",
  positioning: "Software Engineer | Backend & AI/LLM Integration",
  experienceYears: "4+",
  careerStart: "July 2022",
  currentRole: "Software Engineer",
  currentCompany: "XORLABS",
  location: {
    city: "Greater Noida",
    region: "Uttar Pradesh",
    country: "India",
    countryCode: "IN",
    display: "Greater Noida, Uttar Pradesh, India",
  },
  email: "abhisheksharma0265@gmail.com",
  phone: {
    display: "+91-9536626962",
    href: "tel:+919536626962",
  },
  links: {
    github: "https://github.com/abhisheksharma9536",
    githubUsername: "abhisheksharma9536",
    linkedin: "https://www.linkedin.com/in/abhishek-sharma-a861101b5/",
  },
  resume: {
    href: "/Abhishek-Sharma-Resume.pdf",
    downloadName: "Abhishek-Sharma-Resume.pdf",
  },
  /** One-sentence summary used for meta descriptions and the assistant. */
  summary:
    "Full Stack Developer with 4+ years of experience building and shipping production web and mobile applications end to end — Node.js/Express.js and Python/FastAPI backends, REST APIs, PostgreSQL, AWS, Flutter and React.js apps, third-party and POS integrations, and AI features built on the Anthropic Claude API.",
  /** Longer professional summary, paraphrasing the resume without adding claims. */
  longSummary: [
    "Full Stack Developer with 4+ years of experience building and shipping production web and mobile applications end to end.",
    "Hands-on with Node.js/Express.js and Python/FastAPI for REST API and microservice development, Flutter for cross-platform iOS, Android and web apps from a single codebase, and React.js for web applications.",
    "Experienced with AWS (S3, Lambda, Cognito), Docker and CI/CD.",
    "Built backend and mobile systems for a marketplace (GoodieBag) serving 200K+ users and 2,000+ restaurant partners, built an AI chatbot service using Python, FastAPI and the Anthropic Claude API, and integrated Square and Clover POS systems that reduced partner operational effort by nearly 90%; also improved API response times by 40% through PostgreSQL query optimization and targeted indexing.",
    "Strong problem-solving and communication skills, with experience working directly with clients and cross-functional teams.",
  ],
  focusAreas: [
    "Backend engineering",
    "REST APIs",
    "PostgreSQL",
    "AWS",
    "Third-party & POS integrations",
    "Webhooks",
    "Flutter",
    "React.js",
    "AI / LLM integration",
  ],
  domains: ["Food marketplace", "Healthcare", "Developer tooling"],
} as const;

export type Profile = typeof profile;
