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
          <button @click="changeCamera('x-')">pX-</button>
          <button @click="changeCamera('y+')">pY+</button>
          <button @click="changeCamera('y-')">pY-</button>
          <button @click="changeCamera('z+')">pZ+</button>
          <button @click="changeCamera('z-')">pZ-</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import CreateEntity from './createEntity'
export default Vue.extend({
  name: 'dthree',
  data: () => {
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      renderer: new THREE.WebGLRenderer(),
      cube: new THREE.Mesh(),
      cameraX: 1,
      cameraY: 1,
      cameraZ: 3
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.camera.position.set(this.cameraX, this.cameraY, this.cameraY)
      this.renderer.setSize(window.innerWidth, window.innerHeight * 0.94)
      let threeContainer = document.getElementById('threediv')
      if (threeContainer) {
        threeContainer.appendChild(this.renderer.domElement)
      }
      let createEntity = new CreateEntity()
      this.cube = createEntity.createCube()
    //   let plane = createEntity.createPlane()
    //   let boll = createEntity.createSphere()
      let line = createEntity.createLine()

    //   this.scene.add(plane)
    //   this.scene.add(boll)
      this.scene.add(this.cube)
      this.scene.add(line)

      this.camera.position.z = 5
      this.animate()
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
      this.cube.rotation.x += 0.01
      this.cube.rotation.y += 0.01
      this.camera.position.x = this.cameraX
      this.camera.position.y = this.cameraY
      this.camera.position.z = this.cameraZ
      requestAnimationFrame(this.animate)
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
  background-color: blueviolet;
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