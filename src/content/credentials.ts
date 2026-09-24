/** Certifications, achievements and education — exactly as listed on the resume. */

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  /** Verification URL taken from the resume PDF's own "Verify" links. */
  verifyUrl: string;
};

export const certifications: Certification[] = [
  {
    name: "Building with the Claude API",
    issuer: "Claude Academy",
    year: "2026",
    verifyUrl:
      "https://academy.claude.com/verify/fdeddc08e5e8906bda385c856830e6ce",
  },
  {
    name: "Claude Code in Action",
    issuer: "Claude Academy",
    year: "2026",
    verifyUrl:
      "https://academy.claude.com/verify/18feac9c1af7132f90946ad006e56790",
  },
  {
    name: "Introduction to Model Context Protocol",
    issuer: "Claude Academy",
    year: "2026",
    verifyUrl:
      "https://academy.claude.com/verify/efad60f1fb182ec93944835eacce9c1b",
  },
];

export type Achievement = {
  title: string;
  detail: string;
  period: string;
  highlight: string;
};

export const achievements: Achievement[] = [
  {
    title: "Star Performer Award",
    highlight: "4 consecutive years",
    period: "2022–23 to 2025–26",
    detail: "Recognized for consistent delivery and technical contribution.",
  },
  {
    title: "Codekaze 2022",
    highlight: "All India Rank 79",
    period: "2022",
    detail: "National competitive coding contest.",
  },
];

export const education = {
  institution: "RD Engineering College, Ghaziabad",
  degree: "B.Tech",
  field: "Computer Science & Engineering",
  period: "2019 – 2023",
  cgpa: "8.86 / 10",
};
