import { assistantProvider } from "@/lib/deployment";

const usesAi = assistantProvider === "claude";

export const assistantCopy = {
  name: "Ask Abhishek",
  subtitle: "Ask me about my experience, projects & engineering work.",
  /** Only the Claude-backed variant is described as AI. */
  isAi: usesAi,
  intro: usesAi
    ? "I'm an AI assistant that answers questions about Abhishek's experience, projects and skills, using only what's in his portfolio."
    : "I answer questions about Abhishek's experience, projects and skills, using only what's in his portfolio.",
  disclaimer: usesAi
    ? "AI-generated from Abhishek's portfolio. Can make mistakes."
    : "Answers come only from Abhishek's portfolio content.",
};

export const suggestedQuestions = [
  "What does Abhishek specialize in?",
  "Tell me about GoodieBag.",
  "How did Abhishek improve API performance?",
  "What POS systems has he integrated?",
  "What AI experience does Abhishek have?",
  "Has Abhishek worked with AWS?",
  "What mobile platforms has he developed for?",
  "Tell me about the Code Analyzer project.",
  "What is Abhishek's PostgreSQL experience?",
  "What technologies does Abhishek use?",
];
