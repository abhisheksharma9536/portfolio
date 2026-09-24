export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  /** ISO-ish dates used for <time> elements and ordering. */
  startDate: string;
  endDate: string | null;
  summary: string;
  /** Always-visible highlights. */
  highlights: string[];
  /** Revealed on demand (progressive disclosure). */
  details: string[];
  stack: string[];
};

/** Newest first. Sourced from the "Professional Experience" section of the resume. */
export const roles: Role[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    company: "XORLABS",
    location: "Greater Noida, IN",
    start: "July 2023",
    end: "Present",
    startDate: "2023-07",
    endDate: null,
    summary:
      "Production engineering for clients in the food-marketplace, healthcare and developer-tooling domains.",
    highlights: [
      "Develop production features end to end across Node.js/Express.js, Python/FastAPI, Flutter and React.js.",
      "Handle backend services, cross-platform mobile apps and third-party integrations from requirement analysis through release and production support.",
      "Work directly with clients on requirement gathering, scoping, demos and release planning.",
    ],
    details: [
      "Package services with Docker and run releases through CI/CD pipelines, keeping builds automated and environments consistent.",
      "Use AI coding tools (Claude Code, GitHub Copilot) in day-to-day development to build features faster and speed up refactoring and debugging.",
      "Collaborate with cross-functional teams in Agile/Scrum.",
    ],
    stack: [
      "Node.js",
      "Express.js",
      "Python",
      "FastAPI",
      "Flutter",
      "React.js",
      "Docker",
      "CI/CD",
    ],
  },
  {
    id: "junior-software-engineer",
    title: "Junior Software Engineer",
    company: "XORLABS",
    location: "Greater Noida, IN",
    start: "July 2022",
    end: "June 2023",
    startDate: "2022-07",
    endDate: "2023-06",
    summary:
      "Contributed to enterprise developer-tooling products within an established codebase.",
    highlights: [
      "Worked on parsing components and SQL data layers for enterprise developer-tooling products.",
      "Authored and validated test cases across multi-language codebases.",
    ],
    details: [
      "Tracked defects in TestRail, improving release quality.",
    ],
    stack: ["Parsers", "SQL", "Test cases", "TestRail"],
  },
];
