export type CrosswordPhase = "entering" | "ready" | "holding" | "exiting" | "complete";

export interface CrosswordTransition {
  phase: CrosswordPhase;
  solved: boolean | null;
  run?: number;
}

export type CrosswordTransitionEvent =
  | { type: "answers"; solved: boolean }
  | { type: "animation-end"; phase?: "entering" | "exiting"; run?: number }
  | { type: "hold-end"; run?: number }
  | { type: "leave" }
  | { type: "reenter" };

export function crosswordTransition(
  state: CrosswordTransition,
  event: CrosswordTransitionEvent,
): CrosswordTransition {
  const run = state.run ?? 0;
  if ("run" in event && event.run !== undefined && event.run !== run) return state;
  if (event.type === "reenter") return { ...state, phase: "entering", run: run + 1 };
  if (event.type === "leave") {
    return state.phase === "complete" || state.phase === "exiting"
      ? state
      : { ...state, phase: "exiting", run: run + 1 };
  }
  if (event.type === "answers") {
    const newlySolved = state.solved === false && event.solved;
    return {
      ...state,
      solved: event.solved,
      phase: newlySolved && state.phase === "ready" ? "holding" : state.phase,
    };
  }
  if (event.type === "hold-end") {
    return state.phase === "holding" ? { ...state, phase: "exiting", run: run + 1 } : state;
  }
  if (event.phase && event.phase !== state.phase) return state;
  if (state.phase === "entering") return { ...state, phase: "ready" };
  if (state.phase === "exiting") return { ...state, phase: "complete" };
  return state;
}
