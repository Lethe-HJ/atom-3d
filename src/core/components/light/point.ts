import * as THREE from 'three'
import type { Camera } from '../camera'

export class PointLight implements Atom3DObject {
  public object: THREE.PointLight

  constructor(color: number = 0xffffff, intensity: number = 10, distance: number = 0) {
    this.object = new THREE.PointLight(color, intensity, distance)
    // 设置点光源位置，使其从相机位置朝向场景中心
    this.object.position.set(0, 0, 0)
  }

  addToCamera(camera: Camera): void {
    camera.add(this)
  }

  removeFromCamera(camera: Camera): void {
    camera.remove(this)
  }
}
