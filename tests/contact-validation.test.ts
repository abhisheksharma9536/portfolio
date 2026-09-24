import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeContact, validateContact } from "../src/lib/validation/contact.ts";

const valid = {
  name: "Priya Recruiter",
  email: "priya@example.com",
  message: "We'd love to talk about a backend role working on integrations.",
};

test("accepts a well-formed message", () => {
  assert.deepEqual(validateContact(normalizeContact(valid)), {});
});

test("normalizes whitespace, case and control characters", () => {
  const input = normalizeContact({
    name: "  Priya \t  Recruiter\u0007 ",
    email: "  Priya@Example.COM ",
    message: "Line one\r\n\r\n\r\n\r\nLine two\u0000",
  });
  assert.equal(input.name, "Priya Recruiter");
  assert.equal(input.email, "priya@example.com");
  assert.equal(input.message, "Line one\n\nLine two");
});

test("coerces non-string fields to empty and reports them", () => {
  const errors = validateContact(normalizeContact({ name: 42, email: null, message: { x: 1 } }));
  assert.ok(errors.name && errors.email && errors.message);
});

test("rejects invalid email addresses", () => {
  for (const email of ["nope", "a@b", "a b@example.com", "<a@example.com>", "a@example.c"]) {
    assert.ok(validateContact(normalizeContact({ ...valid, email })).email, email);
  }
});

test("enforces length limits", () => {
  assert.ok(validateContact(normalizeContact({ ...valid, name: "A" })).name);
  assert.ok(validateContact(normalizeContact({ ...valid, message: "too short" })).message);
  assert.ok(validateContact(normalizeContact({ ...valid, message: "x".repeat(5001) })).message);
});
