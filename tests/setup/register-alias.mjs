// Lets Node's native TypeScript test runner resolve the "@/..." path alias.
import { register } from "node:module";

register("./alias-hooks.mjs", import.meta.url);
