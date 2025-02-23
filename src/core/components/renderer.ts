import * as THREE from 'three'
import type { Scene } from './scene'
import type { Camera } from './camera'

/**
 * 渲染器类
 * 封装 THREE.WebGLRenderer，负责将 3D 场景渲染到 HTML 画布上
 * 管理渲染尺寸、挂载容器和自适应调整等功能
 */
export class Renderer {
  /**
   * 渲染器的容器元素
   * 用于挂载 canvas 并监听尺寸变化
   * @private
   */
  private container: HTMLElement | undefined

  /**
   * 渲染器创建的 canvas 元素
   * WebGL 渲染的实际显示画布
   * @public
   */
  public canvasDom: HTMLCanvasElement

  /**
   * THREE.js 的 WebGL 渲染器实例
   * 负责实际的 3D 渲染工作
   * @public
   */
  public object: THREE.WebGLRenderer

  /**
   * 创建渲染器实例
   * @param scene 要渲染的场景实例，包含所有 3D 对象和光照
   * @param camera 用于渲染的相机实例，决定观察视角和投影方式
   */
  constructor(
    /** 要渲染的场景实例 */
    public scene: Scene,
    /** 用于渲染的相机实例 */
    public camera: Camera,
  ) {
    this.object = new THREE.WebGLRenderer()
    this.canvasDom = this.object.domElement
  }

  /**
   * 设置渲染器的尺寸
   * @param width 渲染宽度（像素），决定画布的水平分辨率
   * @param height 渲染高度（像素），决定画布的垂直分辨率
   */
  setSize(width: number, height: number): void {
    this.object.setSize(width, height)
  }

  /**
   * 执行场景渲染
   * 使用当前的相机视角渲染场景到画布上
   * 每帧动画都需要调用此方法来更新显示
   */
  render(): void {
    this.object.render(this.scene.object, this.camera.object)
  }

  /**
   * 将渲染器挂载到指定的 HTML 容器中
   * @param container 目标容器元素，必须是已存在于 DOM 中的 HTML 元素
   */
  mount(container: HTMLElement): void {
    this.container = container
    this.setSize(container.clientWidth, container.clientHeight)
    this.container.appendChild(this.canvasDom)
  }

  /**
   * 监听容器尺寸变化并自动调整渲染尺寸
   * 当容器大小改变时，自动更新渲染器和相机的参数
   * 使用 ResizeObserver API 实现响应式调整
   * @throws {Error} 如果渲染器未挂载到容器上（container 未定义）
   */
  observerResize(): void {
    const observer = new ResizeObserver(() => {
      if (!this.container) {
        throw new Error('Renderer is not mounted')
      }

      const width = this.container.clientWidth
      const height = this.container.clientHeight

      // 更新渲染器尺寸
      this.setSize(width, height)

      if (this.camera) {
        // 更新相机视角比例
        this.camera.resize(width, height)
      }
      this.render()
    })

    observer.observe(this.container!)
  }
}
