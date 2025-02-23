<template>
  <div ref="container" class="three-container"></div>
</template>
<script setup lang="ts">
import { Crystal } from '@/core'
import type { StructureData } from '@/core/components/structures'
import type { AtomData } from '@/core/components/structures/atom'
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

// 生成测试数据
function generateTestData(): StructureData {
  const atoms: AtomData[] = Array.from({ length: 10000 }, (_, i) => ({
    name: `C${i}`,
    element: 'C',
    position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5] as [
      number,
      number,
      number,
    ],
    scale: Math.random() * 0.5 + 0.5, // 单个数值表示统一缩放
  }))

  return { atoms }
}

onMounted(() => {
  new InstanceMeshCrystal(container.value!)
})

class InstanceMeshCrystal {
  container: HTMLElement
  crystal: Crystal | undefined

  constructor(container: HTMLElement) {
    this.container = container
    this.init()
  }

  init() {
    const data = generateTestData()
    this.crystal = new Crystal(this.container, data)
  }
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
