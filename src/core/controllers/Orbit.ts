import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Camera } from '../components/camera'
import type { Renderer } from '../components/renderer'

/**
 * 轨道控制器类
 * 封装 THREE.OrbitControls，用于实现相机轨道控制
 * 提供鼠标交互功能：
 * - 左键拖动：旋转视角
 * - 右键拖动：平移视角
 * - 滚轮：缩放视角
 */
export class Orbit {
  /**
   * THREE.js 的轨道控制器实例
   * 用于处理用户输入并更新相机位置
   * @private
   */
  private object: OrbitControls

  /**
   * 创建轨道控制器实例
   * @param camera 要控制的相机实例
   * @param renderer 渲染器实例，用于获取交互的 DOM 元素
   */
  constructor(
    /** 要控制的相机实例 */
    public camera: Camera,
    /** 渲染器实例 */
    public renderer: Renderer,
  ) {
    this.object = new OrbitControls(camera.object, renderer.canvasDom)
  }

  /**
   * 更新控制器状态
   * 在每帧动画中调用此方法以更新相机位置
   * 并重新渲染场景以显示更新后的视角
   */
  update(): void {
    this.object.update()
    this.renderer.render()
  }
}
