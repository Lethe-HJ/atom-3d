import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Camera } from '../components/camera'
import type { Renderer } from '../components/renderer'

export class Orbit {
  private object: OrbitControls
  constructor(
    public camera: Camera,
    public renderer: Renderer,
  ) {
    this.object = new OrbitControls(camera.object, renderer.canvasDom)
  }

  update() {
    this.object.update()
    this.renderer.render()
  }
}
