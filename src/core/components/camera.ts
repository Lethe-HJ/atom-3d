import * as THREE from 'three'

export class Camera {
  public object: THREE.PerspectiveCamera

  constructor() {
    this.object = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  }

  setPosition(x: number, y: number, z: number) {
    this.object.position.set(x, y, z)
  }

  resize(width: number, height: number) {
    this.object.aspect = width / height
    this.object.updateProjectionMatrix() // Recalculate the projection matrix
  }
}
