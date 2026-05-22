# DevTools Hub — Architecture Document

A comprehensive architecture plan for a free, client-side developer tools website hosting 10 essential utilities.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Tool Registry](#tool-registry-single-source-of-truth)
4. [Shared Tool Layout Pattern](#shared-tool-layout-pattern)
5. [Component Architecture](#component-architecture)
6. [State Management Strategy](#state-management-strategy)
7. [Routing & Navigation](#routing--navigation)
8. [SEO Strategy](#seo-strategy)
9. [Performance Targets](#performance-targets)
10. [Security & Privacy](#security--privacy)
11. [Testing Strategy](#testing-strategy)
12. [Development Workflow](#development-workflow)
13. [Deployment](#deployment)
14. [Roadmap Beyond MVP](#roadmap-beyond-mvp)
15. [Build Phases](#build-phases)

---

## Tech Stack

```
Framework:     Next.js 15 (App Router)
Language:      TypeScript (strict mode)
Styling:       Tailwind CSS 4 + shadcn/ui
Code Editor:   CodeMirror 6
Icons:         Lucide React
State:         Zustand (global) + URL state (nuqs)
Validation:    Zod
Testing:       Vitest + Playwright
Hosting:       Vercel or Cloudflare Pages
Analytics:     Plausible or Umami (privacy-friendly, optional)
Package Mgr:   pnpm
```

### Rationale

**Why Next.js over Astro:** Each tool is interactive (needs JS anyway), and Next.js gives better SEO via metadata API, dynamic OG images, and a familiar React ecosystem. Astro's static advantage is wasted when every page is an interactive tool.

**Why Zustand over Redux/Context:** Tools share little state (theme, history, favorites). Zustand is 1KB, no boilerplate, and perfect for this scale.

**Why nuqs:** URL state library that lets users bookmark/share tool state via query params with type safety.

**Why CodeMirror 6 over Monaco:** Significantly lighter (~150KB vs ~3MB), modular, and sufficient for our editor needs.

---

## Folder Structure

```
devtools-hub/
├── app/
│   ├── (tools)/                    # Route group for tool pages
│   │   ├── layout.tsx              # Shared tool layout (sidebar + main)
│   │   ├── json-formatter/
│   │   │   ├── page.tsx
│   │   │   ├── _components/        # Page-specific components
│   │   │   │   ├── json-editor.tsx
│   │   │   │   └── tree-view.tsx
│   │   │   └── _lib/               # Page-specific utilities
│   │   │       └── format.ts
│   │   ├── jwt-debugger/
│   │   ├── base64/
│   │   ├── text-diff/
│   │   ├── json-diff/
│   │   ├── regex-tester/
│   │   ├── uuid-generator/
│   │   ├── hash-generator/
│   │   ├── url-encoder/
│   │   └── cron-parser/
│   ├── api/                        # Minimal — only for OG images
│   │   └── og/
│   │       └── route.tsx
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage
│   ├── not-found.tsx
│   ├── globals.css
│   ├── robots.ts
│   ├── sitemap.ts
│   └── manifest.ts                 # PWA manifest
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── tools/                      # Tool-related shared components
│   │   ├── tool-layout.tsx         # The standard 2-panel layout
│   │   ├── tool-header.tsx         # Title + description + learn-more
│   │   ├── tool-card.tsx           # Homepage tool cards
│   │   ├── editor-panel.tsx        # Wrapped CodeMirror with toolbar
│   │   ├── output-panel.tsx        # Output display with copy/download
│   │   ├── options-bar.tsx         # Settings strip
│   │   ├── action-buttons.tsx      # Copy, Download, Clear, Share
│   │   ├── empty-state.tsx
│   │   ├── error-display.tsx
│   │   └── load-example-button.tsx
│   ├── layout/
│   │   ├── nav.tsx                 # Top navigation
│   │   ├── sidebar.tsx             # Tools sidebar
│   │   ├── footer.tsx
│   │   └── command-palette.tsx     # ⌘K interface
│   └── shared/
│       ├── theme-toggle.tsx
│       ├── copy-button.tsx
│       ├── download-button.tsx
│       └── keyboard-shortcut.tsx   # Visual shortcut hint
│
├── lib/
│   ├── tools/                      # Pure logic, no React
│   │   ├── json.ts                 # Format, validate, minify, diff
│   │   ├── jwt.ts                  # Decode, encode, verify
│   │   ├── base64.ts
│   │   ├── diff.ts
│   │   ├── regex.ts
│   │   ├── uuid.ts
│   │   ├── hash.ts                 # Wraps Web Crypto API
│   │   ├── url.ts
│   │   └── cron.ts
│   ├── hooks/
│   │   ├── use-clipboard.ts
│   │   ├── use-debounce.ts
│   │   ├── use-keyboard-shortcut.ts
│   │   ├── use-local-storage.ts
│   │   └── use-tool-history.ts
│   ├── stores/
│   │   ├── preferences.ts          # Theme, sidebar state
│   │   ├── history.ts              # Recent tool usage
│   │   └── favorites.ts            # Pinned tools
│   ├── config/
│   │   ├── tools.ts                # Single source of truth: tool registry
│   │   ├── shortcuts.ts            # Keyboard shortcut map
│   │   └── site.ts                 # Site metadata, URLs
│   └── utils/
│       ├── cn.ts                   # className merger
│       ├── format-bytes.ts
│       └── download.ts             # File download helper
│
├── public/
│   ├── icons/
│   ├── og-default.png
│   └── favicon.ico
│
├── tests/
│   ├── unit/                       # Pure logic tests
│   │   ├── json.test.ts
│   │   ├── jwt.test.ts
│   │   └── ...
│   └── e2e/                        # Playwright tests
│       ├── homepage.spec.ts
│       └── tools.spec.ts
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Tool Registry (Single Source of Truth)

The most important architectural decision — every tool is defined once in a registry that powers the sidebar, homepage grid, search, sitemap, and metadata.

```typescript
// lib/config/tools.ts
import { Braces, KeyRound, FileCode, GitCompare, /* ... */ } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ToolCategory = 'formatters' | 'converters' | 'generators' | 'diff' | 'parsers';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  keywords: string[];           // For search + SEO
  shortcut?: string;            // ⌘ shortcut
  featured?: boolean;
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Format, validate, and minify JSON',
    description: 'Format, validate, minify, and explore JSON data with a tree view...',
    icon: Braces,
    category: 'formatters',
    keywords: ['json', 'format', 'validate', 'minify', 'pretty print'],
    featured: true,
  },
  // ... 9 more
];

export const toolsBySlug = Object.fromEntries(tools.map(t => [t.slug, t]));
export const toolsByCategory = /* grouped lookup */;
```

**Benefits:** add a tool by adding one entry, everything else updates automatically.

---

## Shared Tool Layout Pattern

Every tool page uses the same wrapper:

```tsx
// app/(tools)/json-formatter/page.tsx
import { ToolLayout } from '@/components/tools/tool-layout';
import { toolsBySlug } from '@/lib/config/tools';
import { JsonFormatterClient } from './_components/json-formatter-client';

const tool = toolsBySlug['json-formatter'];

export const metadata = generateToolMetadata(tool);  // SEO helper

export default function Page() {
  return (
    <ToolLayout tool={tool}>
      <JsonFormatterClient />
    </ToolLayout>
  );
}
```

`ToolLayout` handles: title, description, breadcrumbs, "learn more" expandable, and consistent spacing. Each tool's actual UI lives in a Client Component.

---

## Component Architecture

Three tiers:

### Tier 1: shadcn/ui primitives (`components/ui/`)
Buttons, inputs, tabs, toasts, dropdowns — generic, framework-agnostic visual components.

### Tier 2: Tool-shared components (`components/tools/`)
- `<EditorPanel>` — CodeMirror with optional toolbar (line wrap, font size)
- `<OutputPanel>` — Read-only display with Copy/Download/Clear
- `<ActionButtons>` — Standard button row
- `<ErrorDisplay>` — Inline error with line number click-to-jump
- `<OptionsBar>` — Toggle/dropdown strip

These eliminate ~70% of per-tool UI code.

### Tier 3: Tool-specific components (`app/(tools)/<tool>/_components/`)
The unique parts — e.g., JWT's three-panel layout, Regex's match highlighter, JSON Diff's tree view.

---

## State Management Strategy

Three layers, each with a clear purpose:

1. **Component state (`useState`)** — input/output text, settings on the current tool
2. **URL state (`nuqs`)** — shareable tool state (e.g., `/json-formatter?minify=true&input=...`)
3. **Global state (Zustand + localStorage)** — theme, sidebar collapsed, recent tools, favorites

### Example: Preferences Store

```typescript
// lib/stores/preferences.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface PreferencesStore {
  theme: Theme;
  sidebarCollapsed: boolean;
  editorFontSize: number;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      editorFontSize: 14,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'devtools-preferences' }
  )
);
```

---

## Routing & Navigation

- `/` — Homepage with tool grid
- `/<tool-slug>` — Individual tool (e.g., `/json-formatter`)
- `/about`, `/privacy` — Static pages

**No category routes** initially — keep URLs short for SEO. Categorization happens via filters/sidebar, not URLs.

**Command palette (⌘K)** — Global, accessible from any page. Fuzzy-searches across tool names, descriptions, and keywords. Built with `cmdk` library.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘/` | Toggle sidebar |
| `⌘.` | Toggle theme |
| `⌘Enter` | Run/apply action on current tool |
| `⌘C` on output | Copy result |

---

## SEO Strategy

This is critical for free tool sites — most traffic comes from Google.

### Per-tool metadata

```typescript
// Helper that consumes the tool registry
export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: `${tool.name} - Free Online Tool | DevTools Hub`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      images: [`/api/og?tool=${tool.slug}`],  // Dynamic OG image
    },
    alternates: { canonical: `https://devtools.hub/${tool.slug}` },
  };
}
```

### Additional SEO Components

- **Dynamic OG images:** `app/api/og/route.tsx` using `@vercel/og` generates per-tool social cards
- **Structured data:** Add `SoftwareApplication` JSON-LD schema to each tool page
- **Auto-generated:**
  - `app/sitemap.ts` — iterates the tool registry
  - `app/robots.ts` — allows all crawlers
  - `app/manifest.ts` — PWA support
- **Content strategy:** Each tool page has a "Learn more" expandable section (300-500 words) explaining the tool, common use cases, and examples — gives Google content to rank without cluttering UI

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Largest Contentful Paint | < 1.2s |
| First Input Delay | < 50ms |
| Cumulative Layout Shift | < 0.05 |
| Total JS (initial) | < 150KB gzipped |
| Time to Interactive (per tool) | < 1.5s |

### How to achieve them

- Heavy libraries (CodeMirror, diff algos) loaded via `dynamic()` import per tool
- No client-side library shared across all tools beyond React + UI primitives
- Images: `next/image` with AVIF
- Fonts: `next/font` with `display: swap`

---

## Security & Privacy

Since this is a key differentiator, treat it as architecture:

- **CSP headers** in `next.config.ts` — strict policy, no third-party scripts by default
- **No analytics with cookies** — use Plausible/Umami if any
- **No backend** for tool processing — even logs can't leak data
- **Subresource Integrity** on any CDN scripts
- **`X-Frame-Options: DENY`** to prevent embedding
- Display a "🔒 All processing happens in your browser" badge on every tool

---

## Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| Unit tests | Vitest | Every pure function in `lib/tools/*.ts` |
| Component tests | Vitest + Testing Library | Shared tool components |
| E2E tests | Playwright | One smoke test per tool |
| Visual regression | Chromatic/Percy (optional) | Design system components |

**Priority:** unit tests on `lib/tools/*.ts` come first — these are easiest to test and where bugs cause real harm (a broken JSON validator hurts trust).

---

## Development Workflow

```bash
pnpm dev              # Next.js dev server
pnpm test             # Unit tests in watch mode
pnpm test:e2e         # Playwright
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint + Prettier
pnpm build            # Production build
```

### Git workflow

- `main` — auto-deploys to production
- Feature branches → PR → preview deploy on Vercel → merge

---

## Deployment

### Vercel (recommended for MVP)

- Free tier handles the entire MVP easily
- Automatic preview deploys, edge network, OG image generation
- Domain: register `devtoolshub.com` or similar (~$12/year)

### Cloudflare Pages (alternative)

- More generous free tier, unmetered bandwidth
- Slightly more setup for Next.js (need `@cloudflare/next-on-pages`)

---

## Roadmap Beyond MVP

Architecture is designed to absorb growth:

- **Adding tools:** New entry in `tools.ts` + new folder under `app/(tools)/`
- **Internationalization:** `next-intl` slots in cleanly with App Router
- **PWA / offline:** `next-pwa` adds service worker — every tool already works offline by design
- **API for tools:** If you later want programmatic access, `app/api/v1/<tool>/route.ts` reuses the `lib/tools/*` logic

---

## Build Phases

### Phase 0 — Foundation (1-2 days)
Project setup, Tailwind, shadcn/ui, theme system, tool registry, layouts, homepage shell

### Phase 1 — First tool end-to-end (1 day)
Build JSON Formatter completely — this validates all shared components

### Phase 2 — Remaining tools (1-2 days each)
Each subsequent tool gets faster as patterns solidify

### Phase 3 — Polish (3-5 days)
Command palette, keyboard shortcuts, dynamic OG images, sitemap, SEO content, PWA

### Phase 4 — Launch prep (2-3 days)
Testing, performance audit, analytics setup, ProductHunt/HN launch material

**Total realistic timeline solo:** 3-5 weeks for a polished MVP.

---

## MVP Tool List

The 10 tools to launch with:

1. **JSON Formatter / Validator / Minifier**
2. **JWT Debugger**
3. **Base64 Encoder / Decoder**
4. **Text Diff Checker**
5. **JSON Diff Checker**
6. **Regex Tester**
7. **UUID Generator**
8. **Hash Generator**
9. **URL Encoder / Decoder**
10. **Cron Expression Parser**

---

## Key Architectural Principles

1. **Client-side first** — privacy, speed, and offline capability built in
2. **Single source of truth** — tool registry drives everything
3. **Composition over duplication** — shared components handle ~70% of UI
4. **Performance budgets** — measured and enforced
5. **SEO as a first-class concern** — metadata, structured data, content per tool
6. **Progressive enhancement** — works without JS for initial paint where possible
7. **Type safety** — TypeScript strict mode, Zod for runtime validation

---

*Last updated: May 2026*
