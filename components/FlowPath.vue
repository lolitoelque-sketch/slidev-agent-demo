<script setup lang="ts">
import { computed } from 'vue'
import type { EdgeKind } from '../composables/flowData'

const props = withDefaults(
  defineProps<{
    from: { x: number; y: number }
    to: { x: number; y: number }
    kind: EdgeKind
    label?: string
    active?: boolean
    /** id suffix so each path gets a unique marker */
    uid: string
  }>(),
  { active: false, label: '' }
)

// Build the "d" attribute. Straight flow edges get a gentle elbow when
// they're not perfectly horizontal; loop edges get a dipping bezier so the
// route reads as a real loop rather than a straight backtrack.
const d = computed(() => {
  const { from: a, to: b } = props

  if (props.kind === 'loop') {
    const midY = Math.max(a.y, b.y) + 95
    return `M ${a.x} ${a.y + 28} C ${a.x - 40} ${midY}, ${b.x + 40} ${midY}, ${b.x} ${b.y + 28}`
  }

  if (props.kind === 'generates') {
    const midY = (a.y + b.y) / 2
    return `M ${a.x} ${a.y + 24} C ${a.x} ${midY}, ${b.x} ${midY - 20}, ${b.x} ${b.y - 24}`
  }

  // plain flow: straight line, or a soft elbow if it changes lanes
  if (Math.abs(a.y - b.y) > 4) {
    const midX = (a.x + b.x) / 2
    return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`
  }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
})

const labelPos = computed(() => {
  if (props.kind === 'loop') {
    return { x: (props.from.x + props.to.x) / 2, y: Math.max(props.from.y, props.to.y) + 118 }
  }
  return { x: (props.from.x + props.to.x) / 2, y: (props.from.y + props.to.y) / 2 - 10 }
})

const strokeColor = computed(() => {
  if (props.kind === 'loop') return 'var(--fd-blue-dim)'
  if (props.kind === 'generates') return 'var(--fd-text-faint)'
  return props.active ? 'var(--fd-orange)' : 'var(--fd-orange-dim)'
})

const dashArray = computed(() => (props.kind === 'generates' ? '2 6' : '6 8'))
</script>

<template>
  <g class="fd-flow-path">
    <path
      :d="d"
      fill="none"
      :stroke="strokeColor"
      :stroke-width="kind === 'loop' ? 1.5 : 1.75"
      :stroke-dasharray="dashArray"
      stroke-linecap="round"
      :marker-end="`url(#fd-arrow-${uid})`"
      class="fd-path-line"
      :class="{ 'fd-path-active': active }"
    />
    <defs>
      <marker
        :id="`fd-arrow-${uid}`"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" :fill="strokeColor" />
      </marker>
    </defs>

    <text
      v-if="label"
      :x="labelPos.x"
      :y="labelPos.y"
      text-anchor="middle"
      class="fd-path-label"
      :fill="kind === 'loop' ? 'var(--fd-blue)' : 'var(--fd-text-faint)'"
    >{{ label }}</text>
  </g>
</template>

<style scoped>
.fd-path-line {
  animation: fd-dash-flow 6s linear infinite;
}
.fd-path-active {
  animation-duration: 2.2s;
}
.fd-path-label {
  font-family: var(--fd-mono);
  font-size: 9.5px;
  letter-spacing: 0.04em;
}
</style>
