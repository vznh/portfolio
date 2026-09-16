type AnimationTiming = Pick<CSSStyleDeclaration, "animationName" | "animationDuration" | "animationDelay">;

function milliseconds(value: string) {
  const time = Number.parseFloat(value);
  return Number.isFinite(time) ? time * (value.trim().endsWith("ms") ? 1 : 1000) : 0;
}
export function waitForAnimation(element: EventTarget, timing: AnimationTiming, onComplete: () => void) {
  const names = timing.animationName.split(",").map((name) => name.trim());
  const durations = timing.animationDuration.split(",").map(milliseconds);
  const delays = timing.animationDelay.split(",").map(milliseconds);
  const total = Math.max(
    0,
    ...names.map((name, index) =>
      name === "none" ? 0 : durations[index % durations.length] + delays[index % delays.length],
    ),
  );
  let finished = false;
  const timer = setTimeout(finish, total + 100);

  function cleanup() {
    finished = true;
    clearTimeout(timer);
    element.removeEventListener("animationend", onEnd);
  }

  function finish() {
    if (finished) return;
    cleanup();
    onComplete();
  }

  function onEnd(event: Event) {
    if (event.target === element && names.includes((event as AnimationEvent).animationName)) finish();
  }

  element.addEventListener("animationend", onEnd);
  return cleanup;
}
