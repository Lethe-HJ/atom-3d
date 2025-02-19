<template>
  <div ref="container" class="three-container"></div>
</template>
<script setup lang="ts">
import { Crystal } from '@/core'
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  new InstanceMeshCrystal(container.value!)
})

class InstanceMeshCrystal {
  constructor(container: HTMLElement) {
    this.container = container
    this.init()
  }

  init() {
    this.crystal = new Crystal(this.container)
  }
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
