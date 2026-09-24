export type Metric = {
  /** Numeric part used for the count-up animation. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Use thousands separators when rendering (2,000). */
  grouped?: boolean;
  label: string;
  /** Where the number comes from — every metric is scoped, never career-wide unless it is. */
  context: string;
  scope: "Career" | "GoodieBag" | "Code Analyzer";
};

/** The only metrics used anywhere on the site. All from the resume. */
export const metrics: Metric[] = [
  {
    value: 4,
    suffix: "+",
    label: "Years of production engineering",
    context: "Building and shipping software at XORLABS since July 2022.",
    scope: "Career",
  },
  {
    value: 200,
    suffix: "K+",
    label: "Users served",
    context: "Scale of the GoodieBag marketplace whose backend and app I built.",
    scope: "GoodieBag",
  },
  {
    value: 2000,
    suffix: "+",
    grouped: true,
    label: "Restaurant partners",
    context: "GoodieBag partners managing their stores through POS integrations.",
    scope: "GoodieBag",
  },
  {
    value: 40,
    suffix: "%",
    label: "API response-time improvement",
    context: "From PostgreSQL query optimization and targeted indexing on GoodieBag.",
    scope: "GoodieBag",
  },
  {
    value: 90,
    prefix: "~",
    suffix: "%",
    label: "Less partner operational effort",
    context: "After integrating Square and Clover POS into GoodieBag.",
    scope: "GoodieBag",
  },
  {
    value: 30,
    suffix: "+",
    label: "Languages supported",
    context: "By the Code Analyzer platform, where I worked on the parser and AST layer.",
    scope: "Code Analyzer",
  },
];
