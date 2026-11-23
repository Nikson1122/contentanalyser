# CreatorPulse AI — Frontend UI Foundation

Configurable AI-powered content research and intelligence platform. This repo currently
contains the **frontend UI foundation only**: application shell, dashboard overview, and the
dynamic My Pages management screen.

## Stack

React 19 · Vite · JavaScript · Tailwind CSS v4 · React Router · Lucide React

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Structure

```
src/
  components/
    layout/      DashboardLayout, Sidebar, Navbar
    ui/          Button, Modal, PageHeader, EmptyState, PageCard, Field, PageFormModal
  constants/
    navigation.js    sidebar + route labels (single source of truth)
    pageOptions.js   platform / language options, empty form shape
  context/
    PagesContext.jsx in-memory page store (starts empty)
  pages/
    Dashboard.jsx, MyPages.jsx, ModulePlaceholder.jsx, NotFound.jsx
```

## Extending

- **New sidebar module** — add an entry to `src/constants/navigation.js`, then add a matching
  `<Route>` in `src/App.jsx`. Unbuilt modules route to `ModulePlaceholder`.
- **Real data** — replace the `useState` store in `PagesContext.jsx` with your data source;
  the UI consumes `pages`, `addPage`, `updatePage`, `removePage` and needs no changes.
- **Theme** — colors are design tokens in the `@theme` block of `src/index.css`
  (`surface-*` navy/charcoal surfaces, `accent-*` greens).

## Scope / deliberate exclusions

No backend, no database, no AI integration, no CSV processing, no API calls, no auth.
No page names, niches, categories, counts or analytics are hardcoded — all page data is
created at runtime and held in React state.
