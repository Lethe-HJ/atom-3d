import { Scene } from './components/scene'
import { Renderer } from './components/renderer'
import { Camera } from './components/camera'
import { Structures, type StructureData } from './components/structures'
import { Orbit } from './controllers/Orbit'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { LatticeAxes } from './components/axes/lattice'
import { Signal } from './utils/signal'
import { AmbientLight } from './components/light/ambient'
import { PointLight } from './components/light/point'

declare global {
  interface Window {
    crystal: Crystal
  }
}

/**
 * 3D 可视化应用的核心类
 * 管理所有组件和控制器，协调它们之间的交互
 * 负责初始化、渲染循环和资源管理
 */
export class Crystal {
  private stats?: Stats
  readonly readySignal = new Signal()
  /**
   * 应用的核心组件集合
   * 包含场景、相机、渲染器等基础组件
   * @public
   */
  public components: {
    axes: LatticeAxes
    scene: Scene
    camera: Camera
    renderer: Renderer
    ambientLight: AmbientLight
    pointLight: PointLight
    structures: Structures
  } = {
    axes: null!,
    scene: null!,
    camera: null!,
    renderer: null!,
    ambientLight: null!,
    pointLight: null!,
    structures: null!,
  }

  /**
   * 应用的控制器集合
   * 包含用户交互相关的控制器
   * @public
   */
  public controllers: {
    orbit: Orbit
  } = {
    orbit: null!,
  }

  private enableStats: boolean = import.meta.env.DEV

  /**
   * 创建应用实例
   * @param dom 渲染容器元素
   * @param data 结构数据
   */
  constructor(
    public dom: HTMLElement,
    public data: StructureData,
  ) {
    window.crystal = this
    this.init()
  }

  /**
   * 初始化应用
   * 按顺序初始化组件和控制器，启动渲染循环
   */
  init() {
    this.initComponents()
    this.initControllers()
    if (this.enableStats) {
      this.initStats()
    }
    this.readySignal.dispatch()
    this.animate()
  }

  /**
   * 初始化所有核心组件
   * 创建并配置场景、相机、渲染器等组件
   */
  initComponents() {
    const scene = new Scene(0xffffff)
    this.components.scene = scene
    const camera = new Camera(10, 1)
    this.components.camera = camera
    camera.setPosition(0, 0, 5)
    const renderer = new Renderer(scene, camera)
    this.components.renderer = renderer
    renderer.mount(this.dom)
    renderer.observerResize()

    // 初始化光源
    const ambientLight = new AmbientLight()
    this.components.ambientLight = ambientLight
    ambientLight.addToScene(scene)

    const pointLight = new PointLight()
    this.components.pointLight = pointLight
    pointLight.addToCamera(camera)

    const structures = new Structures(this.data)
    this.components.structures = structures
    structures.addToScene(scene)

    // 如果数据中包含晶格参数，则创建晶格坐标轴
    if (this.data?.latticeParameters) {
      const axes = new LatticeAxes(this.data.latticeParameters)
      this.components.axes = axes
      // axes.addToScene(scene)
      camera.add(axes)
      camera.addToScene(scene)
    }
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
    this.controllers.orbit = orbit
  }

  /**
   * 初始化性能监测
   */
  private initStats() {
    this.stats = new Stats()
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = '0px'
    this.dom.appendChild(this.stats.dom)
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
    if (this.stats) {
      this.stats.begin()
    }
    this.render()
    if (this.stats) {
      this.stats.end()
    }
  }
}
