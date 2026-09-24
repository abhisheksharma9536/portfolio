export type EngineeringTopic = {
  id: string;
  title: string;
  /** How Abhishek approaches the area — grounded in the work described. */
  body: string;
  /** Concrete, resume-backed evidence. */
  evidence: string[];
  tags: string[];
};

export const engineeringTopics: EngineeringTopic[] = [
  {
    id: "backend",
    title: "Backend architecture",
    body: "Services with clear responsibilities, connected by APIs. GoodieBag runs on a core Node.js/Express.js backend, and its AI chatbot runs as a separate Python/FastAPI service that integrates with both the backend and the app.",
    evidence: [
      "Core Node.js/Express.js backend for a 200K+ user marketplace",
      "Python/FastAPI AI service alongside it",
    ],
    tags: ["Node.js", "Express.js", "FastAPI", "Microservices"],
  },
  {
    id: "api",
    title: "API design & reliability",
    body: "REST APIs organized around the product's domains — authentication, catalog, ordering, partner management — with validation middleware, structured error handling and JWT authentication applied consistently across services.",
    evidence: [
      "GoodieBag REST APIs for four core domains",
      "Secure REST APIs for clinical workflows on Avery Telehealth",
    ],
    tags: ["REST", "JWT", "RBAC", "Validation"],
  },
  {
    id: "database",
    title: "Database performance",
    body: "Performance work that starts at the data layer. On GoodieBag, optimizing PostgreSQL queries and adding targeted indexes for high-concurrency load improved API response time by 40%.",
    evidence: ["40% API response-time improvement on GoodieBag"],
    tags: ["PostgreSQL", "Query optimization", "Indexing", "Data modeling"],
  },
  {
    id: "integrations",
    title: "Integrations & webhooks",
    body: "Treating third-party systems as part of the product. Square and Clover POS integrations with webhook-based sync let partners manage locations, catalog, inventory and orders from their existing POS; Stripe covers checkout, payment webhooks, refunds, failures and payouts.",
    evidence: [
      "~90% less partner operational effort on GoodieBag",
      "Real-time catalog and inventory sync",
    ],
    tags: ["Square", "Clover", "Stripe", "Webhooks"],
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    body: "Serverless where it fits, and automated, repeatable releases. AWS Lambda functions in Python and Node.js handle file processing and background jobs, S3 stores media, Cognito handles authentication — and services ship in Docker through CI/CD pipelines.",
    evidence: [
      "Lambda, S3 and Cognito on GoodieBag",
      "Docker + CI/CD for automated, consistent releases",
    ],
    tags: ["AWS Lambda", "S3", "Cognito", "Docker", "CI/CD"],
  },
  {
    id: "ai",
    title: "AI & LLM integration",
    body: "LLM features built as real services, not demos. The GoodieBag chatbot is a FastAPI service on the Anthropic Claude API, wired into the backend and the app to answer customer and partner queries. The assistant on this site follows the same principle: server-side Claude API calls, grounded in a structured knowledge base.",
    evidence: [
      "AI chatbot service for customer and partner queries",
      "Three Claude Academy certifications (2026)",
    ],
    tags: ["Claude API", "Prompt engineering", "Structured outputs", "MCP"],
  },
  {
    id: "mobile",
    title: "Cross-platform mobile",
    body: "One Flutter codebase for iOS, Android and web — reusable widgets and state management, covering the full journey from store discovery to order tracking.",
    evidence: ["The complete GoodieBag app on three platforms"],
    tags: ["Flutter", "Dart", "State management"],
  },
  {
    id: "quality",
    title: "Quality & correctness",
    body: "Correctness at every layer: form validation, error handling and logging for healthcare data on Avery Telehealth; AST-level fixes for false-positive detections on Code Analyzer; test cases and TestRail defect tracking for release quality.",
    evidence: [
      "False-positive fixes for enterprise customers",
      "Healthcare data-handling requirements",
    ],
    tags: ["Validation", "Logging", "ASTs", "TestRail"],
  },
];
