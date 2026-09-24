/**
 * GoodieBag case-study content. Everything here is derived from the resume's
 * GoodieBag bullets; where the page frames a "problem" or "challenge", it is
 * the engineering need implied by that work (e.g. "keep POS, backend and
 * storefront consistent in real time"), not an invented story.
 */

export type ArchNodeKind = "core" | "service" | "data" | "external";

export type ArchNode = {
  id: string;
  label: string;
  sub: string;
  kind: ArchNodeKind;
  /** Position in the 1000 x 620 diagram coordinate space (node centre). */
  x: number;
  y: number;
  /** Mobile grouping. */
  group: "Clients" | "Platform" | "Data & cloud" | "Integrations";
  description: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

export const architectureNodes: ArchNode[] = [
  {
    id: "users",
    label: "Customers & partners",
    sub: "200K+ users",
    kind: "core",
    x: 500,
    y: 48,
    group: "Clients",
    description:
      "GoodieBag serves 200K+ users and 2,000+ restaurant partners across iOS, Android and web.",
  },
  {
    id: "app",
    label: "Flutter app",
    sub: "iOS · Android · Web",
    kind: "core",
    x: 500,
    y: 158,
    group: "Clients",
    description:
      "One Flutter codebase for iOS, Android and web — reusable widgets, state management and the complete flow from store discovery to order tracking.",
  },
  {
    id: "api",
    label: "REST API layer",
    sub: "REST · JWT · validation",
    kind: "core",
    x: 500,
    y: 268,
    group: "Platform",
    description:
      "REST APIs for authentication, catalog, ordering and partner management, with validation middleware, structured error handling and JWT authentication across services.",
  },
  {
    id: "backend",
    label: "Node.js / Express.js",
    sub: "Core backend",
    kind: "service",
    x: 500,
    y: 378,
    group: "Platform",
    description:
      "The core marketplace backend I built and maintain. POS webhooks, Stripe payments and the AI chatbot service all integrate here.",
  },
  {
    id: "ai",
    label: "AI chatbot service",
    sub: "Python · FastAPI",
    kind: "service",
    x: 800,
    y: 378,
    group: "Platform",
    description:
      "A Python/FastAPI service using the Anthropic Claude API, integrated with the Node.js backend and the Flutter app to handle customer and partner queries.",
  },
  {
    id: "db",
    label: "PostgreSQL",
    sub: "Queries · indexes",
    kind: "data",
    x: 390,
    y: 500,
    group: "Data & cloud",
    description:
      "Optimizing PostgreSQL queries and adding targeted indexes for high-concurrency load improved API response time by 40%.",
  },
  {
    id: "aws",
    label: "AWS",
    sub: "Lambda · S3 · Cognito",
    kind: "data",
    x: 610,
    y: 500,
    group: "Data & cloud",
    description:
      "Lambda functions in Python and Node.js for file handling and background jobs, S3 for media storage and Cognito for authentication.",
  },
  {
    id: "square",
    label: "Square POS",
    sub: "Webhooks + API",
    kind: "external",
    x: 170,
    y: 318,
    group: "Integrations",
    description:
      "Partners manage locations, catalog, inventory and orders from their existing Square POS. Webhook-based sync keeps POS, backend and storefront consistent in real time.",
  },
  {
    id: "clover",
    label: "Clover POS",
    sub: "Webhooks + API",
    kind: "external",
    x: 170,
    y: 418,
    group: "Integrations",
    description:
      "The same partner workflow for Clover: locations, catalog, inventory and orders managed from the POS partners already use.",
  },
  {
    id: "stripe",
    label: "Stripe",
    sub: "Payments · payouts",
    kind: "external",
    x: 170,
    y: 208,
    group: "Integrations",
    description:
      "Payments and partner payouts — checkout, payment webhooks, refunds and failure handling.",
  },
  {
    id: "claude",
    label: "Claude API",
    sub: "Anthropic",
    kind: "external",
    x: 830,
    y: 500,
    group: "Integrations",
    description:
      "The Anthropic Claude API powers the chatbot service's answers to customer and partner queries.",
  },
  {
    id: "engagement",
    label: "FCM · Customer.io",
    sub: "Push · campaigns",
    kind: "external",
    x: 830,
    y: 238,
    group: "Integrations",
    description:
      "Push notifications with Firebase Cloud Messaging and lifecycle campaigns with Customer.io.",
  },
  {
    id: "posthog",
    label: "PostHog",
    sub: "Product analytics",
    kind: "external",
    x: 830,
    y: 118,
    group: "Integrations",
    description: "PostHog analytics added to the product.",
  },
];

export const architectureEdges: ArchEdge[] = [
  { from: "users", to: "app" },
  { from: "app", to: "api" },
  { from: "api", to: "backend" },
  { from: "backend", to: "db" },
  { from: "backend", to: "aws" },
  { from: "backend", to: "ai" },
  { from: "app", to: "ai" },
  { from: "ai", to: "claude" },
  { from: "square", to: "backend", label: "webhooks" },
  { from: "clover", to: "backend", label: "webhooks" },
  { from: "stripe", to: "backend" },
  { from: "app", to: "posthog" },
  { from: "app", to: "engagement" },
];

export type FlowStep = {
  id: string;
  label: string;
  sub: string;
  role: string;
};

/** POS → Webhook → Backend → Database → Storefront. */
export const webhookFlow: FlowStep[] = [
  {
    id: "pos",
    label: "POS",
    sub: "Square · Clover",
    role: "The partner's system of record. Partners keep managing locations, catalog, inventory and orders in the POS they already use — no second system to update by hand.",
  },
  {
    id: "webhook",
    label: "Webhook",
    sub: "Change event",
    role: "When catalog or inventory changes in the POS, the change is delivered to GoodieBag as a webhook instead of waiting for someone to re-enter it.",
  },
  {
    id: "backend",
    label: "Backend",
    sub: "Node.js · Express.js",
    role: "The backend receives the webhook and applies the catalog or inventory change to the marketplace's own data.",
  },
  {
    id: "database",
    label: "Database",
    sub: "PostgreSQL",
    role: "The synchronized catalog and inventory are stored in PostgreSQL — the same data the marketplace APIs serve.",
  },
  {
    id: "storefront",
    label: "Storefront",
    sub: "Flutter · iOS, Android, Web",
    role: "Customers see current catalog and inventory in the app, keeping POS, backend and storefront consistent in real time.",
  },
];

export type Challenge = {
  title: string;
  challenge: string;
  approach: string;
};

export const challenges: Challenge[] = [
  {
    title: "Data consistency across systems",
    challenge:
      "Catalog and inventory live in each partner's POS, in the backend and in the storefront. All three have to agree — in real time.",
    approach:
      "Webhook-based catalog and inventory sync between Square/Clover, the Node.js backend and the storefront.",
  },
  {
    title: "Performance under concurrency",
    challenge:
      "Marketplace APIs have to stay fast under high-concurrency load.",
    approach:
      "Optimized PostgreSQL queries and added targeted indexes — improving API response time by 40%.",
  },
  {
    title: "Money movement that fails safely",
    challenge:
      "Payments and partner payouts involve asynchronous events, refunds and failures that must all be handled correctly.",
    approach:
      "Stripe integration covering checkout, payment webhooks, refunds, failure handling and partner payouts.",
  },
  {
    title: "Three platforms, one team, one codebase",
    challenge:
      "Customers use iOS, Android and the web — maintaining three separate apps would multiply every change.",
    approach:
      "A single Flutter codebase with reusable widgets and state management across iOS, Android and web.",
  },
  {
    title: "AI that fits into the product",
    challenge:
      "A chatbot for both customers and partners has to plug into the existing backend and app, not live on its own.",
    approach:
      "A dedicated Python/FastAPI service on the Claude API, integrated with the Node.js backend and the Flutter app.",
  },
  {
    title: "Reliability across services",
    challenge:
      "Multiple services and clients depend on consistent validation, errors and authentication.",
    approach:
      "Validation middleware, structured error handling and JWT authentication across services.",
  },
];

export const posCapabilities = [
  { name: "Locations", note: "Partner locations managed from the POS" },
  { name: "Catalog", note: "Items synchronized via webhooks" },
  { name: "Inventory", note: "Stock kept consistent in real time" },
  { name: "Orders", note: "Orders managed from the existing POS" },
];

export const paymentCapabilities = [
  "Checkout",
  "Payment webhooks",
  "Refunds",
  "Failure handling",
  "Partner payouts",
];

export const awsServices = [
  {
    name: "AWS Lambda",
    role: "Functions in Python and Node.js for file handling and background jobs.",
  },
  { name: "Amazon S3", role: "Media storage." },
  { name: "Amazon Cognito", role: "Authentication." },
];

export const engagementTools = [
  { name: "PostHog", role: "Product analytics" },
  { name: "Firebase Cloud Messaging", role: "Push notifications" },
  { name: "Customer.io", role: "Lifecycle campaigns" },
];

export const apiDomains = [
  "Authentication",
  "Catalog",
  "Ordering",
  "Partner management",
];

/**
 * GoodieBag contributions grouped by area. Indexes point into
 * `goodiebag.contributions` so the wording lives in one place.
 */
export const contributionAreas: Array<{ area: string; items: number[] }> = [
  { area: "Backend & APIs", items: [0, 9] },
  { area: "Performance", items: [1] },
  { area: "POS & payments", items: [2, 3, 6] },
  { area: "AI", items: [4] },
  { area: "Mobile", items: [5] },
  { area: "Cloud, analytics & engagement", items: [7, 8] },
];
