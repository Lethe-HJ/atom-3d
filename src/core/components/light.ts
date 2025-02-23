import * as THREE from 'three'
import type { Scene } from './scene'

/**
 * 光照类
 * 封装了场景中的基础光照系统，包含环境光和点光源
 * 环境光：提供整个场景的基础亮度
 * 点光源：从一个点向所有方向发射的光源，类似灯泡
 */
export class Light {
  /** THREE.js 的环境光实例 */
  private ambientLight: THREE.AmbientLight

  /** THREE.js 的点光源实例 */
  private pointLight: THREE.PointLight

  /**
   * 创建光照系统实例
   * @param ambientColor 环境光颜色，默认为白色 0xffffff
   * @param ambientIntensity 环境光强度，默认为 0.1
   * @param pointColor 点光源颜色，默认为白色 0xffffff
   * @param pointIntensity 点光源强度，默认为 10
   */
  constructor(
    ambientColor: number = 0xffffff,
    ambientIntensity: number = 0.1,
    pointColor: number = 0xffffff,
    pointIntensity: number = 10
  ) {
    // 创建环境光
    this.ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity)
    // 创建点光源
    this.pointLight = new THREE.PointLight(pointColor, pointIntensity)
    // 设置点光源的默认位置
    this.setPointLightPosition(2, 2, 2)
  }

  /**
   * 设置点光源的位置
   * @param x X 轴坐标
   * @param y Y 轴坐标
   * @param z Z 轴坐标
   */
  setPointLightPosition(x: number, y: number, z: number): void {
    this.pointLight.position.set(x, y, z)
  }

  /**
   * 设置点光源的强度
   * @param intensity 光照强度，值越大光照越强
   */
  setPointLightIntensity(intensity: number): void {
    this.pointLight.intensity = intensity
  }

  /**
   * 设置环境光的强度
   * @param intensity 光照强度，值越大环境光越强
   */
  setAmbientLightIntensity(intensity: number): void {
    this.ambientLight.intensity = intensity
  }

  /**
   * 将光源添加到场景中
   * @param scene 场景实例
   */
  addToScene(scene: Scene): void {
    scene.add(this.ambientLight)
    scene.add(this.pointLight)
  }

  /**
   * 获取环境光实例
   * @returns THREE.AmbientLight 实例
   */
  getAmbientLight(): THREE.AmbientLight {
    return this.ambientLight
  }

  /**
   * 获取点光源实例
   * @returns THREE.PointLight 实例
   */
  getPointLight(): THREE.PointLight {
    return this.pointLight
  }
}
