import assert from "node:assert/strict";
import { test } from "node:test";
import { waitForAnimation } from "../src/lib/animationCompletion.ts";
import { crosswordTransition } from "../src/lib/crosswordTransition.ts";

const exit = { animationName: "halftoneOut", animationDuration: "0.85s", animationDelay: "0s" };

function end(element, name = "halftoneOut") {
  const event = new Event("animationend");
  Object.defineProperty(event, "animationName", { value: name });
  element.dispatchEvent(event);
}

test("a solved crossword reaches complete even if the browser never emits animationend", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let state = crosswordTransition({ phase: "ready", solved: false }, { type: "answers", solved: true });
  state = crosswordTransition(state, { type: "hold-end" });
  const cleanup = waitForAnimation(new EventTarget(), exit, () => {
    state = crosswordTransition(state, { type: "animation-end", phase: "exiting" });
  });
  t.mock.timers.tick(949);
  assert.equal(state.phase, "exiting");
  t.mock.timers.tick(1);
  assert.equal(state.phase, "complete");
  cleanup();
});

test("normal animation completion runs once and ignores unrelated animation events", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const element = new EventTarget();
  let completions = 0;
  waitForAnimation(element, exit, () => completions++);
  end(element, "halftoneIn");
  assert.equal(completions, 0);
  end(element);
  end(element);
  t.mock.timers.tick(5000);
  assert.equal(completions, 1);
});

test("the fallback includes entrance delays and handles reduced-motion and content exits", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const [timing, expected] of [
    [{ animationName: "halftoneIn", animationDuration: "1s", animationDelay: "400ms" }, 1500],
    [{ animationName: "portfolioFadeOut", animationDuration: "350ms", animationDelay: "0s" }, 450],
    [{ ...exit, animationDuration: "1ms" }, 101],
    [{ ...exit, animationName: "none" }, 100],
  ]) {
    let completed = false;
    waitForAnimation(new EventTarget(), timing, () => {
      completed = true;
    });
    t.mock.timers.tick(expected - 1);
    assert.equal(completed, false);
    t.mock.timers.tick(1);
    assert.equal(completed, true);
  }
});

test("interrupting or unmounting a view cancels its pending navigation", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const element = new EventTarget();
  let completions = 0;
  const cleanup = waitForAnimation(element, exit, () => completions++);
  cleanup();
  end(element);
  t.mock.timers.tick(5000);
  assert.equal(completions, 0);
});

test("a late exit completion cannot finish a new entrance", () => {
  const state = { phase: "entering", solved: true };
  assert.equal(crosswordTransition(state, { type: "animation-end", phase: "exiting" }), state);
});
