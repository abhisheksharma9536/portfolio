"use client";

import { useEffect } from "react";
import { buttonClass } from "@/components/ui/primitives";
import { Refresh } from "@/components/ui/icons";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="container-page flex min-h-[80dvh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-danger">Something went wrong</p>
      <h1 className="headline mt-4 max-w-2xl">This page hit an unexpected error.</h1>
      <p className="prose-muted mt-5 max-w-lg text-lg">Try again — if it keeps happening, the homepage still works.</p>
      <button type="button" onClick={reset} className={buttonClass("primary", "mt-9")}>
        <Refresh size={16} />
        Try again
      </button>
    </main>
  );
}
