<script setup lang="ts"></script>

<template>
  <div class="fd-legend">
    <div class="fd-legend__item">
      <svg width="22" height="8" viewBox="0 0 22 8"><line x1="0" y1="4" x2="22" y2="4" stroke="var(--fd-orange-dim)" stroke-width="1.75" stroke-dasharray="6 8" stroke-linecap="round" /></svg>
      flujo
    </div>
    <div class="fd-legend__item">
      <svg width="22" height="8" viewBox="0 0 22 8"><line x1="0" y1="4" x2="22" y2="4" stroke="var(--fd-text-faint)" stroke-width="1.5" stroke-dasharray="2 6" stroke-linecap="round" /></svg>
      genera
    </div>
    <div class="fd-legend__item">
      <svg width="22" height="8" viewBox="0 0 22 8"><line x1="0" y1="4" x2="22" y2="4" stroke="var(--fd-blue-dim)" stroke-width="1.5" stroke-dasharray="6 8" stroke-linecap="round" /></svg>
      loop
    </div>
  </div>
</template>

<style scoped>
.fd-legend {
  display: flex;
  gap: 18px;
  font-family: var(--fd-mono);
  font-size: 10.5px;
  color: var(--fd-text-faint);
  letter-spacing: 0.04em;
}
.fd-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
