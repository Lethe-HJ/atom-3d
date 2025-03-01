import * as THREE from 'three'
import type { Scene } from '../scene'
import { Atoms, type AtomData } from './atom'

export interface StructureData {
  atoms: AtomData[]
  latticeParameters?: {
    a: number
    b: number
    c: number
    alpha: number
    beta: number
    gamma: number
  }
}

/**
 * 结构模型类
 * 管理场景中的原子/分子结构模型
 */
export class Structures {
  /** 结构组，包含所有原子/分子模型 */
  private object: THREE.Group
  /** 原子实例集合 */
  private atomInstances: THREE.InstancedMesh | null = null

  constructor(data?: StructureData) {
    this.object = new THREE.Group()
    if (data) {
      this.updateStructure(data)
    }
  }

  /**
   * 更新结构数据
   * @param data 结构数据，包含原子信息
   */
  updateStructure(data: StructureData): void {
    // 清除现有结构
    this.object.clear()

    // 创建或更新原子实例
    if (!this.atomInstances || this.atomInstances.count !== data.atoms.length) {
      this.atomInstances = Atoms.createInstances(data.atoms)
      this.object.add(this.atomInstances)
    } else {
      Atoms.updateInstances(this.atomInstances, data.atoms)
    }
  }

  /**
   * 将结构添加到场景中
   * @param scene 目标场景
   */
  addToScene(scene: Scene): void {
    scene.add(this.object)
  }
}
