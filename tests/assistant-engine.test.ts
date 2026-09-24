import { test } from "node:test";
import assert from "node:assert/strict";
import { answerQuestion, NOT_AVAILABLE } from "@/lib/assistant/engine";
import { suggestedQuestions } from "@/content/assistant";

/** Section ids and routes that exist on the site; every link the engine emits must target one. */
const knownTargets = new Set([
  "/", "/#about", "/#experience", "/#projects", "/#engineering", "/#skills", "/#achievements", "/#contact",
  "/#avery-telehealth", "/#code-analyzer", "/work/goodiebag",
  ...["architecture", "backend", "performance", "pos", "webhooks", "ai", "mobile", "payments", "aws", "engagement"].map(
    (id) => `/work/goodiebag#${id}`,
  ),
]);

function links(answer: string) {
  return [...answer.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
}

test("every suggested question gets a real answer", () => {
  for (const question of suggestedQuestions) {
    const answer = answerQuestion(question);
    assert.ok(!answer.startsWith(NOT_AVAILABLE), `no answer for: ${question}`);
    assert.ok(answer.length > 80, `answer too thin for: ${question}`);
  }
});

test("answers the core recruiter questions with the right facts", () => {
  assert.match(answerQuestion("What POS systems has he integrated?"), /Square POS[\s\S]*Clover POS/);
  assert.match(answerQuestion("How did Abhishek improve API performance?"), /40%[\s\S]*PostgreSQL/);
  assert.match(answerQuestion("What mobile platforms has he developed for?"), /iOS, Android and web/);
  assert.match(answerQuestion("Tell me about the Code Analyzer project."), /30\+ programming languages/);
  assert.match(answerQuestion("What's his CGPA?"), /8\.86 \/ 10/);
  assert.match(answerQuestion("Any awards?"), /All India Rank 79/);
});

test("keeps GoodieBag metrics in their GoodieBag context", () => {
  for (const question of suggestedQuestions) {
    const answer = answerQuestion(question);
    if (answer.includes("200K+")) assert.match(answer, /GoodieBag/, question);
  }
});

test("says so when information isn't in the portfolio", () => {
  for (const question of [
    "What's his expected salary?",
    "What is his notice period?",
    "Is he open to work?",
    "How big is the GoodieBag team?",
    "Is he willing to relocate?",
  ]) {
    assert.ok(answerQuestion(question).startsWith(NOT_AVAILABLE), question);
  }
});

test("never claims technologies the portfolio doesn't list", () => {
  for (const [question, tech] of [
    ["Does he know Kubernetes?", "Kubernetes"],
    ["Does he use TypeScript?", "TypeScript"],
    ["Has he used GraphQL?", "GraphQL"],
    ["Any experience with Google Cloud?", "Google Cloud"],
    ["Has he worked with OpenAI?", "OpenAI"],
  ] as const) {
    const answer = answerQuestion(question);
    assert.ok(answer.startsWith(NOT_AVAILABLE), question);
    assert.match(answer, new RegExp(`${tech} isn't listed`));
  }
  // A listed technology in the same question is still answered.
  assert.match(answerQuestion("Does he know Kubernetes and Docker?"), /packages services with \*\*Docker\*\*/);
});

test("labels general technical knowledge separately from his experience", () => {
  const answer = answerQuestion("What is a webhook?");
  assert.match(answer, /^\*\*General knowledge:\*\* In general/);
  assert.match(answer, /\*\*Abhishek's experience:\*\*/);
  // Questions about him are not treated as general definitions.
  assert.doesNotMatch(answerQuestion("What is Abhishek's PostgreSQL experience?"), /General knowledge/);
});

test("follows up on the previous topic", () => {
  const first = "Tell me about GoodieBag.";
  const history = [
    { role: "user" as const, content: first },
    { role: "assistant" as const, content: answerQuestion(first) },
  ];
  const more = answerQuestion("tell me more", history);
  assert.notEqual(more, answerQuestion(first));
  assert.match(more, /GoodieBag|Stripe|Lambda/);
});

test("declines unrelated tasks and handles small talk", () => {
  assert.match(answerQuestion("Can you write me a poem?"), /outside what I can help with/);
  assert.match(answerQuestion("hello"), /^Hi!/);
  assert.match(answerQuestion("Are you ChatGPT?"), /don't call an AI model/);
});

test("only links to sections and pages that exist", () => {
  const questions = [
    ...suggestedQuestions,
    "How can I contact him?", "Resume?", "Tell me about Avery Telehealth", "Stripe?", "Any awards?",
    "What is his experience?", "Analytics?", "tell me more",
  ];
  for (const question of questions) {
    for (const href of links(answerQuestion(question))) {
      if (/^(https:|mailto:)/.test(href) || href.endsWith(".pdf")) continue;
      assert.ok(knownTargets.has(href), `unknown link ${href} in answer to: ${question}`);
    }
  }
});
