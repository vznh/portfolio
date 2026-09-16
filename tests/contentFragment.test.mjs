import assert from "node:assert/strict";
import { test } from "node:test";
import { isContentFragment } from "../src/lib/contentFragment.ts";

test("Back to home selects crossword even when the document still targets content", () => {
  const staleDocument = () => true;
  assert.equal(isContentFragment("", staleDocument), false);
  assert.equal(isContentFragment("#", staleDocument), false);
  assert.equal(isContentFragment("#crossword", staleDocument), false);
});

test("Forward to content selects content before the document target catches up", () => {
  assert.equal(
    isContentFragment("#content", () => false),
    true,
  );
});

test("section deep links remain supported without treating unrelated fragments as content", () => {
  const contentIds = new Set(["records", "provenance", "antecedents"]);
  const contains = (id) => contentIds.has(id);
  assert.equal(isContentFragment("#records", contains), true);
  assert.equal(isContentFragment("#%70rovenance", contains), true);
  assert.equal(isContentFragment("#unknown", contains), false);
  assert.equal(isContentFragment("#%broken", contains), false);
});
