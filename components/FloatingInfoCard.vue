<script setup lang="ts">
import { computed } from 'vue'
import { STAGE_W, STAGE_H } from '../composables/flowData'

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    text: string
    variant?: 'blue' | 'orange' | 'dim'
  }>(),
  { variant: 'dim' }
)

const style = computed(() => ({
  left: `${(props.x / STAGE_W) * 100}%`,
  top: `${(props.y / STAGE_H) * 100}%`,
}))
</script>

<template>
  <div class="fd-info-card" :style="style" :class="`fd-info-card--${variant}`">
    {{ text }}
  </div>
</template>

<style scoped>
.fd-info-card {
  position: absolute;
  transform: translate(-50%, -50%);
  font-family: var(--fd-mono);
  font-size: 10.5px;
  letter-spacing: 0.02em;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--fd-border-soft);
  background: rgba(15, 17, 21, 0.7);
  backdrop-filter: blur(2px);
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
.fd-info-card--blue { color: var(--fd-blue); border-color: rgba(143, 211, 254, 0.25); }
.fd-info-card--orange { color: var(--fd-orange); border-color: rgba(255, 176, 137, 0.25); }
.fd-info-card--dim { color: var(--fd-text-dim); }
</style>
