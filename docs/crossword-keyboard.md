# Crossword keyboard navigation

Hardware Tab/Shift+Tab and the iOS keyboard accessory’s Next/Previous controls
use `focusClue` in `src/components/Crossword.tsx`. It selects the first incorrect
or empty square of the next unfinished clue, cycling through Across then Down
and wrapping in either direction. Physical arrow keys still move between squares.

iOS accessory navigation changes focus without sending a Tab key event. Two
text inputs immediately before and after the active square in DOM order forward
their focus events to `focusClue`. Other squares retain `tabIndex={-1}` so native
navigation reaches those two targets rather than adjacent squares.

The navigation inputs occupy separate transparent 2px strips at the edges of
the active square. They must remain within the viewport and independently
hit-testable: do not use `display: none`, offscreen positioning, overlapping
targets, or `pointer-events: none`. WebKit’s
[accessory navigation implementation](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/WebProcess/WebPage/ios/WebPageIOS.mm)
skips obscured targets. Pointer presses on the strips do not change focus.

The targets are disabled before entering the grid, after leaving it, during
transitions, and after Escape. This preserves a single keyboard entry point and
allows Escape followed by Tab or Shift+Tab to leave the grid.

## Device verification

1. On iOS Safari, tap a square and use the keyboard’s Next and Previous controls.
   Check that the clue, direction, and selected square all update.
2. Complete or reveal a clue. Check that both directions skip it and wrap from
   the last Down clue to the first unfinished Across clue, and back.
3. Check a crossing shared by two unfinished clues and a puzzle with only one
   unfinished clue. Navigation should retain the correct clue direction.
4. With a hardware keyboard, check Tab/Shift+Tab, arrow keys, and Escape followed
   by Tab/Shift+Tab. Reenter the grid and verify clue navigation resumes.

DOM focus-event tests can verify routing and state updates, but cannot validate
the iOS accessory’s target discovery or whether the software keyboard stays open.
