/**
 * Ask Abhishek — local answer engine.
 *
 * A deterministic, dependency-free question answerer that runs in the
 * browser. It classifies a question into a topic with weighted keyword
 * matching and answers from the same content modules that render the site,
 * so every personal fact it states is one the portfolio states. No external
 * AI service is called.
 */
import { profile } from "@/content/profile";
import { roles } from "@/content/experience";
import { averyTelehealth, codeAnalyzer, goodiebag } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import { achievements, certifications, education } from "@/content/credentials";
import type { ChatMessage } from "@/lib/ai/protocol";

export const NOT_AVAILABLE = "I don't have that information in Abhishek's portfolio.";

type Answer = { short: string; more?: string };

type Topic = {
  id: string;
  /** Keyword → weight. Keys are matched on word boundaries against the normalized question. */
  keywords: Record<string, number>;
  answer: () => Answer;
};

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");
const skills = (id: string) => skillCategories.find((c) => c.id === id)?.skills ?? [];
const [currentRole, juniorRole] = roles;

// ---------------------------------------------------------------------------
// Topics about Abhishek (facts only from src/content)
// ---------------------------------------------------------------------------

const topics: Topic[] = [
  {
    id: "overview",
    keywords: {
      specialize: 4, specialise: 4, specialization: 4, specialty: 4, expertise: 4, strength: 3, strengths: 3,
      "good at": 3, focus: 2, "who is": 3, "about abhishek": 4, "about him": 3, summary: 3, overview: 3,
      introduce: 3, background: 2, profile: 2, "what does abhishek do": 4, "what does he do": 4, "tell me about abhishek": 5,
      "full stack": 2, fullstack: 2, "why hire": 4, hire: 1,
    },
    answer: () => ({
      short: `Abhishek is a **${profile.title}** with **${profile.experienceYears} years** of production experience, currently a ${profile.currentRole} at ${profile.currentCompany}. His strongest areas:

- **Backend & APIs** — Node.js/Express.js and Python/FastAPI, REST APIs, PostgreSQL
- **Integrations** — Square and Clover POS, Stripe, webhooks
- **Cloud** — AWS Lambda, S3 and Cognito, Docker and CI/CD
- **Mobile & web** — Flutter (iOS, Android, web) and React.js
- **AI/LLM** — an AI chatbot service built on the Anthropic Claude API

See the [About section](/#about).`,
      more: `His flagship work is **GoodieBag**, a surplus food marketplace serving **200K+ users** and **2,000+ restaurant partners**, where he built the core backend, the Flutter app, the POS and payment integrations and an AI chatbot. He also works directly with clients on requirements, scoping, demos and release planning, in Agile/Scrum teams.

Read the [GoodieBag case study](/work/goodiebag).`,
    }),
  },
  {
    id: "goodiebag",
    keywords: { goodiebag: 6, "goodie bag": 6, marketplace: 3, "surplus food": 5, surplus: 3, "food marketplace": 5, flagship: 3 },
    answer: () => ({
      short: `**GoodieBag** is a surplus food marketplace on iOS, Android and web (${goodiebag.period}) serving **200K+ users** and **2,000+ restaurant partners**. Abhishek:

- Built and maintains the core **Node.js/Express.js** backend (auth, catalog, ordering, partner management)
- Developed the full **Flutter** app for iOS, Android and web
- Integrated **Square and Clover POS** with webhook-based sync (~90% less partner operational effort)
- Improved API response time by **40%** with PostgreSQL optimization
- Built an **AI chatbot** service with Python, FastAPI and the Claude API

Full story: [GoodieBag case study](/work/goodiebag).`,
      more: `More of what he did on GoodieBag:

${list(goodiebag.contributions.slice(6))}

The [architecture section](/work/goodiebag#architecture) shows how the pieces connect.`,
    }),
  },
  {
    id: "performance",
    keywords: {
      performance: 4, "response time": 5, latency: 4, faster: 3, speed: 3, optimize: 3, optimise: 3, optimization: 3,
      optimized: 3, "40": 3, slow: 2, scaling: 2, scale: 1, concurrency: 3, "high concurrency": 4,
    },
    answer: () => ({
      short: `On GoodieBag, Abhishek improved **API response time by 40%** by **optimizing PostgreSQL queries** and **adding targeted indexes** for high-concurrency load.

Details: [Performance](/work/goodiebag#performance).`,
      more: `The portfolio reports the outcome (a 40% improvement) and the two levers (query optimization and targeted indexing). It doesn't include benchmark methodology or before/after latency figures. He also improved API reliability with validation middleware, structured error handling and JWT authentication across services.`,
    }),
  },
  {
    id: "pos",
    keywords: {
      pos: 6, "point of sale": 6, square: 5, clover: 5, "restaurant partners": 3, partners: 2, partner: 2,
      restaurants: 2, restaurant: 2, "operational effort": 5, "90": 3,
    },
    answer: () => ({
      short: `Abhishek integrated **Square POS** and **Clover POS** into GoodieBag, so **2,000+ restaurant partners** manage **locations, catalog, inventory and orders** from their existing POS. That reduced partner operational effort by **nearly 90%** and helped drive new partner acquisition.

See [POS integrations](/work/goodiebag#pos).`,
      more: `He also built **webhook-based catalog and inventory sync**, keeping data consistent across the POS systems, the backend and the storefront in real time. The [webhook flow](/work/goodiebag#webhooks) walks through each step: POS → Webhook → Backend → Database → Storefront.`,
    }),
  },
  {
    id: "webhooks",
    keywords: {
      webhook: 6, webhooks: 6, sync: 4, synchronization: 4, synchronisation: 4, "real time": 3, realtime: 3,
      inventory: 3, catalog: 3, catalogue: 3, consistency: 3, consistent: 2, "event driven": 3,
    },
    answer: () => ({
      short: `Abhishek built **webhook-based catalog and inventory sync** for GoodieBag. Changes in Square or Clover reach the Node.js backend as webhooks, are applied to PostgreSQL, and show up in the storefront, keeping all three consistent in real time.

Try the interactive [webhook flow](/work/goodiebag#webhooks).`,
      more: `Webhooks also appear in his Stripe work: **payment webhooks**, along with checkout, refunds, failure handling and partner payouts. Webhooks, background jobs and async processing are all listed among his backend skills.`,
    }),
  },
  {
    id: "ai",
    keywords: {
      ai: 5, "a.i": 5, llm: 6, llms: 6, claude: 6, anthropic: 6, chatbot: 5, "chat bot": 5, "artificial intelligence": 6,
      prompt: 3, "prompt engineering": 5, rag: 5, retrieval: 3, mcp: 5, "model context protocol": 6, "structured outputs": 5,
      "machine learning": 2, "generative": 3, copilot: 4, "claude code": 5,
    },
    answer: () => ({
      short: `Abhishek built an **AI chatbot service** for GoodieBag in **Python and FastAPI** using the **Anthropic Claude API**. It's integrated with the Node.js backend and the Flutter app and handles customer and partner queries.

His AI skills include ${skills("ai").slice(1, 7).join(", ")}.

See [AI chatbot](/work/goodiebag#ai).`,
      more: `He holds three Claude Academy certifications (2026):

${list(certifications.map((c) => `[${c.name}](${c.verifyUrl})`))}

He also uses AI coding tools (Claude Code and GitHub Copilot) in day-to-day development.`,
    }),
  },
  {
    id: "aws",
    keywords: {
      aws: 6, amazon: 4, lambda: 5, s3: 5, cognito: 5, cloud: 3, serverless: 4, "amazon web services": 6,
    },
    answer: () => ({
      short: `Abhishek has worked with AWS on GoodieBag: he wrote **AWS Lambda** functions in Python and Node.js for file handling and background jobs, used **S3** for media storage and **Cognito** for authentication. AWS is also in the Avery Telehealth stack.

See [AWS](/work/goodiebag#aws).`,
      more: `Related cloud and delivery experience: packaging services with **Docker** and running releases through **CI/CD** pipelines. GitHub Actions and serverless are also listed in his skills.`,
    }),
  },
  {
    id: "mobile",
    keywords: {
      mobile: 5, flutter: 6, dart: 5, ios: 5, android: 5, "cross platform": 5, "cross-platform": 5, platforms: 3,
      platform: 1, app: 1, apps: 1, "state management": 3, widgets: 3,
    },
    answer: () => ({
      short: `Abhishek developed the full **Flutter** app for GoodieBag across **iOS, Android and web** from a single codebase. It covers reusable widgets, state management and the complete flow from store discovery to order tracking.

See [Flutter app](/work/goodiebag#mobile).`,
      more: `For web front ends he also works with **React.js**. On Avery Telehealth he built responsive provider and patient portals with Redux and role-based access control.`,
    }),
  },
  {
    id: "codeAnalyzer",
    keywords: {
      "code analyzer": 7, "code analyser": 7, analyzer: 4, "static analysis": 6, "static code": 5, parser: 5, parsers: 5,
      parsing: 4, ast: 5, "syntax tree": 6, "abstract syntax": 6, grammar: 4, "false positive": 5, "false positives": 5,
      "rule engine": 5, "30 languages": 5, java: 3,
    },
    answer: () => ({
      short: `**Code Analyzer** (${codeAnalyzer.period}) is a SaaS static code analysis platform supporting **30+ programming languages**. Abhishek worked on the **parser and Abstract Syntax Tree (AST) layer** behind its detection engine:

${list(codeAnalyzer.contributions.slice(1))}

See [Code Analyzer](/#code-analyzer).`,
      more: `Technologies on that project: ${codeAnalyzer.stack.join(", ")}. Separately, as a Junior Software Engineer (${juniorRole.start} – ${juniorRole.end}) he worked on parsing components and SQL data layers for enterprise developer-tooling products.`,
    }),
  },
  {
    id: "database",
    keywords: {
      postgres: 6, postgresql: 6, sql: 4, database: 5, databases: 5, db: 4, index: 3, indexes: 4, indexing: 4,
      query: 3, queries: 3, mongodb: 5, mongo: 5, "data modeling": 4, "data modelling": 4,
    },
    answer: () => ({
      short: `**PostgreSQL** is GoodieBag's database, and Abhishek improved API response time by **40%** there by optimizing queries and adding targeted indexes for high-concurrency load. He has also worked on **SQL data layers** for developer-tooling products, and used **MongoDB** on Avery Telehealth.

Database skills listed: PostgreSQL, MongoDB, query optimization, indexing and data modeling. See [Performance](/work/goodiebag#performance).`,
    }),
  },
  {
    id: "stack",
    keywords: {
      technologies: 6, technology: 5, "tech stack": 6, stack: 3, tools: 3, skills: 5, skill: 4, languages: 4,
      "programming languages": 5, frameworks: 4, "what does he use": 5, "what does abhishek use": 5, toolkit: 4,
    },
    answer: () => ({
      short: `Abhishek's toolkit, by area:

${list(skillCategories.slice(0, 5).map((c) => `**${c.name}:** ${c.skills.slice(0, 6).join(", ")}`))}
- **Languages:** ${skills("languages").join(", ")}

See [Skills](/#skills) for the full list and where each is used.`,
      more: `The full lists:

${list(skillCategories.map((c) => `**${c.name}:** ${c.skills.join(", ")}`))}`,
    }),
  },
  {
    id: "experience",
    keywords: {
      experience: 4, years: 3, "how long": 3, career: 4, job: 3, jobs: 3, role: 3, roles: 3, xorlabs: 6, company: 3,
      employer: 4, "work history": 5, junior: 3, position: 3, current: 2, currently: 2, "where does he work": 6, title: 2,
      responsibilities: 4, promoted: 3, progression: 4,
    },
    answer: () => ({
      short: `Abhishek has **${profile.experienceYears} years** of experience, all at **XORLABS** (Greater Noida):

- **${currentRole.title}**: ${currentRole.start} – ${currentRole.end}. Production features end to end across Node.js/Express.js, Python/FastAPI, Flutter and React.js, plus client-facing work on requirements, demos and releases.
- **${juniorRole.title}**: ${juniorRole.start} – ${juniorRole.end}. Parsing components, SQL data layers, test cases and TestRail defect tracking.

See [Experience](/#experience).`,
      more: `As a ${currentRole.title} he also:

${list([...currentRole.highlights.slice(1), ...currentRole.details])}`,
    }),
  },
  {
    id: "avery",
    keywords: {
      avery: 7, telehealth: 7, healthcare: 5, health: 3, patient: 4, patients: 4, provider: 3, providers: 3,
      clinical: 4, medical: 3, rbac: 3, "role based": 3,
    },
    answer: () => ({
      short: `**Avery Telehealth** (${averyTelehealth.period}) is an enterprise telehealth and patient management platform. Abhishek:

${list(averyTelehealth.contributions)}

Stack: ${averyTelehealth.stack.join(", ")}. See [Avery Telehealth](/#avery-telehealth).`,
    }),
  },
  {
    id: "frontend",
    keywords: { react: 6, "react.js": 6, reactjs: 6, redux: 5, frontend: 5, "front end": 5, "front-end": 5, hooks: 3, ui: 2, web: 1, html: 3, css: 3, responsive: 3 },
    answer: () => ({
      short: `Abhishek builds web front ends with **React.js**. On Avery Telehealth he built responsive provider and patient portals with reusable components, **Redux** state management and role-based access control. He also uses React.js in client work at XORLABS.

Frontend skills: ${skills("frontend-mobile").filter((s) => !["Flutter", "Dart", "Cross-platform (iOS / Android / Web)"].includes(s)).join(", ")}.`,
    }),
  },
  {
    id: "backend",
    keywords: {
      backend: 5, "back end": 5, "back-end": 5, node: 5, "node.js": 6, nodejs: 6, express: 5, "express.js": 5, api: 3, apis: 3,
      rest: 4, "rest api": 5, microservices: 5, microservice: 5, fastapi: 6, python: 5, jwt: 5, authentication: 4, auth: 3,
      "background jobs": 4, async: 3, server: 2,
    },
    answer: () => ({
      short: `Backend is one of Abhishek's strongest areas. He built and maintains GoodieBag's **core Node.js/Express.js backend**, with REST APIs for authentication, catalog, ordering and partner management, and built a **Python/FastAPI** AI service alongside it. Reliability comes from validation middleware, structured error handling and JWT authentication across services.

Backend skills: ${skills("backend").join(", ")}. See [Backend & APIs](/work/goodiebag#backend).`,
    }),
  },
  {
    id: "payments",
    keywords: { stripe: 6, payment: 5, payments: 5, payout: 5, payouts: 5, refund: 5, refunds: 5, checkout: 4, billing: 3 },
    answer: () => ({
      short: `Abhishek integrated **Stripe** into GoodieBag for payments and partner payouts, covering **checkout, payment webhooks, refunds and failure handling**.

See [Payments](/work/goodiebag#payments).`,
    }),
  },
  {
    id: "devops",
    keywords: { docker: 6, "ci/cd": 6, "ci cd": 6, cicd: 6, pipeline: 4, pipelines: 4, "github actions": 6, deploy: 3, deployment: 3, devops: 5, containers: 4, container: 4, release: 2, releases: 2 },
    answer: () => ({
      short: `Abhishek packages services with **Docker** and runs releases through **CI/CD pipelines**, keeping builds automated and environments consistent. GitHub Actions is listed in his skills, and Docker is part of the GoodieBag stack.`,
    }),
  },
  {
    id: "quality",
    keywords: { test: 3, testing: 5, tests: 4, "test cases": 6, qa: 5, testrail: 6, quality: 4, bugs: 3, defects: 4, reliability: 3, validation: 3, logging: 3 },
    answer: () => ({
      short: `As a Junior Software Engineer, Abhishek **authored and validated test cases** across multi-language codebases and **tracked defects in TestRail**, improving release quality. Later work kept that focus on correctness:

- Validation middleware and structured error handling on GoodieBag
- Form validation, error handling and logging for healthcare data on Avery Telehealth
- False-positive fixes in Code Analyzer's AST layer`,
    }),
  },
  {
    id: "education",
    keywords: { education: 6, degree: 5, college: 5, university: 5, "b.tech": 6, btech: 6, cgpa: 6, gpa: 5, graduate: 4, graduated: 4, study: 3, studied: 4, qualification: 4 },
    answer: () => ({
      short: `Abhishek holds a **${education.degree} in ${education.field}** from **${education.institution}** (${education.period}), with a **CGPA of ${education.cgpa}**.`,
    }),
  },
  {
    id: "certifications",
    keywords: { certification: 6, certifications: 6, certificate: 6, certificates: 6, certified: 6, course: 4, courses: 4, "claude academy": 6, credential: 5, credentials: 5 },
    answer: () => ({
      short: `Abhishek has three **Claude Academy** certifications (2026), each verifiable:

${list(certifications.map((c) => `[${c.name}](${c.verifyUrl})`))}`,
    }),
  },
  {
    id: "achievements",
    keywords: { award: 6, awards: 6, achievement: 6, achievements: 6, "star performer": 7, codekaze: 7, rank: 4, competitive: 4, recognition: 5, accomplishments: 5, honors: 4 },
    answer: () => ({
      short: list(achievements.map((a) => `**${a.title}:** ${a.highlight} (${a.period}). ${a.detail}`)) +
        "\n\nSee [Achievements](/#achievements).",
    }),
  },
  {
    id: "contact",
    keywords: {
      contact: 6, email: 5, mail: 3, phone: 5, number: 2, reach: 4, linkedin: 6, github: 5, connect: 3, call: 3,
      "get in touch": 6, message: 2, "how can i hire": 4, socials: 4,
    },
    answer: () => ({
      short: `You can reach Abhishek at:

- **Email:** [${profile.email}](mailto:${profile.email})
- **Phone:** ${profile.phone.display}
- **LinkedIn:** [${profile.name}](${profile.links.linkedin})
- **GitHub:** [@${profile.links.githubUsername}](${profile.links.github})

Or use the [contact form](/#contact).`,
    }),
  },
  {
    id: "resume",
    keywords: { resume: 7, "résumé": 7, cv: 7, pdf: 4, "curriculum vitae": 7 },
    answer: () => ({
      short: `You can [view or download Abhishek's resume (PDF)](${profile.resume.href}). It's also linked from the hero and the [contact section](/#contact).`,
    }),
  },
  {
    id: "location",
    keywords: { location: 6, located: 6, based: 5, "where is he": 5, "where does he live": 6, city: 4, country: 3, india: 3, noida: 5, "time zone": 3, timezone: 3 },
    answer: () => ({
      short: `Abhishek is based in **${profile.location.display}**.`,
    }),
  },
  {
    id: "process",
    keywords: {
      client: 4, clients: 5, agile: 6, scrum: 6, team: 3, teamwork: 4, requirement: 4, requirements: 4, demo: 4, demos: 4,
      communication: 5, collaboration: 4, collaborate: 4, stakeholders: 4, "soft skills": 5, scoping: 4, "release planning": 5,
    },
    answer: () => ({
      short: `Abhishek works **directly with clients** on requirement gathering, scoping, demos and release planning, and collaborates with cross-functional teams in **Agile/Scrum**. His client work spans food-marketplace, healthcare and developer-tooling domains.`,
    }),
  },
  {
    id: "engagement",
    keywords: { posthog: 6, analytics: 5, firebase: 5, fcm: 6, "push notifications": 6, "push notification": 6, notifications: 4, "customer.io": 6, customerio: 6, campaigns: 4, "lifecycle": 4 },
    answer: () => ({
      short: `On GoodieBag, Abhishek added **PostHog** analytics, set up push notifications with **Firebase Cloud Messaging**, and built lifecycle campaigns with **Customer.io**.

See [Analytics & engagement](/work/goodiebag#engagement).`,
    }),
  },
];

// ---------------------------------------------------------------------------
// Questions the portfolio deliberately can't answer
// ---------------------------------------------------------------------------

const unavailable: Record<string, string> = {
  salary: "compensation", ctc: "compensation", compensation: "compensation", "expected salary": "compensation",
  "hourly rate": "compensation", "day rate": "compensation", "pay scale": "compensation",
  "notice period": "notice period", "serving notice": "notice period",
  "open to work": "availability", availability: "availability", "job search": "availability", "actively looking": "availability", freelance: "availability",
  visa: "visa or relocation", relocate: "visa or relocation", relocation: "visa or relocation",
  remote: "work arrangement", onsite: "work arrangement", "on-site": "work arrangement", hybrid: "work arrangement",
  "how old": "personal details", age: "personal details", married: "personal details", family: "personal details",
  hobbies: "personal details", hobby: "personal details", religion: "personal details",
  references: "references", referees: "references",
  "team size": "team sizes", "size of the team": "team sizes", "how many developers": "team sizes",
  "how many engineers": "team sizes", "how many people": "team sizes", "team members": "team sizes", "how big is the team": "team sizes",
};

// ---------------------------------------------------------------------------
// Technologies the portfolio does not list → honest "not listed" + nearest match
// ---------------------------------------------------------------------------

const unlistedTech: Record<string, { name: string; closest: string }> = {
  kubernetes: { name: "Kubernetes", closest: "He works with **Docker** and **CI/CD** pipelines, plus AWS Lambda for serverless workloads." },
  k8s: { name: "Kubernetes", closest: "He works with **Docker** and **CI/CD** pipelines, plus AWS Lambda for serverless workloads." },
  terraform: { name: "Terraform", closest: "His cloud experience is **AWS** (Lambda, S3, Cognito) with Docker and CI/CD." },
  gcp: { name: "Google Cloud", closest: "His cloud experience is **AWS**: Lambda, S3 and Cognito." },
  "google cloud": { name: "Google Cloud", closest: "His cloud experience is **AWS**: Lambda, S3 and Cognito." },
  azure: { name: "Azure", closest: "His cloud experience is **AWS**: Lambda, S3 and Cognito." },
  typescript: { name: "TypeScript", closest: "His listed languages are **JavaScript (ES6+)**, Python, Dart and SQL." },
  golang: { name: "Go", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  rust: { name: "Rust", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  kotlin: { name: "Kotlin", closest: "For mobile he uses **Flutter/Dart** for iOS, Android and web from one codebase." },
  swift: { name: "Swift", closest: "For mobile he uses **Flutter/Dart** for iOS, Android and web from one codebase." },
  "react native": { name: "React Native", closest: "For mobile he uses **Flutter/Dart**; for web he uses **React.js**." },
  angular: { name: "Angular", closest: "His web front-end framework is **React.js** (with Redux and Hooks)." },
  vue: { name: "Vue", closest: "His web front-end framework is **React.js** (with Redux and Hooks)." },
  svelte: { name: "Svelte", closest: "His web front-end framework is **React.js** (with Redux and Hooks)." },
  "next.js": { name: "Next.js", closest: "His web front-end framework is **React.js**." },
  nextjs: { name: "Next.js", closest: "His web front-end framework is **React.js**." },
  django: { name: "Django", closest: "His Python web framework is **FastAPI**." },
  flask: { name: "Flask", closest: "His Python web framework is **FastAPI**." },
  spring: { name: "Spring", closest: "His backend frameworks are **Express.js** and **FastAPI**. Java appears only in his Code Analyzer parser work." },
  "c#": { name: "C#", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  ".net": { name: ".NET", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  php: { name: "PHP", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  ruby: { name: "Ruby", closest: "His backend languages are **JavaScript (Node.js)** and **Python (FastAPI)**." },
  rails: { name: "Ruby on Rails", closest: "His backend frameworks are **Express.js** and **FastAPI**." },
  graphql: { name: "GraphQL", closest: "His API work is **REST**: auth, catalog, ordering and partner management on GoodieBag." },
  kafka: { name: "Kafka", closest: "Related experience: **webhooks**, **background jobs** and **async processing**." },
  rabbitmq: { name: "RabbitMQ", closest: "Related experience: **webhooks**, **background jobs** and **async processing**." },
  redis: { name: "Redis", closest: "His listed databases are **PostgreSQL** and **MongoDB**." },
  mysql: { name: "MySQL", closest: "His listed databases are **PostgreSQL** and **MongoDB** (plus SQL data layers)." },
  dynamodb: { name: "DynamoDB", closest: "His listed databases are **PostgreSQL** and **MongoDB**; on AWS he's used Lambda, S3 and Cognito." },
  elasticsearch: { name: "Elasticsearch", closest: "His listed databases are **PostgreSQL** and **MongoDB**." },
  openai: { name: "OpenAI", closest: "His LLM experience is with the **Anthropic Claude API**, including an AI chatbot service." },
  gpt: { name: "OpenAI GPT models", closest: "His LLM experience is with the **Anthropic Claude API**, including an AI chatbot service." },
  chatgpt: { name: "ChatGPT", closest: "His LLM experience is with the **Anthropic Claude API**; his AI coding tools are Claude Code and GitHub Copilot." },
  langchain: { name: "LangChain", closest: "His LLM work uses the **Anthropic Claude API** directly; RAG and MCP are listed skills." },
  tensorflow: { name: "TensorFlow", closest: "His AI work is **LLM integration** with the Anthropic Claude API rather than model training." },
  pytorch: { name: "PyTorch", closest: "His AI work is **LLM integration** with the Anthropic Claude API rather than model training." },
  jest: { name: "Jest", closest: "His testing experience: authoring and validating **test cases** and tracking defects in **TestRail**." },
  cypress: { name: "Cypress", closest: "His testing experience: authoring and validating **test cases** and tracking defects in **TestRail**." },
  selenium: { name: "Selenium", closest: "His testing experience: authoring and validating **test cases** and tracking defects in **TestRail**." },
  jenkins: { name: "Jenkins", closest: "He runs releases through **CI/CD** pipelines; **GitHub Actions** is listed in his skills." },
  "c++": { name: "C++", closest: "His languages are JavaScript (ES6+), Python, Dart and SQL; Java appears in the Code Analyzer project." },
  blockchain: { name: "blockchain", closest: "His work centres on backend, integrations, mobile, cloud and LLM features." },
  solidity: { name: "Solidity", closest: "His work centres on backend, integrations, mobile, cloud and LLM features." },
  unity: { name: "Unity", closest: "His work centres on backend, integrations, mobile, cloud and LLM features." },
};

// ---------------------------------------------------------------------------
// General technical explanations (clearly labelled as general knowledge)
// ---------------------------------------------------------------------------

const concepts: Record<string, { general: string; personal: string }> = {
  webhook: {
    general: "a webhook is an HTTP callback: when something changes in one system, it sends a request to a URL you provide, so the receiver learns about the change immediately instead of polling for it.",
    personal: "Abhishek built **webhook-based catalog and inventory sync** between Square/Clover POS and GoodieBag, and handled **Stripe payment webhooks**.",
  },
  index: {
    general: "a database index is a data structure (commonly a B-tree) that lets the database find rows without scanning the whole table, speeding up reads at a small cost to writes and storage.",
    personal: "On GoodieBag, **optimizing PostgreSQL queries and adding targeted indexes** improved API response time by 40%.",
  },
  "rest api": {
    general: "a REST API exposes resources over HTTP with standard methods (GET, POST, PUT, DELETE), usually exchanging JSON, and keeps each request stateless.",
    personal: "Abhishek built GoodieBag's **REST APIs** for authentication, catalog, ordering and partner management.",
  },
  jwt: {
    general: "a JSON Web Token (JWT) is a signed token carrying claims about a user, which services can verify without a session lookup. It's commonly used for API authentication.",
    personal: "He applied **JWT authentication across services** on GoodieBag.",
  },
  microservices: {
    general: "microservices split an application into small, independently deployable services that communicate over APIs.",
    personal: "On GoodieBag, a Python/FastAPI **AI chatbot service** runs alongside the core Node.js/Express.js backend.",
  },
  serverless: {
    general: "serverless means running code as managed functions (like AWS Lambda) that scale automatically and bill per execution, without managing servers.",
    personal: "He wrote **AWS Lambda** functions in Python and Node.js for file handling and background jobs.",
  },
  rag: {
    general: "Retrieval-Augmented Generation (RAG) retrieves relevant documents and passes them to an LLM as context, so answers are grounded in that data.",
    personal: "**RAG** is listed among his AI & LLM skills, alongside prompt engineering and structured outputs.",
  },
  mcp: {
    general: "the Model Context Protocol (MCP) is an open protocol for connecting LLM applications to external tools and data sources in a standard way.",
    personal: "He holds the **Introduction to Model Context Protocol** certification from Claude Academy, and MCP is listed in his skills.",
  },
  ast: {
    general: "an Abstract Syntax Tree (AST) is a tree representation of source code's structure, produced by a parser. Static analysis tools traverse it to detect patterns.",
    personal: "On Code Analyzer he worked on the **parser and AST layer**, extending grammar support and fixing false positives through AST traversal.",
  },
  flutter: {
    general: "Flutter is Google's UI toolkit for building apps for mobile, web and desktop from a single Dart codebase.",
    personal: "He developed GoodieBag's full **Flutter** app for iOS, Android and web.",
  },
  fastapi: {
    general: "FastAPI is a modern Python web framework for building APIs, with type-hint-based validation and async support.",
    personal: "He built GoodieBag's **AI chatbot service** with Python and FastAPI.",
  },
  docker: {
    general: "Docker packages an application and its dependencies into a container image, so it runs the same way in every environment.",
    personal: "He packages services with **Docker** and runs releases through CI/CD pipelines.",
  },
};

const conceptAliases: Record<string, string> = {
  webhook: "webhook", webhooks: "webhook", index: "index", indexes: "index", indexing: "index", "database index": "index",
  rest: "rest api", "rest api": "rest api", "restful": "rest api", jwt: "jwt", "json web token": "jwt",
  microservices: "microservices", microservice: "microservices", serverless: "serverless", rag: "rag",
  "retrieval augmented generation": "rag", mcp: "mcp", "model context protocol": "mcp", ast: "ast",
  "abstract syntax tree": "ast", flutter: "flutter", fastapi: "fastapi", docker: "docker",
};

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9.+#/\-\s]/g, " ")
    .replace(/(\w)[.](\s|$)/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const patternCache = new Map<string, RegExp>();
function has(text: string, keyword: string) {
  let pattern = patternCache.get(keyword);
  if (!pattern) {
    pattern = new RegExp(`(^|[\\s/(-])${escapeRegExp(keyword)}(?=$|[\\s/?!,)-]|s\\b)`);
    patternCache.set(keyword, pattern);
  }
  return pattern.test(text);
}

function scoreTopics(text: string) {
  return topics
    .map((topic) => ({
      topic,
      score: Object.entries(topic.keywords).reduce((sum, [kw, weight]) => sum + (has(text, kw) ? weight : 0), 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

const FOLLOW_UP = /^\s*(tell me more|more|more details?|go on|elaborate|details|go deeper|what else|and\??|continue|expand)\b/;
const GREETING = /^\s*(hi|hello|hey|hiya|good (morning|afternoon|evening)|namaste|yo)\b[\s!.?]*$/;
const THANKS = /\b(thanks|thank you|thx|cheers|appreciate)\b/;
const ABOUT_BOT = /\b(who are you|what are you|are you (an? )?(ai|bot|human|real|chatgpt|gpt)|how do you work|are you abhishek)\b/;
const TEAM_SIZE = /\bhow (big|large|many)\b[^?]*\b(team|teams|developers|engineers)\b|\bteam\b[^?]*\b(size|headcount)\b/;
const OFF_TOPIC_TASK = /\b(write|compose|generate|translate|summarize|summarise|joke|poem|story|essay|song|weather|news|recipe|homework|solve)\b/;
const DEFINITION = /\b(what is|what are|what s|whats|explain|define|meaning of|how does|how do)\b/;

const suggestionLine =
  "Try asking about his **specialization**, **GoodieBag**, **POS integrations**, **AWS**, **AI experience**, **Code Analyzer**, or **how to contact him**.";

function previousTopic(history: ChatMessage[]): Topic | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.role !== "user") continue;
    const text = normalize(msg.content);
    if (FOLLOW_UP.test(text)) continue;
    return scoreTopics(text)[0]?.topic ?? null;
  }
  return null;
}

/**
 * Answers a visitor question. `history` holds earlier turns (excluding the
 * current question) and is used only to resolve "tell me more" follow-ups.
 */
export function answerQuestion(question: string, history: ChatMessage[] = []): string {
  const text = normalize(question);

  if (!text.trim()) return suggestionLine;
  if (GREETING.test(text)) {
    return `Hi! I answer questions about Abhishek's experience, projects and skills, using only what's in his portfolio. ${suggestionLine}`;
  }
  if (ABOUT_BOT.test(text)) {
    return "I'm the assistant on Abhishek's portfolio. I don't call an AI model: I match your question against a knowledge base built from his resume and portfolio, so everything I say comes from there. For anything else, [contact him directly](/#contact).";
  }

  const ranked = scoreTopics(text);

  if (FOLLOW_UP.test(text)) {
    const topic = ranked[0]?.topic ?? previousTopic(history);
    if (topic) {
      const { more, short } = topic.answer();
      return more ?? `That's everything the portfolio covers on this topic:\n\n${short}`;
    }
  }

  // Deliberately unavailable information (salary, notice period, …).
  const unavailableHit =
    Object.keys(unavailable)
      .sort((a, b) => b.length - a.length)
      .find((kw) => has(text, kw)) ?? (TEAM_SIZE.test(text) ? "team size" : undefined);
  if (unavailableHit) {
    const notCovered = `${NOT_AVAILABLE} It doesn't cover ${unavailable[unavailableHit]}.`;
    if (ranked.length > 0 && ranked[0].score >= 6) {
      return `${notCovered}\n\nHere's what it does say:\n\n${ranked[0].topic.answer().short}`;
    }
    return `${notCovered} The best way to ask is to [contact him directly](/#contact) at ${profile.email}.`;
  }

  // Technologies the portfolio doesn't list: say so, then the closest real experience
  // (or the strongly matched topic when the question also names one).
  const unlistedHit = Object.keys(unlistedTech)
    .sort((a, b) => b.length - a.length)
    .find((kw) => has(text, kw));
  if (unlistedHit) {
    const tech = unlistedTech[unlistedHit];
    const notListed = `${NOT_AVAILABLE} ${tech.name} isn't listed in his experience or skills.`;
    if (ranked.length > 0 && ranked[0].score >= 6) return `${notListed}\n\n${ranked[0].topic.answer().short}`;
    return `${notListed}\n\nClosest related experience: ${tech.closest}`;
  }

  // General "what is X" questions: general knowledge, clearly labelled, then his experience.
  if (DEFINITION.test(text)) {
    const aliasHit = Object.keys(conceptAliases)
      .sort((a, b) => b.length - a.length)
      .find((alias) => has(text, alias));
    const mentionsAbhishek = /\b(abhishek|abhisheks|he|his|him)\b/.test(text);
    if (aliasHit && !mentionsAbhishek) {
      const concept = concepts[conceptAliases[aliasHit]];
      return `**General knowledge:** In general, ${concept.general}\n\n**Abhishek's experience:** ${concept.personal}`;
    }
  }

  if (ranked.length > 0) {
    const [best, second] = ranked;
    const primary = best.topic.answer().short;
    // Two clearly distinct, strongly matched topics (e.g. "AWS and Flutter") get both answers.
    if (second && second.score >= 5 && second.score >= best.score * 0.8 && second.topic.id !== best.topic.id) {
      return `${primary}\n\n${second.topic.answer().short}`;
    }
    return primary;
  }

  if (THANKS.test(text)) {
    return "You're welcome! Anything else you'd like to know about Abhishek's work?";
  }

  if (OFF_TOPIC_TASK.test(text)) {
    return `That's outside what I can help with. I only answer questions about Abhishek's experience, projects and skills. ${suggestionLine}`;
  }

  return `${NOT_AVAILABLE} I can help with his experience, projects, skills, certifications and contact details. ${suggestionLine}`;
}
