<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup lang="ts">
import { Crystal } from '@/core'
import type { StructureData } from '@/core/components/structures'
import type { AtomData } from '@/core/components/structures/atom'
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

/**
 * 生成磷酸铁锂(LiFePO4)的结构数据
 * 使用简化的正交晶系结构
 * 参考文献: https://doi.org/10.1016/j.jpowsour.2004.12.001
 */
function generateLiFePO4Structure(): StructureData {
  const atoms: AtomData[] = []
  const unitCell = {
    a: 10.33, // 晶胞参数 a (Å)
    b: 6.01, // 晶胞参数 b (Å)
    c: 4.69, // 晶胞参数 c (Å)
  }

  // 缩放因子，将晶胞参数缩小到适合显示的大小
  const scale = 0.2

  // 生成 2x2x2 的超胞
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        // 锂原子位置 (Li)
        atoms.push({
          name: `Li_${i}${j}${k}`,
          element: 'Li',
          position: [
            (i + 0.0) * unitCell.a * scale,
            (j + 0.0) * unitCell.b * scale,
            (k + 0.0) * unitCell.c * scale,
          ] as [number, number, number],
          scale: 0.4,
        })

        // 铁原子位置 (Fe)
        atoms.push({
          name: `Fe_${i}${j}${k}`,
          element: 'Fe',
          position: [
            (i + 0.5) * unitCell.a * scale,
            (j + 0.25) * unitCell.b * scale,
            (k + 0.5) * unitCell.c * scale,
          ] as [number, number, number],
          scale: 0.5,
        })

        // 磷原子位置 (P)
        atoms.push({
          name: `P_${i}${j}${k}`,
          element: 'P',
          position: [
            (i + 0.25) * unitCell.a * scale,
            (j + 0.75) * unitCell.b * scale,
            (k + 0.25) * unitCell.c * scale,
          ] as [number, number, number],
          scale: 0.4,
        })

        // 氧原子位置 (O) - 每个单元4个氧原子
        for (let o = 0; o < 4; o++) {
          const oPositions = [
            [i + 0.25, j + 0.25, k + 0.25],
            [i + 0.75, j + 0.25, k + 0.75],
            [i + 0.25, j + 0.75, k + 0.75],
            [i + 0.75, j + 0.75, k + 0.25],
          ]
          atoms.push({
            name: `O_${i}${j}${k}_${o}`,
            element: 'O',
            position: [
              oPositions[o][0] * unitCell.a * scale,
              oPositions[o][1] * unitCell.b * scale,
              oPositions[o][2] * unitCell.c * scale,
            ] as [number, number, number],
            scale: 0.3,
          })
        }
      }
    }
  }

  // 将结构中心移到原点
  const center = {
    x: unitCell.a * scale,
    y: unitCell.b * scale,
    z: unitCell.c * scale,
  }
  atoms.forEach((atom) => {
    atom.position[0] -= center.x
    atom.position[1] -= center.y
    atom.position[2] -= center.z
  })

  return { atoms }
}

onMounted(() => {
  new LiFePO4Crystal(container.value!)
})

class LiFePO4Crystal {
  container: HTMLElement
  crystal: Crystal | undefined

  constructor(container: HTMLElement) {
    this.container = container
    this.init()
  }

  init() {
    const data = generateLiFePO4Structure()
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
