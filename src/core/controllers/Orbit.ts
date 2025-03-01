import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Camera } from '../components/camera'
import type { Renderer } from '../components/renderer'
import { Signal } from '../utils/signal'
import * as THREE from 'three'

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
   * 旋转事件信号
   * 当场景旋转时触发，传递当前的旋转矩阵
   */
  readonly rotationSignal = new Signal<THREE.Quaternion>()
  readonly positionSignal = new Signal<THREE.Vector3>()
  /**
   * THREE.js 的轨道控制器实例
   * 用于处理用户输入并更新相机位置
   * @private
   */
  private object: OrbitControls
  private lastMatrix = new THREE.Matrix4()
  private position = new THREE.Vector3()
  private quaternion = new THREE.Quaternion()
  private scale = new THREE.Vector3()

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
    this.init()
  }

  private init() {
    this.lastMatrix = new THREE.Matrix4()
    const currentMatrix = this.object.object.matrix

    // 分解矩阵获取各个分量
    currentMatrix.decompose(this.position, this.quaternion, this.scale)
    console.log(this.position, this.quaternion, this.scale)
    this.object.addEventListener('change', () => {
      // 当前矩阵：分解后对旋转和位置分别求逆
      const currentMatrix = this.object.object.matrix

      // 分解矩阵获取各个分量
      currentMatrix.decompose(this.position, this.quaternion, this.scale)

      // 对旋转和位置求逆
      this.quaternion.invert()
      this.position.negate()

      if (!this.lastMatrix.equals(currentMatrix)) {
        this.rotationSignal.dispatch(this.quaternion)
        this.positionSignal.dispatch(this.position)
        this.lastMatrix.copy(currentMatrix)
      }
    })
  }

  /**
   * 获取当前旋转矩阵
   */
  getRotationMatrix(): THREE.Matrix4 {
    return this.lastMatrix.clone()
  }
}
