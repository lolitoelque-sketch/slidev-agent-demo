<script setup lang="ts">
import { ref } from 'vue'

export interface KnowledgeItem {
  title: string
  sub?: string
  body: string
}

const props = defineProps<{ items: KnowledgeItem[] }>()
const active = ref(0)
</script>

<template>
  <div class="fd-kp">
    <div class="fd-kp__list">
      <button
        v-for="(item, i) in items"
        :key="item.title"
        class="fd-kp__row"
        :class="{ 'fd-kp__row--active': i === active }"
        @click="active = i"
      >
        <span class="fd-kp__row-title">{{ item.title }}</span>
        <span v-if="item.sub" class="fd-kp__row-sub">{{ item.sub }}</span>
      </button>
    </div>
    <div class="fd-kp__detail">
      <div class="fd-kp__detail-title">{{ items[active]?.title }}</div>
      <p class="fd-kp__detail-body">{{ items[active]?.body }}</p>
    </div>
  </div>
</template>

<style scoped>
.fd-kp {
  display: grid;
  grid-template-columns: 240px 1fr;
  border: 1px solid var(--fd-border);
  border-radius: 4px;
  overflow: hidden;
  font-family: var(--fd-mono);
  min-height: 260px;
}

.fd-kp__list {
  border-right: 1px solid var(--fd-border);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.012);
}

.fd-kp__row {
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--fd-border-soft);
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background-color 0.15s ease;
}
.fd-kp__row:hover {
  background: var(--fd-surface-hover);
}
.fd-kp__row--active {
  background: var(--fd-surface-active);
  box-shadow: inset 2px 0 0 var(--fd-orange);
}
.fd-kp__row-title {
  color: var(--fd-blue);
  font-size: 13.5px;
}
.fd-kp__row--active .fd-kp__row-title {
  color: var(--fd-text);
}
.fd-kp__row-sub {
  color: var(--fd-text-faint);
  font-size: 10px;
}

.fd-kp__detail {
  padding: 22px 28px;
}
.fd-kp__detail-title {
  color: var(--fd-orange);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}
.fd-kp__detail-body {
  color: var(--fd-text);
  font-size: 13.5px;
  line-height: 1.65;
}
</style>
