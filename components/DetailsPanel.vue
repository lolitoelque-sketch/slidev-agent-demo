<script setup lang="ts">
import { computed } from 'vue'
import type { PanelItem } from '../composables/flowData'

const props = defineProps<{
  visible: boolean
  eyebrow: string
  items: PanelItem[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  'update:index': [i: number]
}>()

const current = computed(() => props.items[props.index])
const canPrev = computed(() => props.index > 0)
const canNext = computed(() => props.index < props.items.length - 1)

function prev() {
  if (canPrev.value) emit('update:index', props.index - 1)
}
function next() {
  if (canNext.value) emit('update:index', props.index + 1)
}
</script>

<template>
  <Transition name="fd-panel">
    <div v-if="visible && current" class="fd-panel-backdrop" @click.self="emit('close')">
      <button class="fd-panel-close" aria-label="Cerrar" @click="emit('close')">×</button>

      <div class="fd-panel-body">
        <div class="fd-panel-left">
          <div class="fd-eyebrow fd-panel-eyebrow">{{ eyebrow }}</div>
          <div class="fd-panel-name">{{ current.name }}</div>
          <p class="fd-panel-desc">{{ current.description }}</p>
        </div>

        <div class="fd-panel-right">
          <div class="fd-code-box">
            <div v-if="current.codeLabel" class="fd-code-box__label">{{ current.codeLabel }}</div>
            <pre class="fd-code-box__code">{{ current.code }}</pre>
          </div>
        </div>
      </div>

      <div class="fd-panel-pager">
        <button class="fd-pager-btn" :disabled="!canPrev" @click="prev">‹</button>
        <span class="fd-pager-count">{{ index + 1 }} / {{ items.length }}</span>
        <button class="fd-pager-btn fd-pager-btn--active" :disabled="!canNext" @click="next">›</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fd-panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 17, 21, 0.82);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fd-panel-close {
  position: absolute;
  top: 28px;
  right: 36px;
  background: transparent;
  border: none;
  color: var(--fd-text-dim);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  font-family: var(--fd-mono);
  transition: color 0.15s ease;
}
.fd-panel-close:hover {
  color: var(--fd-text);
}

.fd-panel-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  padding: 0 11%;
  flex-wrap: wrap;
}

.fd-panel-left {
  max-width: 480px;
  flex: 1 1 360px;
}

.fd-panel-eyebrow {
  margin-bottom: 18px;
}

.fd-panel-name {
  font-family: var(--fd-mono);
  font-size: 30px;
  font-weight: 600;
  color: var(--fd-orange);
  margin-bottom: 22px;
  line-height: 1.15;
}

.fd-panel-desc {
  font-family: var(--fd-mono);
  font-size: 16px;
  line-height: 1.55;
  color: var(--fd-text);
}

.fd-panel-right {
  flex: 1 1 360px;
  display: flex;
  justify-content: flex-start;
}

.fd-code-box {
  border: 1px solid var(--fd-border);
  border-radius: 3px;
  padding: 18px 22px;
  min-width: 320px;
  background: rgba(255, 255, 255, 0.015);
}

.fd-code-box__label {
  font-family: var(--fd-mono);
  font-size: 10.5px;
  color: var(--fd-text-faint);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.fd-code-box__code {
  font-family: var(--fd-mono);
  font-size: 14px;
  color: var(--fd-blue);
  white-space: pre-wrap;
  line-height: 1.6;
  margin: 0;
}

.fd-panel-pager {
  position: absolute;
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 18px;
}

.fd-pager-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--fd-border);
  background: transparent;
  color: var(--fd-text-dim);
  border-radius: 3px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.fd-pager-btn:hover:not(:disabled) {
  border-color: var(--fd-orange);
  color: var(--fd-orange);
}
.fd-pager-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.fd-pager-btn--active {
  border-color: var(--fd-orange);
  color: var(--fd-orange);
}

.fd-pager-count {
  font-family: var(--fd-mono);
  font-size: 12.5px;
  color: var(--fd-text-dim);
  min-width: 36px;
  text-align: center;
}

.fd-panel-enter-active,
.fd-panel-leave-active {
  transition: opacity 0.2s ease;
}
.fd-panel-enter-from,
.fd-panel-leave-to {
  opacity: 0;
}
</style>
