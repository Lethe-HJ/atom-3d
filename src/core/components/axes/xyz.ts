import * as THREE from 'three'
import { Scene } from '../scene'

/**
 * 坐标轴辅助类
 * 用于在场景中显示 XYZ 三维坐标轴
 * X 轴为红色，Y 轴为绿色，Z 轴为蓝色
 */
export class Axes {
  /** THREE.js 的坐标轴辅助器实例 */
  private axesHelper: THREE.AxesHelper

  /**
   * 创建坐标轴辅助器实例
   * @param size 坐标轴的长度，默认为 2 个单位长度
   */
  constructor(size: number = 2) {
    this.axesHelper = new THREE.AxesHelper(size)
  }

  /**
   * 设置坐标轴的大小
   * @param size 坐标轴的长度
   */
  setSize(size: number) {
    // 由于 THREE.AxesHelper 不支持直接修改大小，需要重新创建
    this.axesHelper.dispose()
    this.axesHelper = new THREE.AxesHelper(size)
  }

  /**
   * 设置坐标轴的可见性
   * @param visible 是否可见
   */
  setVisible(visible: boolean) {
    this.axesHelper.visible = visible
  }

  /**
   * 将坐标轴添加到场景中
   * @param scene 场景实例
   */
  addToScene(scene: Scene) {
    scene.add(this.axesHelper)
  }

  /**
   * 从场景中移除坐标轴
   * @param scene 场景实例
   */
  removeFromScene(scene: Scene) {
    scene.remove(this.axesHelper)
  }

  /**
   * 获取原始的 THREE.AxesHelper 实例
   * @returns THREE.AxesHelper 实例
   */
  getObject() {
    return this.axesHelper
  }
}
