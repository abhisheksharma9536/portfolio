"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { COMMAND_OPEN_EVENT } from "@/lib/events";

const CommandPalette = dynamic(() => import("./command-palette"), { ssr: false, loading: () => null });

/** Listens for ⌘K / Ctrl+K and loads the palette on first use. */
export function CommandPaletteHost() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const show = () => {
      setMounted(true);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMounted(true);
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(COMMAND_OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(COMMAND_OPEN_EVENT, show);
    };
  }, []);

  return mounted ? <CommandPalette open={open} onClose={() => setOpen(false)} /> : null;
}
