# Crossword print experiment

The clean crossword checkpoint is commit `65f1e4a`. The approved print defaults are
shared by the development controls, Reset, and production in
`src/presets/crosswordAppearance.ts`: a centered black 0.35px stretch stroke at full
opacity, full fill, and zero ink wear. Preview is off and the brush preset is Custom.

Run `bun run dev`. The **Crossword · Print** DialKit panel opens on the crossword. The original
**Bevel & Emboss** panel opens only at `/#content`. Click outside a text field and press
Cmd/Ctrl+E to collapse or open the active panel.

The content logo is chosen once per page load and stays mounted during Back/Forward
and crossword/content transitions. Development controls edit that same logo; closing
and reopening the controls preserves its current tuning. A fresh load chooses from
`embossVersions`, excluding the previous load's version when session storage is available.
Saved DialKit presets remain available for manual selection and are not overwritten
when initializing the visit's logo.

## Halftone

### Entrance and completion

The grid reveals through expanding 6px halftone dots on load (1 second); clues use
a simple opacity fade. Both the halftone texture and animated dot mask are grid-only.
Once every answer is correct, the solved board holds for 650ms, dissolves through
shrinking dots (850ms), and opens `#content`. This transition is independent of the
static halftone overlay and its DialKit settings. Input is paused during transitions.
Content waits 400ms before its 500ms fade-in. The crossword also waits 400ms before
its entrance, leaving a short pause between views. Reduced-motion mode skips these delays.
Crossword entrances/exits and the content exit finish on `animationend`, with a
fallback at the computed CSS duration plus delay plus 100ms. Completion runs once;
changing views cancels pending callbacks so an interrupted animation cannot strand
the page or finish a later transition.
The content page's Crossword link fades out, then navigates natively to `#crossword`.
Browser Back and other fragment navigation also keep content visible through the
350ms exit. A visibility hold prevents `:target` from hiding the words early;
the crossword entrance and its completion timer stay paused until the hold ends.
History-driven exits retain the requested URL instead of adding a new history entry.
Use fragment navigation here: `history.pushState` does not update CSS `:target`,
which controls which view is visible.
React reads the destination from `location.hash`, not `:target`: during browser
Back/Forward, the URL can update before the document target. Reversing direction
captures the current dot radius or content opacity and animates from there, without
replaying the initial delay. Halftone duration scales with the remaining distance.
Each crossword transition has a run ID, so an older completion cannot finish a
later transition in the same direction. Navigation cancels pending timers and
listeners immediately, and exit redirects are checked against their original URL.
Hidden entrances do not run; reduced-motion settings still skip animation delays.
The entrance waits for hydration/progress restoration so its completion event cannot
be missed on a slow load. Reduced-motion mode skips the dot animation and hold.
Restoring an already-solved board does not trigger another exit; returning from
the portfolio replays the entrance. Printing keeps the puzzle visible.
Go to website and Refresh wait for the exit animation before navigating or replacing
the puzzle. Back/Forward navigation holds the current view through the exit, and
returning to the crossword resets the entrance before paint. Opening a portfolio
deep link directly still goes straight to that content.

The supplied texture is clipped to the crossword's cell outlines and outer border,
without intercepting input. Cell interiors and empty spaces remain clean. The line
mask follows the rendered cells when the grid resizes.
Opacity, scale, rotation, contrast, offsets, and blend mode are adjustable. Screen lightens
the ink; Multiply darkens the lines; Soft light gives a gentler contrast treatment.
The approved defaults enable the static halftone with Screen blending,
100% opacity, 0.25 scale, and 1.8 contrast. The previous automatic
Multiply migration has been removed. Entrance and completion animations remain active.

Toggle **Halftone → Preview** to exaggerate the texture on the grid lines.
Preview temporarily uses 70% opacity, 1.2× scale, and 3× contrast with the selected blend mode;
turn it off to return to your slider settings. It does not overwrite those settings.

## Text strokes

Brushes apply to clue text, clue numbers, and both direction arrows, not grid letters or grid numbers.
The arrows derive fill and outline from their SVG silhouette, then share the clue text's
brush texture, ink wear, color, opacity, and stroke-position settings. Their layout sizes are unchanged.
Halftone affects only the grid; the clue lettering keeps its separate brush treatment.

The original ABC Schengen A text remains selectable and editable. The browser draws
native text strokes with fractional widths; SVG filters texture and color them.
Position supports outside, center, and inside; weight, color, opacity, and fill opacity
are independent. Fill opacity zero produces outline-only text.

Weight changes native outline geometry, not its opacity. The source encodes fill
and stroke in separate color channels using an overlaid pseudo-element; the filter
extracts both masks, clips the stroke to the selected side, and paints the chosen
colors. Inside/outside use twice the native centered width before clipping. Ordinary
edge antialiasing remains, but the whole stroke is no longer faded by fractional weight.
Stroke opacity is applied only through its own control. Brush texture and the halftone
overlay can still affect the final appearance.

**Stroke → Ink wear** textures the letter interiors as well as the outline, making
brush differences visible at the clues' normal 14–15px size. The approved default is 0;
increasing it varies ink opacity using the brush texture. Zero restores the original solid
fill. It preserves the font and does not affect grid letters or numbers. Solid
strokes and disabling strokes bypass ink wear. Fill opacity remains independent.

- Solid uses an untextured outline.
- Dry brush breaks up and roughens the outline with seeded noise.
- Stretch brush stretches that grain horizontally or vertically into longer bristles.
- Scatter brush tiles clusters of marks across the outline, with spacing and jitter controls.

**Stroke → Preset** contains procedural interpretations of all 25 built-in brushes
listed in Figma's plugin documentation: 15 stretch and 10 scatter. The picker prefixes
each name with its family. Selecting a preset preserves weight, position, color,
opacity, fill, and halftone. Changing a texture control switches the picker to Custom.

### Complete catalog

These descriptions summarize the official swatches and the character targeted by
our approximations; they are not claims of exact reproduction.

| Stretch preset    | Character                            |
| ----------------- | ------------------------------------ |
| Heist             | Chipped ink                          |
| Blockbuster       | Dry bristles                         |
| Grindhouse        | Coarse irregular ink                 |
| Biopic            | Smooth flowing ink                   |
| Spaghetti Western | Fine separated strands               |
| Slasher           | Long torn ribbons                    |
| Hardboiled        | Dense edge with crumbling grain      |
| Vérité            | Scratchy overlapping bristles        |
| Epic              | Broken dry ribbons                   |
| Screwball         | Ragged separated tracks              |
| Rom-com           | Parallel bands with worn centers     |
| Noir              | Heavy ink with chipped gaps          |
| Propaganda        | Broad ink with sharp irregular edges |
| Melodrama         | Soft continuous rounded ink          |
| New Wave          | Fine combed bristles                 |

| Scatter preset | Character                      |
| -------------- | ------------------------------ |
| Bubblegum      | Fine soft spray                |
| Witch House    | Dense spray with gritty fringe |
| Shoegaze       | Open scratchy granules         |
| Honky Tonk     | Coarse round ink flecks        |
| Screamo        | Dense short scratch marks      |
| Drone          | Large overlapping blots        |
| Doo Wop        | Soft dense charcoal grain      |
| Spoken Word    | Sparse fine dust               |
| Vaporwave      | Even stippling                 |
| Oi             | Dense soft airbrush            |

Stretch uses directional noise. Scatter uses deterministic clusters of original SVG
marks, tiled and clipped to the text outline. **Stroke → Scatter** adjusts the tip,
size, gap, wiggle, size jitter, angular jitter, and rotation. Brush roughness, grain,
dryness, and seed also affect scatter. Stretch amount and direction apply to the
stretch family. Bigger gap means fewer stamps; larger size makes coarser marks.

At subtle weights the differences are small. For a quick comparison, try weight 2,
fill opacity 0.7, and halftone disabled, then restore your preferred values.

Neither implementation maps Figma's original artwork along glyph contours. In Figma,
stretch follows the length of a path and scatter places stamps along the path;
ours operates on the text's alpha outline to keep the live font selectable/editable.
Our horizontal/vertical grain direction is not Figma's forward/backward path direction.
Figma restricts brush strokes to center alignment; our additional clipping supports
inside/outside placement. No Figma brush artwork is bundled in the application.

Figma also offers **Dynamic strokes**, a separate non-preset type with frequency,
wiggle, and smoothening controls, plus user-created **Custom brushes**. Neither is an
additional built-in brush preset, and neither is implemented here.

DialKit saves controls and presets locally. Reset restores the checked-in defaults in
`src/presets/crosswordAppearance.ts`. The panel is development-only; production uses those
defaults, not a visitor's locally saved tuning values. Turn both effects off for the clean look.

## References

- [Figma stroke position, weight, and brush limitations](https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties)
- [Figma stretch and scatter brushes](https://help.figma.com/hc/en-us/articles/31440438150935-Draw-with-illustration-tools)
- [Figma's named brush presets](https://developers.figma.com/docs/plugins/api/ComplexStrokeProperties/)
- [DialKit controller and persistence](https://github.com/joshpuckett/dialkit)
- [SVG morphology for outlines](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feMorphology)
- [SVG turbulence for grain](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)
- [SVG displacement for rough edges](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap)

## Validation notes

The scatter generator is deterministic and bounded, with tests covering preset
selection, manual edits, spacing, jitter, seed, and geometry preservation. SVG specimens
were checked with Sharp; its renderer cannot nest SVG inputs inside `feImage`, so only
the specimen inputs were rasterized at 4× for that check. The web implementation keeps
SVG data-URI inputs. Live browser appearance is being tested by the user.
