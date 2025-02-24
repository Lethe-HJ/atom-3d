import * as THREE from 'three'
import { Scene } from '../scene'

export class LatticeAxes {
  private axesGroup: THREE.Group
  private arrowHelpers: THREE.ArrowHelper[] = []
  private labels: THREE.Sprite[] = []

  constructor(
    private latticeParams: {
      a: number
      b: number
      c: number
      alpha: number
      beta: number
      gamma: number
    },
    private scale: number = 0.2,
    private length: number = 2,
  ) {
    this.axesGroup = new THREE.Group()
    this.createAxes()
  }

  /**
   * 创建晶格坐标轴
   */
  private createAxes() {
    // 转换晶格参数为弧度
    const alpha = THREE.MathUtils.degToRad(this.latticeParams.alpha)
    const beta = THREE.MathUtils.degToRad(this.latticeParams.beta)
    const gamma = THREE.MathUtils.degToRad(this.latticeParams.gamma)

    // 创建 a 轴 (红色)
    const aDir = new THREE.Vector3(1, 0, 0)
    this.createArrow(aDir, 0xff0000, 'a')

    // 创建 b 轴 (绿色)
    const bDir = new THREE.Vector3(Math.cos(gamma), Math.sin(gamma), 0)
    this.createArrow(bDir, 0x00ff00, 'b')

    // 创建 c 轴 (蓝色)
    const cDir = new THREE.Vector3(
      Math.cos(beta),
      (Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma)) / Math.sin(gamma),
      Math.sqrt(
        1 -
          Math.pow(Math.cos(beta), 2) -
          Math.pow((Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma)) / Math.sin(gamma), 2),
      ),
    )
    this.createArrow(cDir, 0x0000ff, 'c')
  }

  /**
   * 创建箭头和标签
   */
  private createArrow(direction: THREE.Vector3, color: number, label: string) {
    // 归一化方向向量
    direction.normalize()

    // 创建箭头
    const origin = new THREE.Vector3(0, 0, 0)
    const length = this.length
    const arrowHelper = new THREE.ArrowHelper(
      direction,
      origin,
      length,
      color,
      length * 0.2, // 箭头头部长度
      length * 0.1, // 箭头头部宽度
    )
    this.arrowHelpers.push(arrowHelper)
    this.axesGroup.add(arrowHelper)

    // 创建标签
    const labelPos = direction.multiplyScalar(length * 1.2)
    const sprite = this.createTextSprite(label, color)
    sprite.position.copy(labelPos)
    this.labels.push(sprite)
    this.axesGroup.add(sprite)
  }

  /**
   * 创建文本精灵
   */
  private createTextSprite(text: string, color: number): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 64
    canvas.height = 64

    context.font = 'Bold 40px Arial'
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(0.5, 0.5, 1)

    return sprite
  }

  /**
   * 将坐标轴添加到场景
   */
  addToScene(scene: Scene) {
    scene.add(this.axesGroup)
  }

  /**
   * 从场景中移除坐标轴
   */
  removeFromScene(scene: Scene) {
    scene.remove(this.axesGroup)
  }

  /**
   * 更新晶格参数
   */
  updateLatticeParams(params: {
    a: number
    b: number
    c: number
    alpha: number
    beta: number
    gamma: number
  }) {
    this.latticeParams = params
    // 清除现有的箭头和标签
    this.arrowHelpers.forEach((arrow) => this.axesGroup.remove(arrow))
    this.labels.forEach((label) => this.axesGroup.remove(label))
    this.arrowHelpers = []
    this.labels = []
    // 重新创建坐标轴
    this.createAxes()
  }
}
