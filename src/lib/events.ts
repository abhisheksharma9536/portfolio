/**
 * Tiny typed event bridge so server-rendered content (e.g. an "Ask about
 * GoodieBag" button) can open client islands without shared React context.
 */

export const ASSISTANT_OPEN_EVENT = "assistant:open";
export const COMMAND_OPEN_EVENT = "command:open";

export type AssistantOpenDetail = { question?: string };

export function openAssistant(question?: string) {
  window.dispatchEvent(
    new CustomEvent<AssistantOpenDetail>(ASSISTANT_OPEN_EVENT, {
      detail: { question },
    }),
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(COMMAND_OPEN_EVENT));
}
