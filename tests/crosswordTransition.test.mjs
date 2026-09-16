import assert from "node:assert/strict";
import { test } from "node:test";
import { crosswordTransition } from "../src/lib/crosswordTransition.ts";

const initial = { phase: "entering", solved: null };

test("manual navigation and refresh dissolve out without claiming a solve", () => {
  let state = { phase: "ready", solved: false };
  state = crosswordTransition(state, { type: "leave" });
  assert.deepEqual(state, { phase: "exiting", solved: false, run: 1 });
  assert.equal(crosswordTransition(state, { type: "leave" }), state);
  state = crosswordTransition(state, { type: "animation-end" });
  assert.deepEqual(state, { phase: "complete", solved: false, run: 1 });
  assert.equal(crosswordTransition(state, { type: "leave" }), state);
});

test("returning resets an unfinished or completed exit to the entrance", () => {
  for (const phase of ["entering", "ready", "holding", "exiting", "complete"]) {
    const state = crosswordTransition({ phase, solved: false }, { type: "reenter" });
    assert.deepEqual(state, { phase: "entering", solved: false, run: 1 });
    assert.equal(crosswordTransition(state, { type: "animation-end" }).phase, "ready");
  }
});

test("a new solve holds the finished board, dissolves out, then completes", () => {
  let state = crosswordTransition(initial, { type: "answers", solved: false });
  state = crosswordTransition(state, { type: "animation-end" });
  assert.equal(state.phase, "ready");
  state = crosswordTransition(state, { type: "answers", solved: true });
  assert.equal(state.phase, "holding");
  assert.equal(crosswordTransition(state, { type: "animation-end" }).phase, "holding");
  state = crosswordTransition(state, { type: "hold-end" });
  assert.equal(state.phase, "exiting");
  state = crosswordTransition(state, { type: "animation-end" });
  assert.equal(state.phase, "complete");
  assert.equal(crosswordTransition(state, { type: "animation-end" }).phase, "complete");
});

test("restoring a solved board or returning from the portfolio does not auto-exit", () => {
  let state = crosswordTransition(initial, { type: "answers", solved: true });
  state = crosswordTransition(state, { type: "animation-end" });
  assert.equal(state.phase, "ready");
  assert.equal(crosswordTransition(state, { type: "answers", solved: true }).phase, "ready");
  state = crosswordTransition({ phase: "complete", solved: true }, { type: "reenter" });
  assert.equal(state.phase, "entering");
  state = crosswordTransition(state, { type: "animation-end" });
  assert.equal(state.phase, "ready");
});

test("incomplete answers never exit; changing a saved solution and solving again does", () => {
  let state = { phase: "ready", solved: true };
  state = crosswordTransition(state, { type: "answers", solved: false });
  assert.equal(state.phase, "ready");
  state = crosswordTransition(state, { type: "hold-end" });
  assert.equal(state.phase, "ready");
  state = crosswordTransition(state, { type: "answers", solved: true });
  assert.equal(state.phase, "holding");
});

test("rapid exit / return / exit ignores completion from the first exit", () => {
  let state = crosswordTransition({ phase: "ready", solved: false }, { type: "leave" });
  const oldExit = state.run;
  state = crosswordTransition(state, { type: "reenter" });
  state = crosswordTransition(state, { type: "leave" });
  assert.equal(state.phase, "exiting");
  assert.equal(crosswordTransition(state, { type: "animation-end", phase: "exiting", run: oldExit }), state);
  state = crosswordTransition(state, { type: "animation-end", phase: "exiting", run: state.run });
  assert.equal(state.phase, "complete");
});

test("a canceled solved hold cannot end a later hold", () => {
  let state = crosswordTransition({ phase: "ready", solved: false }, { type: "answers", solved: true });
  const oldHold = state.run ?? 0;
  state = crosswordTransition(state, { type: "reenter" });
  state = crosswordTransition(state, { type: "animation-end", phase: "entering", run: state.run });
  state = crosswordTransition(state, { type: "answers", solved: false });
  state = crosswordTransition(state, { type: "answers", solved: true });
  assert.equal(state.phase, "holding");
  assert.equal(crosswordTransition(state, { type: "hold-end", run: oldHold }), state);
});
