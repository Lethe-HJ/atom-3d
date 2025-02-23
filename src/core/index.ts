import { Scene } from './components/scene'
import { Renderer } from './components/renderer'
import { Camera } from './components/camera'
import { Light } from './components/light'
import { Axes } from './components/axes'
import { Structures, type StructureData } from './components/structures'
import { Orbit } from './controllers/Orbit'

/**
 * 3D 可视化应用的核心类
 * 管理所有组件和控制器，协调它们之间的交互
 * 负责初始化、渲染循环和资源管理
 */
export class Crystal {
  /**
   * 应用的核心组件集合
   * 包含场景、相机、渲染器等基础组件
   * @public
   */
  public components: {
    axes: Axes
    scene: Scene
    camera: Camera
    renderer: Renderer
    light: Light
    structures: Structures
  } = {
    axes: null!,
    scene: null!,
    camera: null!,
    renderer: null!,
    light: null!,
    structures: null!
  }

  /**
   * 应用的控制器集合
   * 包含用户交互相关的控制器
   * @public
   */
  public controllers: {
    orbit: Orbit
  } = {
    orbit: null!
  }

  /**
   * 创建应用实例
   * @param dom 渲染容器元素
   * @param data 结构数据
   */
  constructor(public dom: HTMLElement, public data?: StructureData) {
    this.init()
  }

  /**
   * 初始化应用
   * 按顺序初始化组件和控制器，启动渲染循环
   */
  init() {
    this.initComponents()
    this.initControllers()
    this.animate()
  }

  /**
   * 初始化所有核心组件
   * 创建并配置场景、相机、渲染器等组件
   */
  initComponents() {
    const scene = new Scene(0xffffff)
    this.components.scene = scene
    const camera = new Camera(75, 1, 0.1, 1000)
    this.components.camera = camera
    camera.setPosition(0, 0, 5)
    const renderer = new Renderer(scene, camera)
    this.components.renderer = renderer
    renderer.mount(this.dom)
    renderer.observerResize()
    const light = new Light()
    this.components.light = light
    light.addToScene(scene)
    const axes = new Axes(2)
    this.components.axes = axes
    axes.addToScene(scene)
    const structures = new Structures(this.data)
    this.components.structures = structures
    structures.addToScene(scene)
  }

  /**
   * 更新结构数据
   * @param data 新的结构数据
   */
  updateStructure(data: StructureData): void {
    this.components.structures.updateStructure(data)
  }

  /**
   * 初始化所有控制器
   * 创建并配置轨道控制器等交互组件
   */
  initControllers() {
    const orbit = new Orbit(this.components.camera, this.components.renderer)
    orbit.update()
    this.controllers.orbit = orbit
  }

  /**
   * 执行场景渲染
   * 使用当前的相机视角渲染场景
   */
  render() {
    this.components.renderer.render()
  }

  /**
   * 动画循环函数
   * 使用箭头函数以保持正确的 this 上下文
   * 持续更新渲染，实现动画效果
   */
  animate = () => {
    requestAnimationFrame(this.animate)
    this.render()
  }
}
