# El flujo — De la idea al PR

An interactive **architecture-map presentation** built with [Slidev](https://sli.dev) + Vue 3 +
custom SVG. It replicates the navigation model from the reference screenshots: a single
connected route through a system, animated dashed paths as the protagonist, clickable nodes
that act as knowledge portals, and a paginated "Herramientas" detail panel — instead of a
traditional linear slide deck.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:3030`.

## Build & deploy to GitHub Pages

```bash
npm run build
```

Outputs static files to `dist/`. The included workflow at
`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.

Before your first deploy:
1. In your repo, go to **Settings → Pages → Source** and select **GitHub Actions**.
2. The workflow auto-derives the `--base` path from your repo name. If you serve the site from
   a custom domain or the repo root, edit the `run: npm run build -- --base ...` line in
   `.github/workflows/deploy.yml` (or just remove the `--base` flag).

## Project structure

```
slides.md                    → the 4 slides: cover, main map, deep-dive, summary
style.css                    → design tokens (colors, font, base resets) — auto-loaded by Slidev
uno.config.ts                → utility-class engine (see "Styling" below)
composables/
  flowData.ts                → single source of truth: nodes, edges, tools, examples
components/
  ArchitectureCanvas.vue     → the main interactive map (composes everything below)
  InteractiveNode.vue        → a clickable node — hover/focus/active states, action chips
  FlowPath.vue                → animated SVG path between two nodes (the "protagonist")
  DetailsPanel.vue            → paginated full-screen overlay (the "Herramientas" cards)
  KnowledgePanel.vue          → inline split list/detail panel (used on the summary slide)
  RouteNavigator.vue          → "continue journey" prev/next controller, bottom-right
  ArchitectureLegend.vue      → small legend for the path language (flujo / genera / loop)
  FloatingInfoCard.vue        → small positioned annotations (e.g. "hasta 8 rondas")
.github/workflows/deploy.yml → GitHub Pages CI
```

## How the map works

- Everything is positioned in one shared coordinate space (`STAGE_W × STAGE_H` in
  `composables/flowData.ts`), so the SVG paths and the HTML nodes always line up.
- Click any node to focus it — the in-context action chips (`› herramientas`,
  `› ver ejemplo`) appear right under it, exactly like the reference recording.
- "herramientas" opens the full paginated tool catalog, scrolled to that node's entry —
  matching the `6 / 9`-style counters in the reference screenshots.
- "ver ejemplo" opens a single code example for that node.
- The bottom-right `RouteNavigator` lets you step through the guided path
  (`contexto → goal → skills → stabilize → review → fix → synthesis`) without ever
  losing the map underneath — nothing is a slide change, it's all component state.
- To add a node: add an entry to `nodes` in `flowData.ts`, connect it with an `edges` entry,
  and optionally give it `tools`/`examples` entries. Everything else (paths, panel content,
  legend) follows automatically.

## Styling

Slidev ships [UnoCSS](https://unocss.dev) with the "Wind" preset by default, which resolves
the **same utility classes as Tailwind** (`flex`, `gap-2`, `text-white/60`, `bg-[#0F1115]`, …)
with zero extra build config — that's what satisfies the "Tailwind CSS" part of the brief
without fighting Slidev's bundled Vite pipeline. `uno.config.ts` adds a few shortcuts on top.
Design tokens (colors, font stack) live as CSS variables in `style.css`.

## Mermaid

The deep-dive slide uses a fenced ` ```mermaid ` code block (Slidev renders these natively) for
a secondary, supporting diagram — the primary architecture map itself is hand-built in
`ArchitectureCanvas.vue` with Vue + SVG, per the brief.

## Motion Slides — el efecto de "lienzo infinito"

Las 4 slides están conectadas con la **View Transitions API** nativa del navegador
(`transition: view-transition` en el frontmatter de `slides.md`). No es una animación CSS
simulada: el navegador saca una snapshot del elemento en la slide anterior y otra en la
siguiente, y si comparten el mismo `view-transition-name`, las morphea — posición, tamaño y
contenido en cross-fade — en vez de cortar. Es la técnica que usa PowerPoint para su
transición "Morph".

Tres elementos quedan "vivos" entre slides vía las clases utilitarias en `style.css`:

| Clase       | `view-transition-name`  | Dónde aparece |
|-------------|--------------------------|---------------|
| `.vt-eyebrow` | `fd-vt-eyebrow` | el label chico ("el flujo" / "deep dive" / "resumen") en las 4 slides |
| `.vt-title`   | `fd-vt-title`   | el título de cada slide |
| `.vt-frame`   | `fd-vt-frame`   | el contenedor visual principal: `.fd-stage` (mapa) → `.fd-mermaid-frame` (deep-dive) → `.fd-kp-frame` (resumen) |

Resultado: el título gigante de la portada se "encoge" hasta la esquina del mapa, y el marco
del mapa se transforma en el marco del diagrama de Mermaid y después en el panel de resumen —
en vez de sentirse como 4 diapositivas, se siente como una sola cámara que recorre un mismo
lienzo. La duración (700ms, `cubic-bezier(0.4, 0, 0.2, 1)`) está ajustada a propósito para que
se sienta como un movimiento de cámara, no un parpadeo — el override está en `style.css` bajo
`::view-transition-group(...)`.

**Para extender el efecto:** agregá `vt-eyebrow` / `vt-title` / `vt-frame` (o creá tu propia
clase con su propio `view-transition-name`) a cualquier otro elemento que quieras que "viaje"
entre dos slides consecutivas. Solo puede existir un elemento con ese nombre visible a la vez
por slide — si agregás una quinta slide con dos títulos a la vez, necesitás un nombre distinto
para cada uno.

**Soporte de navegador:** la View Transitions API (same-document) funciona en Chrome/Edge y en
Safari moderno; en navegadores sin soporte, Slidev simplemente hace un cambio de slide normal
sin el morph — no rompe nada, se degrada con gracia.

También se agregó `v-motion` (incluido en Slidev vía `@vueuse/motion`) para un fade-in sutil
del texto en las slides de deep-dive y resumen — mismo lenguaje visual: fade + un desplazamiento
chico, nada de rebotes.

## Notes

- Palette, type, and motion follow the reference exactly: `#0F1115` background, JetBrains Mono,
  light-blue / soft-orange accents, thin borders, dashed/dotted SVG paths with a slow
  `stroke-dashoffset` animation, no gradients or glow-heavy effects.
- `prefers-reduced-motion` is respected globally (see `style.css`).
- All Spanish copy ("contexto", "skills", "herramientas", tool names/snippets) is placeholder
  content modeled on the reference screenshots — edit `composables/flowData.ts` to swap in your
  own project's real flow, tools and code samples.
