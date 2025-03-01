import * as THREE from 'three'
import type { Scene } from './scene'

/**
 * 相机类
 * 封装 THREE.OrthographicCamera，用于创建正交相机
 * 正交相机提供一个无透视效果的视图，远近物体大小相同
 * 适合用于分子结构等需要精确尺寸的场景
 */
export class Camera {
  /** THREE.js 的正交相机实例 */
  public object: THREE.OrthographicCamera

  /**
   * 创建相机实例
   * @param frustumSize 视锥体大小，决定视野范围
   * @param aspect 画布的宽高比，默认为 1
   */
  constructor(frustumSize: number = 10, aspect: number = 1) {
    const halfSize = frustumSize / 2
    this.object = new THREE.OrthographicCamera(
      -halfSize * aspect,  // left
      halfSize * aspect,   // right
      halfSize,           // top
      -halfSize,          // bottom
      0.1,               // near
      1000               // far
    )
  }

  /**
   * 设置相机的位置
   * @param x X 轴坐标
   * @param y Y 轴坐标
   * @param z Z 轴坐标
   * @returns this 实例，支持链式调用
   */
  setPosition(x: number, y: number, z: number) {
    this.object.position.set(x, y, z)
    return this
  }

  /**
   * 调整相机视野范围
   * 在窗口大小改变时需要调用此方法以保持正确的显示比例
   * @param width 视口宽度
   * @param height 视口高度
   * @returns this 实例，支持链式调用
   */
  resize(width: number, height: number) {
    const aspect = width / height
    const frustumSize = Math.abs(this.object.top - this.object.bottom)
    const halfSize = frustumSize / 2

    this.object.left = -halfSize * aspect
    this.object.right = halfSize * aspect
    this.object.top = halfSize
    this.object.bottom = -halfSize
    this.object.updateProjectionMatrix()
    return this
  }

  /**
   * 将相机添加到场景中
   * @param scene 目标场景
   */
  addToScene(scene: Scene): void {
    scene.add(this.object)
  }

  /**
   * 添加对象到相机
   * @param object 要添加的对象
   */
  add(object: Atom3DObject): void {
    this.object.add(object.object)
  }

  /**
   * 从相机移除对象
   * @param object 要移除的对象
   */
  remove(object: Atom3DObject): void {
    this.object.remove(object.object)
  }
}
