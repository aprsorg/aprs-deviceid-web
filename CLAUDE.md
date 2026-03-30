# CLAUDE.md

See [README.md](README.md) for project overview, structure, and development instructions.

## Key details

- The app fetches data at runtime from `https://aprs-deviceid.aprsfoundation.org/tocalls.dense.json` — there is no local data copy.
- All search/filter logic is in `src/composables/useDeviceData.js`.
- No CSS framework — all styles are in `src/assets/style.css`.
- `vite.config.js` sets `base: '/aprs-deviceid-web/'` for GitHub Pages. Adjust if the repo name changes.
- Build with `npm run build`, dev server with `npm run dev`.
