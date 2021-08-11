<template>
  <div class="three-main">
    <div id="threediv"></div>
    <div class="three-menu">
      <div class="three-menu-title">
        <span>菜单</span>
      </div>
      <ul class="three-meu-menu-ul">
        <li>
          相机:
          <button @click="changeCamera('x+')">pX+</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import CreateEntity from './createEntity'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default Vue.extend({
  name: 'dthree',
  data: () => {
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        2000
      ),
      renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true }),
      cube: new THREE.Mesh(),
      cameraX: 3,
      cameraY: 10,
      cameraZ: 3,
      controls: new OrbitControls(
        new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          1,
          1000
        ),
        document.createElement('div')
      ),
      clock: new THREE.Clock()
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init() {
      var axes = new THREE.AxesHelper(20)
      this.scene.add(axes)
      // 设置场景背景色
      // this.scene.background = new THREE.Color(0xcccccc)
      this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002)
      this.camera.position.set(this.cameraX, this.cameraY, this.cameraY)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight * 0.94)
      this.renderer.setClearAlpha(0.5)
      let threeContainer = document.getElementById('threediv')
      if (threeContainer) {
        threeContainer.appendChild(this.renderer.domElement)
      }
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.screenSpacePanning = false
      // this.controls.minDistance = 100
      // this.controls.maxDistance = 500
      // this.controls.maxPolarAngle = Math.PI / 2
      let createEntity = new CreateEntity()
      this.cube = createEntity.createCube()
      let plane = createEntity.createPlane()
      let boll = createEntity.createSphere()
      let line = createEntity.createLine()

      this.scene.add(plane)
      this.scene.add(boll)
      this.scene.add(this.cube)
      this.scene.add(line)

      this.camera.position.z = 5

      // 监听鼠标、键盘事件
      // this.controls.update()
      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight * 0.94)
    },
    /**
     * **修改镜头**
     * 1、调整镜头的x, y, z
     * @param type 修改镜头类型
     */
    changeCamera(type: string) {
      switch (type) {
        case 'x+':
          this.cameraX++
          break
        case 'x-':
          this.cameraX--
          break
        case 'y+':
          this.cameraY++
          break
        case 'y-':
          this.cameraY--
          break
        case 'z+':
          this.cameraZ++
          break
        case 'z-':
          this.cameraZ--
          break
        default:
          break
      }
    },

    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
  }
})
</script>

<style>
.three-main {
  width: 100vw;
  height: 94vh;
}
.three-menu {
  position: absolute;
  top: 10vh;
  left: 1vw;
  width: 18vw;
  height: 60vh;
  z-index: 2;
  background-color: rgba(122, 32, 122, 0.678);
}
#threediv {
  width: 100vw;
  height: 94vh;
  overflow: hidden; /* 溢出隐藏 */
  background: url('../../assets/three_background.jpg') center no-repeat;
  -webkit-background-size: cover;
  background-size: cover;
}
.three-menu-title {
  margin-top: 1vh;
  text-align: center;
  color: white;
}
.three-meu-menu-ul {
  color: white;
}

.three-meu-menu-ul button {
  border: none;
  color: white;
  background-color: rgb(50, 128, 216);
}
</style>
