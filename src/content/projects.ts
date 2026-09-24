export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  period: string;
  platforms?: string[];
  summary: string;
  /** Resume bullets, lightly rephrased — no added claims. */
  contributions: string[];
  stack: string[];
  metrics?: ProjectMetric[];
  href?: string;
};

export const goodiebag: Project = {
  slug: "goodiebag",
  name: "GoodieBag",
  tagline: "Surplus food marketplace",
  period: "2023 – Present",
  platforms: ["iOS", "Android", "Web"],
  summary:
    "A surplus food marketplace for customers and restaurant partners on iOS, Android and web. I built and maintain its core Node.js/Express.js backend, developed the Flutter app, integrated Square and Clover POS with webhook-based sync, integrated Stripe, and built an AI chatbot service on the Anthropic Claude API.",
  contributions: [
    "Built and maintained the core Node.js/Express.js backend for a marketplace serving 200K+ users, with REST APIs for authentication, catalog, ordering and partner management.",
    "Improved API response time by 40% by optimizing PostgreSQL queries and adding targeted indexes for high-concurrency load.",
    "Integrated Square and Clover POS systems so 2,000+ restaurant partners manage locations, catalog, inventory and orders from their existing POS — reducing partner operational effort by nearly 90% and driving new partner acquisition.",
    "Built webhook-based catalog and inventory sync to keep data consistent across POS systems, backend and storefront in real time.",
    "Built an AI chatbot service in Python and FastAPI using the Anthropic Claude API, integrated with the Node.js backend and the Flutter app to handle customer and partner queries.",
    "Developed the full Flutter app across 3 platforms (iOS, Android and web) from a single codebase, covering reusable widgets, state management and the complete flow from store discovery to order tracking.",
    "Integrated Stripe for payments and partner payouts, including checkout, payment webhooks, refunds and failure handling.",
    "Wrote AWS Lambda functions in Python and Node.js for file handling and background jobs, using S3 for media storage and Cognito for authentication.",
    "Added PostHog analytics and set up push notifications with Firebase Cloud Messaging and lifecycle campaigns with Customer.io.",
    "Improved API reliability with validation middleware, structured error handling and JWT authentication across services.",
  ],
  stack: [
    "Node.js",
    "Express.js",
    "Flutter",
    "Dart",
    "Python",
    "FastAPI",
    "Anthropic Claude API",
    "PostgreSQL",
    "AWS S3",
    "AWS Lambda",
    "AWS Cognito",
    "Stripe",
    "Firebase",
    "Customer.io",
    "Docker",
  ],
  metrics: [
    { value: "200K+", label: "users served" },
    { value: "2,000+", label: "restaurant partners" },
    { value: "40%", label: "API response-time improvement" },
    { value: "~90%", label: "less partner operational effort" },
  ],
  href: "/work/goodiebag",
};

export const averyTelehealth: Project = {
  slug: "avery-telehealth",
  name: "Avery Telehealth",
  tagline: "Enterprise telehealth & patient management platform",
  period: "2023",
  summary:
    "Responsive React.js portals for providers and patients, built on secure REST APIs for clinical workflows.",
  contributions: [
    "Built responsive React.js portals for providers and patients with reusable components, Redux state management and role-based access control.",
    "Worked with secure REST APIs for clinical workflows including patient records, appointment scheduling and provider management.",
    "Added form validation, error handling and logging to meet healthcare data handling requirements.",
  ],
  stack: [
    "React.js",
    "Redux",
    "Node.js",
    "Express.js",
    "REST APIs",
    "MongoDB",
    "AWS",
  ],
};

export const codeAnalyzer: Project = {
  slug: "code-analyzer",
  name: "Code Analyzer",
  tagline: "Static code analysis SaaS platform",
  period: "2022 – 2023",
  summary:
    "A SaaS static code analysis platform supporting 30+ programming languages. My focus was the parser and Abstract Syntax Tree (AST) layer behind the detection engine.",
  contributions: [
    "Worked on the parser and Abstract Syntax Tree (AST) layer behind the detection engine of a platform supporting 30+ programming languages.",
    "Extended language grammar and AST handling to support newer language constructs, increasing rule coverage.",
    "Fixed false-positive detections through AST traversal and pattern-matching changes, improving analysis reliability for enterprise customers.",
  ],
  stack: [
    "Java",
    "Parsers",
    "Abstract Syntax Trees (AST)",
    "Rule Engine",
    "SQL",
    "Git",
  ],
  metrics: [{ value: "30+", label: "programming languages supported" }],
};

export const projects = [goodiebag, averyTelehealth, codeAnalyzer];
