// uno.config.ts
//
// Slidev ships UnoCSS with the "Wind" preset enabled by default, which
// resolves the same utility classes as Tailwind (flex, gap-2, text-white/60,
// bg-[#0F1115], etc.) with zero extra config. We only add a handful of
// shortcuts here so the components below read cleanly.
import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    'fd-border': 'border border-white/15',
    'fd-card': 'bg-white/[0.02] fd-border rounded-sm',
    'fd-mono': 'font-mono tracking-tight',
  },
  theme: {
    colors: {
      fdbg: '#0F1115',
      fdblue: '#8FD3FE',
      fdorange: '#FFB089',
    },
  },
})
