import * as THREE from 'three'

/**
 * 场景类
 * 封装 THREE.Scene，作为所有 3D 对象的容器
 * 管理场景中的对象、光照和背景等属性
 */
export class Scene {
  /**
   * THREE.js 的场景实例
   * 用于存放所有需要渲染的 3D 对象、光照和其他场景元素
   * @public
   */
  public object: THREE.Scene

  /**
   * 创建场景实例
   * @param backgroundColor 场景背景色，支持十六进制颜色值（如 0xffffff）或其他 Three.js 支持的颜色表示方式
   */
  constructor(backgroundColor: THREE.ColorRepresentation) {
    this.object = new THREE.Scene()
    this.object.background = new THREE.Color(backgroundColor)
  }

  /**
   * 获取原始的 THREE.Scene 实例
   * @returns THREE.Scene 实例，可用于直接操作底层场景对象
   */
  getObject(): THREE.Scene {
    return this.object
  }

  /**
   * 向场景中添加 3D 对象
   * @param object 要添加的 3D 对象，可以是网格、光源、辅助器等任何 THREE.Object3D 的子类
   */
  add(object: THREE.Object3D): void {
    this.object.add(object)
  }

  /**
   * 从场景中移除 3D 对象
   * @param object 要移除的 3D 对象，必须是已经添加到场景中的对象
   */
  remove(object: THREE.Object3D): void {
    this.object.remove(object)
  }
}
