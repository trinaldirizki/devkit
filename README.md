# DevTools Hub

Free, fast, client-side developer tools. All processing happens in your browser -- no data is sent to any server.

## Tools

- JSON Formatter / Validator / Minifier
- JWT Debugger
- Base64 Encoder / Decoder
- Text Diff Checker
- JSON Diff Checker
- Regex Tester
- UUID Generator
- Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
- URL Encoder / Decoder
- Cron Expression Parser

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run unit tests
pnpm test

# Build for production
pnpm build
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui patterns
- **State**: Zustand (persisted) + URL state (nuqs)
- **Testing**: Vitest + Playwright

## Project Structure

```
app/              Next.js App Router pages
  (tools)/        Route group for all tool pages
  api/og/         OG image generation endpoint
components/
  layout/         Nav, sidebar, footer, command palette
  tools/          Shared tool UI components
  shared/         Theme toggle, copy/download buttons
  ui/             shadcn/ui primitives (add as needed)
lib/
  config/         Tool registry, site config, shortcuts
  hooks/          Custom React hooks
  stores/         Zustand stores (preferences, history, favorites)
  tools/          Pure logic for each tool (no React)
  utils/          Utility functions
tests/
  unit/           Vitest unit tests
  e2e/            Playwright e2e tests
```
