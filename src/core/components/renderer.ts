import * as THREE from 'three'
import type { Scene } from './scene'
import type { Camera } from './camera'

export class Renderer {
  private container: HTMLElement | undefined
  public canvasDom: HTMLCanvasElement
  public object: THREE.WebGLRenderer

  constructor(
    public scene: Scene,
    public camera: Camera,
  ) {
    this.object = new THREE.WebGLRenderer()
    this.canvasDom = this.object.domElement
  }

  setSize(width: number, height: number) {
    this.object.setSize(width, height)
  }

  render() {
    this.object.render(this.scene.object, this.camera.object)
  }

  mount(container: HTMLElement) {
    this.container = container
    this.setSize(container.clientWidth, container.clientHeight)
    this.container.appendChild(this.canvasDom)
  }

  observerResize() {
    const observer = new ResizeObserver(() => {
      if (!this.container) {
        throw new Error('Renderer is not mounted')
      }

      const width = this.container.clientWidth
      const height = this.container.clientHeight

      // Update renderer size
      this.setSize(width, height)

      if (this.camera) {
        // Update camera aspect ratio
        this.camera.resize(width, height)
      }
      this.render()
    })

    observer.observe(this.container!)
  }
}
