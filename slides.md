---
theme: default
title: De la idea al PR
colorSchema: dark
background: '#0F1115'
fonts:
  mono: 'JetBrains Mono'
highlighter: shiki
drawings:
  enabled: false
transition: view-transition
mdc: false
---

<div class="fd-cover fd-mono">
  <div class="fd-eyebrow vt-eyebrow">el flujo</div>
  <h1 class="fd-cover-title vt-title">De la idea<br/>al PR</h1>
  <p class="fd-cover-sub">cómo un agente recorre un proyecto entero —<br/>de leer el goal a abrir el pull request.</p>
  <div class="fd-cover-hint">↓ explorá el mapa de arquitectura</div>
</div>

<style>
.fd-cover {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 11%;
}
.fd-cover-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.05;
  color: var(--fd-text);
  margin: 18px 0 28px;
  letter-spacing: -0.02em;
}
.fd-cover-sub {
  font-size: 16px;
  color: var(--fd-text-dim);
  line-height: 1.6;
  max-width: 480px;
}
.fd-cover-hint {
  margin-top: 56px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--fd-orange-dim);
  animation: fd-pulse 2.4s ease-in-out infinite;
}
</style>

---
layout: full
class: fd-mono
---

<ArchitectureCanvas class="h-full" />

---
layout: two-cols
class: fd-mono fd-deepdive
---

<div class="fd-eyebrow vt-eyebrow">deep dive</div>
<h2 class="fd-dd-title vt-title">El loop de review</h2>

<p class="fd-dd-body" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }">
Cuando <span class="fd-accent-blue">stabilize</span> deja el build en verde, varios
agentes auditan el mismo PR en paralelo. Cada issue que abren se convierte en un
<span class="fd-accent-blue">fixer</span> dedicado — chico, aislado, verificable.
</p>

<p class="fd-dd-body" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 150 } }">
El loop entre <span class="fd-accent-orange">review</span> y
<span class="fd-accent-orange">fix</span> corre hasta <strong>8 rondas</strong>.
Cuando review no encuentra nada nuevo, el flujo sigue a
<span class="fd-accent-blue">synthesis</span>.
</p>

::right::

<div class="vt-frame fd-mermaid-frame">

```mermaid
%%{init: { 'theme': 'dark', 'themeVariables': {
  'primaryColor': '#111111',
  'primaryTextColor': '#8FD3FE',
  'primaryBorderColor': '#3a3f4a',
  'lineColor': '#FFB089',
  'fontFamily': 'JetBrains Mono'
}}}%%
flowchart TB
  S[stabilize] --> R[review]
  R --> F[fix]
  F -. ronda 1-8 .-> R
  F --> Y[synthesis]
```

</div>

<style>
.fd-deepdive { padding: 64px 64px; }
.fd-dd-title { font-size: 30px; color: var(--fd-blue); margin: 10px 0 26px; }
.fd-dd-body { font-size: 14.5px; line-height: 1.75; color: var(--fd-text); max-width: 420px; margin-bottom: 18px; }
.fd-accent-blue { color: var(--fd-blue); }
.fd-accent-orange { color: var(--fd-orange); }
.fd-mermaid-frame {
  border: 1px solid var(--fd-border-soft);
  border-radius: 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
</style>

---
layout: full
class: fd-mono fd-summary
---

<div class="fd-summary-wrap">
  <div class="fd-eyebrow vt-eyebrow">resumen</div>
  <h2 class="fd-summary-title vt-title">Toda la arquitectura, otra vez</h2>

  <div class="vt-frame fd-kp-frame">
    <KnowledgePanel :items="[
      { title: 'contexto', sub: 'Obsidian', body: 'El vault es la memoria persistente del proyecto entre sesiones del agente — qué se decidió y por qué.' },
      { title: 'goal → skills', sub: 'criterio', body: 'Leer el goal genera plan.md y design.md. Skills define cuándo un PR está realmente listo.' },
      { title: 'stabilize', sub: 'build verde', body: 'Antes de pedir review, el agente deja tests y lint en verde por su cuenta.' },
      { title: 'review ⇄ fix', sub: 'hasta 8 rondas', body: 'Agentes auditan en paralelo; cada issue se vuelve un fixer dedicado. El loop corre hasta 8 rondas.' },
      { title: 'synthesis', sub: 'resumen final', body: 'Cuando el loop converge, el agente resume el journey completo — listo para pegar en el PR.' },
    ]" />
  </div>

  <p class="fd-summary-close" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 600, delay: 200 } }">de la idea al PR, sin perder el contexto en el camino.</p>
</div>

<style>
.fd-summary-wrap { padding: 56px 9%; }
.fd-summary-title { font-size: 26px; color: var(--fd-text); margin: 10px 0 28px; }
.fd-summary-close { margin-top: 28px; font-size: 13px; color: var(--fd-text-dim); letter-spacing: 0.02em; }
.fd-kp-frame { border-radius: 6px; overflow: hidden; }
.fd-kp-frame :deep(.fd-kp) { border-radius: 6px; }
</style>
