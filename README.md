# APRS Device ID Search

A single-page web application for searching the [APRS device identifier database](https://github.com/aprsorg/aprs-deviceid). It fetches the published database from [aprs-deviceid.aprsfoundation.org](https://aprs-deviceid.aprsfoundation.org/tocalls.dense.json) and provides client-side search by tocall (destination callsign), vendor name, or device model.

## Features

- **Multi-term search** — type multiple words (e.g. "yaesu ht") to filter by all terms simultaneously
- **Class filter** — dropdown to filter by device class (tracker, rig, weather station, etc.)
- **Sortable columns** — click any column header to sort
- **All identifier types** — searches across tocalls, Mic-E, and Mic-E Legacy entries
- **Responsive** — works on desktop and mobile

## Project structure

```
src/
  main.js                          Entry point
  App.vue                          Root component
  composables/useDeviceData.js     Data fetching, normalization, search logic
  components/
    SearchBar.vue                  Search input + class filter dropdown
    ResultsTable.vue               Sortable results table
    DataInfo.vue                   Loading/error state, metadata display
  assets/style.css                 All styling
.github/workflows/deploy.yml      GitHub Pages deployment
vite.config.js                     Vite config (base path for GitHub Pages)
```

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API)
- [Vite](https://vite.dev/)
- No CSS framework — custom CSS

## Development

Prerequisites: Node.js 20+

```sh
npm install
npm run dev
```

This starts a local dev server with hot reload (default: http://localhost:5173/).

## Build

```sh
npm run build
```

Output goes to `dist/`.

## Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages on every push to `main`. It uses the modern GitHub Pages artifact-based deployment — no `gh-pages` branch needed.

The Vite `base` option in `vite.config.js` is set to `/aprs-deviceid-web/` to match the repository name for correct asset paths on GitHub Pages.

## Data source

The device database is maintained at [aprsorg/aprs-deviceid](https://github.com/aprsorg/aprs-deviceid) and licensed under [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).
