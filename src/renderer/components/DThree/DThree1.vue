<template>
  <div id="threediv">
    <div id="info">
      <a
        href="https://threejs.org"
        target="_blank"
        rel="noopener"
      >three.js</a> - orbit controls
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
      cameraZ: 3,
      controls: new OrbitControls(
        new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
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
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xcccccc)
      this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002)

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight * 0.9)
      let threeContainer = document.getElementById('threediv')
      if (threeContainer) {
        threeContainer.appendChild(this.renderer.domElement)
      }
      //   document.body.appendChild(this.renderer.domElement)

      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      this.camera.position.set(400, 200, 0)

      // controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

      this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.05
      this.controls.screenSpacePanning = false
      this.controls.minDistance = 100
      this.controls.maxDistance = 500
      this.controls.maxPolarAngle = Math.PI / 2

      // world

      var geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1)
      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true
      })

      for (var i = 0; i < 500; i++) {
        var mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = Math.random() * 1600 - 800
        mesh.position.y = 0
        mesh.position.z = Math.random() * 1600 - 800
        mesh.updateMatrix()
        mesh.matrixAutoUpdate = false
        this.scene.add(mesh)
      }

      // lights

      var light = new THREE.DirectionalLight(0xffffff)
      light.position.set(1, 1, 1)
      this.scene.add(light)

      var light1 = new THREE.DirectionalLight(0x002288)
      light.position.set(-1, -1, -1)
      this.scene.add(light1)

      var light2 = new THREE.AmbientLight(0x222222)
      this.scene.add(light2)

      //

      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update() // only required if controls.enableDamping = true, or if controls.autoRotate = true
      this.render()
    },
    render() {
      this.renderer.render(this.scene, this.camera)
    }
  }
})
</script>
<style>
</style>