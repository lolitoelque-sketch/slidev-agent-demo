// composables/flowData.ts
//
// Single source of truth for the interactive architecture map.
// Coordinates live in a 1040 x 590 "stage" space — both the SVG paths
// (FlowPath) and the HTML nodes (InteractiveNode) are positioned from
// the same numbers, so they always line up regardless of viewport size.

export type NodeKind = 'node' | 'artifact'

export interface FlowNode {
  id: string
  label: string
  sub: string
  x: number
  y: number
  kind: NodeKind
  /** order in the guided "continue journey" path */
  step: number
}

export type EdgeKind = 'flow' | 'generates' | 'loop'

export interface FlowEdge {
  from: string
  to: string
  kind: EdgeKind
  label?: string
}

export interface ToolEntry {
  id: string
  nodeId: string
  name: string
  description: string
  codeLabel: string
  code: string
}

export interface ExampleEntry {
  nodeId: string
  title: string
  description: string
  codeLabel: string
  code: string
}

/** shape consumed by DetailsPanel.vue — kept here so it can be imported
 *  from plain .ts without relying on cross-SFC type exports */
export interface PanelItem {
  name: string
  description: string
  code: string
  codeLabel?: string
}

export const STAGE_W = 1040
export const STAGE_H = 590

export const nodes: FlowNode[] = [
  { id: 'contexto', label: 'contexto', sub: 'Obsidian', x: 70, y: 140, kind: 'node', step: 1 },
  { id: 'goal', label: 'goal', sub: 'leer goal · contexto al agente', x: 250, y: 140, kind: 'node', step: 2 },
  { id: 'skills', label: 'skills', sub: 'criterio', x: 430, y: 140, kind: 'node', step: 3 },
  { id: 'plan', label: 'plan.md', sub: 'los pasos', x: 175, y: 350, kind: 'artifact', step: 100 },
  { id: 'design', label: 'design.md', sub: 'las decisiones', x: 340, y: 350, kind: 'artifact', step: 101 },
  { id: 'stabilize', label: 'stabilize', sub: 'entender por proyecto', x: 610, y: 140, kind: 'node', step: 4 },
  { id: 'review', label: 'review', sub: 'agentes auditan', x: 790, y: 140, kind: 'node', step: 5 },
  { id: 'fix', label: 'fix', sub: 'issues → fixers', x: 790, y: 350, kind: 'node', step: 6 },
  { id: 'synthesis', label: 'synthesis', sub: 'resumen final', x: 940, y: 140, kind: 'node', step: 7 },
]

export const edges: FlowEdge[] = [
  { from: 'contexto', to: 'goal', kind: 'flow' },
  { from: 'goal', to: 'skills', kind: 'flow' },
  { from: 'goal', to: 'plan', kind: 'generates', label: 'genera' },
  { from: 'goal', to: 'design', kind: 'generates', label: 'genera' },
  { from: 'skills', to: 'stabilize', kind: 'flow' },
  { from: 'stabilize', to: 'review', kind: 'flow' },
  { from: 'review', to: 'fix', kind: 'flow' },
  { from: 'fix', to: 'review', kind: 'loop', label: 'el loop · hasta 8 rondas' },
  { from: 'fix', to: 'synthesis', kind: 'flow' },
]

/** ordered "guided journey" — drives the Siguiente / Anterior controls */
export const journey = [...nodes]
  .filter((n) => n.kind === 'node')
  .sort((a, b) => a.step - b.step)
  .map((n) => n.id)

export const tools: ToolEntry[] = [
  {
    id: 'vault',
    nodeId: 'contexto',
    name: '@vault/',
    description: 'Le paso archivos del vault al prompt. El agente arranca sabiendo qué y por qué.',
    codeLabel: '',
    code: '> seguí @vault/proyecto/goal.md\n  y @vault/decisiones/auth.md',
  },
  {
    id: 'goal-cmd',
    nodeId: 'goal',
    name: '/goal',
    description: 'Convierte una idea suelta en un goal accionable, con criterio de éxito explícito.',
    codeLabel: '',
    code: 'claude /goal\n# describí el problema,\n# no la solución',
  },
  {
    id: 'grill-me',
    nodeId: 'skills',
    name: '/grill-me',
    description: 'Te interroga el plan rama por rama hasta que de verdad lo entiendes.',
    codeLabel: '',
    code: 'claude /grill-me\n# una pregunta a la vez,\n# sin avanzar hasta cerrar',
  },
  {
    id: 'plan-cmd',
    nodeId: 'plan',
    name: '/plan',
    description: 'Convierte el goal en pasos verificables. Cada paso es chico y reversible.',
    codeLabel: '',
    code: 'claude /plan\n# escribe plan.md\n# un paso = un commit',
  },
  {
    id: 'design-cmd',
    nodeId: 'design',
    name: '/design',
    description: 'Documenta las decisiones y los trade-offs antes de tocar código.',
    codeLabel: '',
    code: 'claude /design\n# escribe design.md\n# por qué, no solo qué',
  },
  {
    id: 'stabilize-cmd',
    nodeId: 'stabilize',
    name: '/stabilize',
    description: 'Corre tests y lint en loop hasta que el build queda verde.',
    codeLabel: '',
    code: 'claude /stabilize\n# build + tests + lint\n# hasta verde',
  },
  {
    id: 'code-critic',
    nodeId: 'review',
    name: 'code-critic',
    description: 'Cuando ya no hay bugs, busca mejoras y deuda técnica.',
    codeLabel: '',
    code: "agent(prompt, {\n  agentType: 'code-critic'\n})",
  },
  {
    id: 'fix-cmd',
    nodeId: 'fix',
    name: '/fix',
    description: 'Cada issue del review se vuelve un fixer dedicado. Aislado, chico, verificable.',
    codeLabel: '',
    code: 'claude /fix issue-014\n# un fixer por issue,\n# hasta 8 rondas',
  },
  {
    id: 'synthesis-cmd',
    nodeId: 'synthesis',
    name: '/synthesis',
    description: 'Resume el journey completo: qué cambió, por qué, y qué quedó pendiente.',
    codeLabel: '',
    code: 'claude /synthesis\n# resumen final\n# listo para el PR',
  },
]

export const examples: ExampleEntry[] = [
  {
    nodeId: 'contexto',
    title: 'Ejemplo · contexto',
    description: 'El vault de Obsidian es la memoria persistente del proyecto entre sesiones del agente.',
    codeLabel: 'vault/',
    code: 'vault/\n  proyecto/goal.md\n  decisiones/auth.md\n  decisiones/datos.md',
  },
  {
    nodeId: 'goal',
    title: 'Ejemplo · goal',
    description: 'Leer el goal le da al agente el contexto antes de generar ningún archivo.',
    codeLabel: 'goal.md',
    code: '## Goal\nMigrar auth a OAuth2\nsin downtime.',
  },
  {
    nodeId: 'skills',
    title: 'Ejemplo · skills',
    description: 'Skills define el criterio de calidad: qué hace que un PR esté "listo".',
    codeLabel: 'skills.md',
    code: 'criterio:\n  - tests en verde\n  - sin TODOs nuevos\n  - design.md actualizado',
  },
  {
    nodeId: 'stabilize',
    title: 'Ejemplo · stabilize',
    description: 'Antes del review, el agente estabiliza: build, tests y lint en verde.',
    codeLabel: 'ci.log',
    code: '✓ build\n✓ unit tests (212)\n✓ lint',
  },
  {
    nodeId: 'review',
    title: 'Ejemplo · review',
    description: 'Varios agentes auditan el mismo PR en paralelo, cada uno con un foco distinto.',
    codeLabel: 'review.md',
    code: 'reviewers:\n  - security\n  - perf\n  - code-critic',
  },
  {
    nodeId: 'fix',
    title: 'Ejemplo · fix',
    description: 'Issues abiertos por review se reparten entre fixers. El loop corre hasta 8 rondas.',
    codeLabel: 'issues/',
    code: 'issue-014 → fixer\nissue-015 → fixer\nronda 3 / 8',
  },
  {
    nodeId: 'synthesis',
    title: 'Ejemplo · synthesis',
    description: 'El resumen final queda listo para pegar en la descripción del PR.',
    codeLabel: 'PR.md',
    code: '## Qué cambió\n## Por qué\n## Qué falta',
  },
]

export function toolsFor(nodeId: string) {
  return tools.filter((t) => t.nodeId === nodeId)
}

export function exampleFor(nodeId: string) {
  return examples.find((e) => e.nodeId === nodeId)
}

export function nodeById(id: string) {
  return nodes.find((n) => n.id === id)
}
