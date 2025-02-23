import * as THREE from 'three'

/**
 * 相机类
 * 封装 THREE.PerspectiveCamera，用于创建透视相机
 * 透视相机提供一个类似人眼观察的 3D 视角，远处的物体看起来比近处的小
 */
export class Camera {
  /** THREE.js 的透视相机实例 */
  public object: THREE.PerspectiveCamera

  /**
   * 创建相机实例
   * @param fov 视野角度，默认为 75 度
   * @param aspect 画布的宽高比，默认为 1
   * @param near 近裁剪面，默认为 0.1
   * @param far 远裁剪面，默认为 1000
   */
  constructor(fov: number, aspect: number, near: number, far: number) {
    this.object = new THREE.PerspectiveCamera(fov, aspect, near, far)
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
   * 调整相机视角比例
   * 在窗口大小改变时需要调用此方法以保持正确的显示比例
   * @param width 视口宽度
   * @param height 视口高度
   * @returns this 实例，支持链式调用
   */
  resize(width: number, height: number) {
    this.object.aspect = width / height
    this.object.updateProjectionMatrix() // 重新计算投影矩阵
    return this
  }
}
