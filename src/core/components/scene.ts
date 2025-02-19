import * as THREE from 'three'

export class Scene {
  public object: THREE.Scene

  constructor(backgroundColor: THREE.ColorRepresentation) {
    this.object = new THREE.Scene()
    this.object.background = new THREE.Color(backgroundColor)
  }

  getObject() {
    return this.object
  }

  add(object: THREE.Object3D) {
    this.object.add(object)
  }
}
