# Portfolio 2027

Personal website of Jason Son.

## Stack

- Next.js 15 (Pages Router), React 18
- Tailwind CSS 3.4
- TypeScript (strict), Bun
- motion, DialKit

## Scripts

- `bun install` — install dependencies
- `bun dev` — dev server at http://localhost:3000
- `bun run check` — typecheck + lint + production build
- `bun run format` / `bun run format:check` — Prettier

## Fonts

`public/fonts/` holds the licensed Dinamo Schengen A file, used for both subheadings and body, registered in `src/styles/globals.css`.

## DialKit dev panel

In development, a DialKit panel is available with `Cmd+E` for live-tuning. It is not included in production builds.

## Builds

Production builds use `NEXT_DIST_DIR=.next-build bun run build` so the build output does not conflict with the running dev server (which owns `.next`).

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Inspiration

[yves.is](https://yves.is) for layout, and [tomphix](https://instagram.com/tomphix) on Instagram for general thoughts.
