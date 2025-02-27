import * as THREE from 'three'
import type { Scene } from '../scene'

export class AmbientLight {
  public object: THREE.AmbientLight

  constructor(color: number = 0xffffff, intensity: number = 0.5) {
    this.object = new THREE.AmbientLight(color, intensity)
  }

  addToScene(scene: Scene): void {
    scene.add(this.object)
  }

  removeFromScene(scene: Scene): void {
    scene.remove(this.object)
  }
}
