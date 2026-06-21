<script setup lang="ts">
import { computed } from 'vue'
import { journey, nodeById } from '../composables/flowData'

const props = defineProps<{ currentId: string | null }>()
const emit = defineEmits<{ go: [id: string] }>()

const index = computed(() => {
  const i = journey.indexOf(props.currentId ?? '')
  return i === -1 ? -1 : i
})

const current = computed(() => (props.currentId ? nodeById(props.currentId) : null))

const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value === -1 ? true : index.value < journey.length - 1)

function prev() {
  if (canPrev.value) emit('go', journey[index.value - 1])
}
function next() {
  if (index.value === -1) emit('go', journey[0])
  else if (canNext.value) emit('go', journey[index.value + 1])
}
</script>

<template>
  <div class="fd-route-nav">
    <button class="fd-route-nav__btn" :disabled="!canPrev" @click="prev" aria-label="Paso anterior">‹</button>

    <div class="fd-route-nav__status">
      <span class="fd-route-nav__count">{{ index === -1 ? '00' : String(index + 1).padStart(2, '0') }} / {{ String(journey.length).padStart(2, '0') }}</span>
      <span class="fd-route-nav__name">{{ current ? current.label : 'overview' }}</span>
    </div>

    <button class="fd-route-nav__btn fd-route-nav__btn--next" @click="next" aria-label="Continuar journey">›</button>
  </div>
</template>

<style scoped>
.fd-route-nav {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--fd-mono);
  background: rgba(15, 17, 21, 0.75);
  border: 1px solid var(--fd-border);
  border-radius: 4px;
  padding: 8px 10px;
  backdrop-filter: blur(6px);
}

.fd-route-nav__btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--fd-border);
  border-radius: 3px;
  color: var(--fd-text-dim);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: all 0.15s ease;
}
.fd-route-nav__btn:hover:not(:disabled) {
  border-color: var(--fd-orange);
  color: var(--fd-orange);
}
.fd-route-nav__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.fd-route-nav__btn--next {
  border-color: var(--fd-orange-dim);
  color: var(--fd-orange);
}

.fd-route-nav__status {
  display: flex;
  flex-direction: column;
  min-width: 86px;
  line-height: 1.25;
}
.fd-route-nav__count {
  font-size: 9.5px;
  color: var(--fd-text-faint);
  letter-spacing: 0.06em;
}
.fd-route-nav__name {
  font-size: 12.5px;
  color: var(--fd-blue);
}
</style>
