<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { Crystal } from '@/core'
import { JsonParser } from '@/core/parser/json'
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!container.value) return

  const data = await JsonParser.fromFile('/structures/LiFePO4.json')
  new Crystal(container.value, data)
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
