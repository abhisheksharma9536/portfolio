import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Content Security Policy. Next.js hydration data, the pre-paint theme script
 * and JSON-LD are inline, so scripts need 'unsafe-inline' (a nonce-based CSP
 * would force every page to render dynamically). Everything else is locked to
 * this origin. vercel.live is allowed so Vercel's preview toolbar works.
 */
function contentSecurityPolicy(isDev: boolean) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://vercel.live https://vercel.com",
    "font-src 'self' data: https://vercel.live https://assets.vercel.com",
    `connect-src 'self' https://vercel.live wss://ws-us3.pusher.com${isDev ? " ws: wss:" : ""}`,
    "frame-src https://vercel.live",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

function securityHeaders(isDev: boolean) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(isDev) },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
  ];
}

/**
 * `phase` distinguishes `next dev` from `next build` / `next start`;
 * NODE_ENV isn't reliable yet when the config is evaluated.
 */
export default function config(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    poweredByHeader: false,
    reactStrictMode: true,
    async headers() {
      return [
        { source: "/:path*", headers: securityHeaders(isDev) },
        {
          source: "/Abhishek-Sharma-Resume.pdf",
          headers: [
            { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
            { key: "Content-Type", value: "application/pdf" },
          ],
        },
      ];
    },
  };
}
