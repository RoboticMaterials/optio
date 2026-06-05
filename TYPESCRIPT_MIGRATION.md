# TypeScript Migration Plan

## Why migrate?

The codebase has 475 JS source files. The bugs fixed in this session — `return []` in `useEffect`, silent `undefined` from optional-chain short-circuit, duplicate keys overwriting each other, fallthrough in switch cases — are all categories TypeScript catches at compile time, before they reach production. With TS the ESLint `no-dupe-keys`, `no-unreachable`, and `react-hooks/rules-of-hooks` rules become secondary safety nets rather than the first line of defence.

---

## Approach: Incremental rename (JS → TS), not a big-bang rewrite

Do NOT convert everything at once. Rename files one at a time from `.js` → `.tsx` / `.ts`, fix the errors the compiler reports in that file, then move on. The app stays buildable throughout.

### Why this works
- Vite already handles `.tsx`/`.ts` natively — no build changes needed.
- `tsconfig.json` with `"allowJs": true` lets old `.js` files coexist.
- Conversion can be parallelised across engineers: one person does Redux, another does utils, another does components.

---

## Phase 1 — Foundation (1–2 days)

### 1a. Install dependencies
```bash
npm install -D typescript @types/react @types/react-dom @types/react-redux @types/react-router-dom
```

### 1b. Create `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": false,
    "allowJs": true,
    "checkJs": false,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["src"]
}
```

Start with `strict: false` and `checkJs: false`. Enabling strict incrementally prevents being overwhelmed by thousands of errors before any refactor value is visible.

### 1c. Add `tsc --noEmit` to CI
Vite doesn't run the TypeScript compiler — it just strips types. Add an explicit type-check step:
```json
// package.json scripts
"typecheck": "tsc --noEmit"
```

---

## Phase 2 — Convert constants and pure utils (3–5 days)

These files have no JSX, no React hooks, and no Redux — they're pure functions over simple data. Converting them gives you typed primitives the rest of the app can import.

**Target files (in order):**
1. `src/constants/*.js` → `.ts` — Define the enums and literal types everything else depends on (`FIELD_DATA_TYPES`, `LOT_FILTER_OPTIONS`, `STATION_TYPES`, etc.)
2. `src/methods/utils/array_utils.js` → `.ts`
3. `src/methods/utils/string_utils.js` → `.ts`
4. `src/methods/utils/object_utils.js` → `.ts`
5. `src/methods/utils/number_utils.js` → `.ts`
6. `src/methods/utils/card_utils.js` → `.ts` — Will expose the duplicate-key and fallthrough bugs at compile time
7. `src/methods/utils/lot_utils.js` → `.ts`

**Key types to define here:**
```typescript
// src/types/lot.ts
export interface Lot {
  _id: string | { $oid: string }
  name: string
  lotNum: number
  lotTemplateId: string
  totalQuantity: number
  flags: number[]
  bins: Record<string, Bin>
  process_id?: string
  fields: LotField[][]
}

// src/types/station.ts
export interface Station {
  _id: string | { $oid: string }
  name: string
  type: string
  dashboards: string[]
  x: number
  y: number
  rotation: number
  schema: string
}

// src/types/settings.ts
export interface Settings {
  _id?: string
  pixelsPerFoot: number
  scaleUnit: 'ft' | 'm'
  iconSizeUnits: number
  mapApps?: { labels?: boolean }
}
```

---

## Phase 3 — Redux store (3–4 days)

Once the core types exist, the Redux layer is the highest ROI conversion because every component reads from the store.

**Order:**
1. Define `RootState` and `AppDispatch` in `src/redux/store/index.ts`
2. Convert reducers one at a time: `settings_reducer`, `stations_reducer`, `cards_reducer`, etc.
3. Convert actions
4. Create typed hooks:
```typescript
// src/redux/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

Replace all `useSelector(state => state.X)` with `useAppSelector` — this is where 90% of the `undefined` crashes come from in this codebase.

---

## Phase 4 — API layer (2–3 days)

`src/api/*.js` → `.ts`. Define the API response types to match the MongoDB shapes. This is also where you resolve the `_id: string | { $oid: string }` ambiguity — define a helper:
```typescript
export const parseId = (id: string | { $oid: string }): string =>
  typeof id === 'string' ? id : id.$oid
```

---

## Phase 5 — Components (ongoing, 2–4 weeks)

Convert leaf components first (no children), then containers. For each file:
1. Rename `.js` → `.tsx`
2. Add prop interface: `interface Props { ... }`
3. Fix the errors `tsc` reports
4. Enable `react-hooks/exhaustive-deps` errors (not just warnings) once the component is typed

**Start with:**
- `src/components/basic/*` — small, self-contained UI components
- `src/components/map/locations/location_svg/location_svg.tsx`
- `src/components/side_bar/content/settings/settings.tsx`

**Leave for last:**
- `src/components/basic/drop_down_search_v2/` (class components, complex generics)
- `src/components/side_bar/content/cards/card_editor/lot_editor.js` (1600+ lines)

---

## Strictness ramp-up

Enable these in order, after the initial conversion is done:

| Flag | When to enable |
|------|---------------|
| `noImplicitAny` | After Phase 3 (Redux) — catches untyped state access |
| `strictNullChecks` | After Phase 4 (API) — catches the `undefined` from optional chaining |
| `strict` | After Phase 5 — full strictness once everything is typed |

---

## Quick wins (can do immediately)

1. **Rename `src/methods/utils/schedules_utils.js` → `.ts`** — it already had a TypeScript `interface` in it (now a JSDoc comment), suggesting someone intended to use TS here.
2. **Any new files** should be `.tsx`/`.ts` from now on — stop the bleeding.
3. **The `_id` type** (`string | { $oid: string }`) should be defined once and imported everywhere rather than handled ad-hoc with `?.` checks.

---

## What NOT to do

- Don't add `// @ts-ignore` or `any` to silence errors — that defeats the purpose.
- Don't try to run `allowJs: false` until Phase 5 is complete.
- Don't convert class components to functional during migration — do them separately.
- Don't type the styled-components files (`.style.js`) — they will be converted when the team migrates to CSS Modules or a typed styling system.
