import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Abhishek Sharma — Full Stack Developer: backend, cloud and AI";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Full Stack Developer · 4+ years",
    title: "Abhishek Sharma",
    accent: "Production web, mobile, backend & AI systems.",
    facts: ["Node.js · Python/FastAPI", "PostgreSQL · AWS", "Flutter · React", "Claude API", "GoodieBag: 200K+ users"],
  });
}
