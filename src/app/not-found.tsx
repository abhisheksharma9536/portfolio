import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/primitives";
import { ArrowLeft } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="container-page flex min-h-[80dvh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-accent">404</p>
      <h1 className="headline mt-4 max-w-2xl">
        This page isn&apos;t part of the <span className="serif-accent text-accent">system</span>.
      </h1>
      <p className="prose-muted mt-5 max-w-lg text-lg">
        The link may be outdated. Everything worth seeing starts from the homepage.
      </p>
      <ButtonLink href="/" className="mt-9">
        <ArrowLeft size={16} />
        Back to the homepage
      </ButtonLink>
    </main>
  );
}
