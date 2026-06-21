<script setup lang="ts">
import { computed } from 'vue'
import type { FlowNode } from '../composables/flowData'
import { STAGE_W, STAGE_H } from '../composables/flowData'

const props = defineProps<{
  node: FlowNode
  active: boolean
  visited: boolean
  hasTools: boolean
  hasExample: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  tools: [id: string]
  example: [id: string]
}>()

const style = computed(() => ({
  left: `${(props.node.x / STAGE_W) * 100}%`,
  top: `${(props.node.y / STAGE_H) * 100}%`,
}))

const isArtifact = computed(() => props.node.kind === 'artifact')
</script>

<template>
  <div
    class="fd-node-wrap"
    :style="style"
    :class="{ 'fd-node-wrap--artifact': isArtifact }"
  >
    <button
      class="fd-node"
      :class="{
        'fd-node--active': active,
        'fd-node--visited': visited && !active,
        'fd-node--artifact': isArtifact,
      }"
      @click="emit('select', node.id)"
    >
      <span class="fd-node__label">{{ node.label }}</span>
      <span class="fd-node__sub">{{ node.sub }}</span>
    </button>

    <Transition name="fd-chips">
      <div v-if="active && (hasTools || hasExample)" class="fd-chips">
        <button v-if="hasTools" class="fd-chip" @click.stop="emit('tools', node.id)">
          <span class="fd-chip__caret">›</span> herramientas
        </button>
        <button v-if="hasExample" class="fd-chip" @click.stop="emit('example', node.id)">
          <span class="fd-chip__caret">›</span> ver ejemplo
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fd-node-wrap {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}
.fd-node-wrap--artifact {
  z-index: 1;
}

.fd-node {
  font-family: var(--fd-mono);
  background: var(--fd-surface);
  border: 1px solid var(--fd-border);
  border-radius: 3px;
  padding: 10px 18px;
  min-width: 128px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.fd-node:hover {
  border-color: var(--fd-border-strong);
  background: var(--fd-surface-hover);
  transform: translateY(-1px);
}

.fd-node:focus-visible {
  outline: none;
  border-color: var(--fd-blue);
  box-shadow: 0 0 0 3px rgba(143, 211, 254, 0.18);
}

.fd-node--visited {
  border-color: rgba(255, 255, 255, 0.24);
}

.fd-node--active {
  border-color: var(--fd-orange);
  background: var(--fd-surface-active);
  box-shadow: 0 0 0 3px rgba(255, 176, 137, 0.12), 0 0 24px -8px rgba(255, 176, 137, 0.35);
}

.fd-node--artifact {
  border-style: dashed;
  border-color: var(--fd-border-soft);
  padding: 7px 14px;
  min-width: 100px;
  opacity: 0.85;
}
.fd-node--artifact .fd-node__label {
  color: var(--fd-text-dim);
  font-size: 13px;
}
.fd-node--artifact:hover {
  opacity: 1;
}

.fd-node__label {
  color: var(--fd-blue);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.1;
}
.fd-node--active .fd-node__label {
  color: var(--fd-text);
}

.fd-node__sub {
  color: var(--fd-text-dim);
  font-size: 10.5px;
  letter-spacing: 0.01em;
  line-height: 1.2;
  white-space: nowrap;
}

.fd-chips {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.fd-chip {
  font-family: var(--fd-mono);
  font-size: 10.5px;
  color: var(--fd-text-dim);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 1px 0;
  letter-spacing: 0.02em;
  transition: color 0.15s ease;
}
.fd-chip:hover {
  color: var(--fd-orange);
}
.fd-chip__caret {
  color: var(--fd-orange-dim);
  margin-right: 2px;
}

.fd-chips-enter-active,
.fd-chips-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fd-chips-enter-from,
.fd-chips-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
