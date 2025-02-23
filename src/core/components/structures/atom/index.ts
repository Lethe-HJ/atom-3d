import * as THREE from 'three'
import elementColors from './colors.json'
import elementRadius from './radius.json'

export interface AtomData {
  name: string
  element: string
  position: [number, number, number]
}

/**
 * 原子类
 * 管理单个原子的几何体、材质和变换
 */
export class Atoms {
  /** 原子的基础几何体（单位半径） */
  private static geometry = new THREE.SphereGeometry(1, 32, 32)

  /** 缩放系数，用于调整整体显示大小 */
  private static SCALE_FACTOR = 0.3

  /**
   * 获取元素对应的颜色
   * @param element 元素符号
   * @returns 颜色值（十六进制）
   */
  private static getElementColor(element: string): number {
    const colorStr = elementColors[element as keyof typeof elementColors]
    return colorStr ? parseInt(colorStr) : 0x808080 // 默认使用灰色
  }

  /**
   * 获取元素对应的半径
   * @param element 元素符号
   * @returns 原子半径（埃米）
   */
  private static getElementRadius(element: string): number {
    return (elementRadius[element as keyof typeof elementRadius] || 1.0) * this.SCALE_FACTOR
  }

  /**
   * 创建原子实例集合
   * @param atoms 原子数据数组
   * @returns THREE.InstancedMesh 实例
   */
  static createInstances(atoms: AtomData[]): THREE.InstancedMesh {
    const instances = new THREE.InstancedMesh(
      this.geometry,
      new THREE.MeshPhongMaterial(),
      atoms.length
    )

    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()

    atoms.forEach((atom, index) => {
      // 设置位置和缩放
      const [x, y, z] = atom.position
      const radius = this.getElementRadius(atom.element)
      matrix.makeScale(radius, radius, radius)
      matrix.setPosition(x, y, z)
      instances.setMatrixAt(index, matrix)

      // 设置颜色
      color.setHex(this.getElementColor(atom.element))
      instances.setColorAt(index, color)
    })

    return instances
  }

  /**
   * 更新原子实例的变换和颜色
   * @param instance 原子实例
   * @param atoms 原子数据数组
   */
  static updateInstances(instance: THREE.InstancedMesh, atoms: AtomData[]): void {
    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()

    atoms.forEach((atom, index) => {
      // 更新位置和缩放
      const [x, y, z] = atom.position
      const radius = this.getElementRadius(atom.element)
      matrix.makeScale(radius, radius, radius)
      matrix.setPosition(x, y, z)
      instance.setMatrixAt(index, matrix)

      // 更新颜色
      color.setHex(this.getElementColor(atom.element))
      instance.setColorAt(index, color)
    })

    instance.instanceMatrix.needsUpdate = true
    instance.instanceColor!.needsUpdate = true
  }
}
