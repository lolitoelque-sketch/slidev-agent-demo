<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  nodes,
  edges,
  tools,
  toolsFor,
  exampleFor,
  STAGE_W,
  STAGE_H,
} from '../composables/flowData'
import type { PanelItem } from '../composables/flowData'
import FlowPath from './FlowPath.vue'
import InteractiveNode from './InteractiveNode.vue'
import FloatingInfoCard from './FloatingInfoCard.vue'
import ArchitectureLegend from './ArchitectureLegend.vue'
import RouteNavigator from './RouteNavigator.vue'
import DetailsPanel from './DetailsPanel.vue'

const activeId = ref<string | null>(null)
const visited = ref(new Set<string>())

const panelVisible = ref(false)
const panelEyebrow = ref('Herramientas')
const panelItems = ref<PanelItem[]>([])
const panelIndex = ref(0)

function selectNode(id: string) {
  activeId.value = activeId.value === id ? null : id
  if (activeId.value) visited.value.add(activeId.value)
}

function goTo(id: string) {
  activeId.value = id
  visited.value.add(id)
}

function openTools(id: string) {
  panelEyebrow.value = 'Herramientas'
  panelItems.value = tools.map((t) => ({
    name: t.name,
    description: t.description,
    code: t.code,
    codeLabel: t.codeLabel,
  }))
  const startIndex = toolsFor(id).length ? tools.findIndex((t) => t.nodeId === id) : 0
  panelIndex.value = Math.max(0, startIndex)
  panelVisible.value = true
}

function openExample(id: string) {
  const ex = exampleFor(id)
  if (!ex) return
  panelEyebrow.value = 'Ejemplo'
  panelItems.value = [
    { name: ex.title.replace('Ejemplo · ', ''), description: ex.description, code: ex.code, codeLabel: ex.codeLabel },
  ]
  panelIndex.value = 0
  panelVisible.value = true
}

function closePanel() {
  panelVisible.value = false
}

const nodeCenters = computed(() => {
  const map: Record<string, { x: number; y: number }> = {}
  for (const n of nodes) map[n.id] = { x: n.x, y: n.y }
  return map
})

function hasTools(id: string) {
  return toolsFor(id).length > 0
}
function hasExample(id: string) {
  return !!exampleFor(id)
}
</script>

<template>
  <div class="fd-canvas-shell">
    <div class="fd-canvas-header">
      <div class="fd-eyebrow vt-eyebrow">el flujo</div>
      <div class="fd-canvas-title vt-title">De la idea al PR</div>
    </div>

    <ArchitectureLegend class="fd-canvas-legend" />

    <div class="fd-stage fd-dot-grid vt-frame">
      <svg
        class="fd-stage-svg"
        :viewBox="`0 0 ${STAGE_W} ${STAGE_H}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <FlowPath
          v-for="e in edges"
          :key="`${e.from}-${e.to}`"
          :uid="`${e.from}-${e.to}`"
          :from="nodeCenters[e.from]"
          :to="nodeCenters[e.to]"
          :kind="e.kind"
          :label="e.kind === 'loop' ? '' : e.label"
          :active="activeId === e.from || activeId === e.to"
        />
      </svg>

      <FloatingInfoCard :x="790" :y="248" text="el loop · hasta 8 rondas" variant="blue" />

      <InteractiveNode
        v-for="n in nodes"
        :key="n.id"
        :node="n"
        :active="activeId === n.id"
        :visited="visited.has(n.id)"
        :has-tools="hasTools(n.id)"
        :has-example="hasExample(n.id)"
        @select="selectNode"
        @tools="openTools"
        @example="openExample"
      />
    </div>

    <RouteNavigator class="fd-canvas-nav" :current-id="activeId" @go="goTo" />

    <DetailsPanel
      :visible="panelVisible"
      :eyebrow="panelEyebrow"
      :items="panelItems"
      :index="panelIndex"
      @update:index="(i) => (panelIndex = i)"
      @close="closePanel"
    />
  </div>
</template>

<style scoped>
.fd-canvas-shell {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 48px 56px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.fd-canvas-header {
  margin-bottom: 18px;
}
.fd-canvas-title {
  font-family: var(--fd-mono);
  font-size: 19px;
  font-weight: 600;
  color: var(--fd-blue);
  margin-top: 4px;
}

.fd-canvas-legend {
  position: absolute;
  top: 52px;
  right: 56px;
}

.fd-stage {
  position: relative;
  flex: 1;
  border: 1px solid var(--fd-border-soft);
  border-radius: 6px;
}

.fd-stage-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.fd-canvas-nav {
  position: absolute;
  bottom: 28px;
  right: 56px;
}
</style>
