import * as THREE from 'three'

import { Scene } from './components/scene'
import { Renderer } from './components/renderer'
import { Camera } from './components/camera'
import { Orbit } from './controllers/Orbit'

export class Crystal {
  constructor(public dom: HTMLElement) {
    this.init()
  }

  init() {
    const scene = new Scene(0xffffff)
    const camera = new Camera()
    camera.setPosition(0, 0, 5)
    const renderer = new Renderer(scene, camera)
    renderer.mount(this.dom)
    renderer.observerResize()
    const geometry = new THREE.SphereGeometry(0.01, 32, 32)
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const count = 1e4
    const spheres = new THREE.InstancedMesh(geometry, material, count)

    // 设置每个球体的位置
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 10 - 5
      const y = Math.random() * 10 - 5
      const z = Math.random() * 10 - 5
      matrix.setPosition(x, y, z)
      spheres.setMatrixAt(i, matrix)
    }

    scene.add(spheres)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    const pointLight = new THREE.PointLight(0xffffff, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)
    scene.add(ambientLight)
    const controls = new Orbit(camera, renderer)
    controls.update()
    renderer.render()
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    function animate() {
      requestAnimationFrame(animate)
      renderer.render()
    }
    animate()
  }
}
