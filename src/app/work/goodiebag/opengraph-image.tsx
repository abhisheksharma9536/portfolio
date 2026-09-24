import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "GoodieBag case study by Abhishek Sharma — surplus food marketplace on iOS, Android and web";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Case study · Abhishek Sharma",
    title: "GoodieBag",
    accent: "The backend, integrations and AI behind a marketplace.",
    facts: ["200K+ users", "2,000+ restaurant partners", "40% API response-time gain", "Square & Clover POS", "Claude API"],
  });
}
