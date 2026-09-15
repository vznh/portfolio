import type { CrosswordPuzzle } from "@/lib/crossword";

export const miniCrossword: CrosswordPuzzle = {
  id: "mini-001",
  rows: ["##ACE", "#GLOW", "CLOSE", "AUNT#", "BEE##"],
  clues: {
    across: {
      1: "A serve that goes untouched",
      4: "Light from the last embers",
      5: "Shut, as a book",
      6: "Your parent's sister",
      7: "A flower's frequent visitor",
    },
    down: {
      1: "Without company",
      2: "The price to pay",
      3: "A sheep that says “baa”",
      4: "What holds a collage together",
      5: "A yellow ride in New York",
    },
  },
};
