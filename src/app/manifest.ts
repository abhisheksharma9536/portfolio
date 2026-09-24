import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: "Abhishek Sharma",
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#f6f6f2",
    theme_color: "#0c0c0f",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
