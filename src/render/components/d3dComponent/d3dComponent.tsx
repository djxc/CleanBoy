import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CreateEntity from "../../util/createEntity";

function D3dComponent() {
    const [scene, setScene] = useState(new THREE.Scene())
    const [camera] = useState(new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        2000
    ))
    const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: true }))
    const [cameraX] = useState(3)
    const [cameraY] = useState(10)
    const [cameraZ] = useState(3)
    const [controls, setControls] = useState(new OrbitControls(
        new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000
        ),
        document.createElement('div')
    ))
    useEffect(()=>{
        init()
    }, [])
    return (
        <div>
            <div id="threediv"></div>
        </div>
    )

    function init() {
        var axes = new THREE.AxesHelper(20)
        scene.add(axes)
        // 设置场景背景色
        // this.scene.background = new THREE.Color(0xcccccc)
        scene.fog = new THREE.FogExp2(0xcccccc, 0.002)
        camera.position.set(cameraX, cameraY, cameraY)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight * 0.94)
        renderer.setClearAlpha(0.5)
        let threeContainer = document.getElementById('threediv')
        if (threeContainer) {
            threeContainer.appendChild(renderer.domElement)
        }
        let controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.screenSpacePanning = false
        setControls(controls)
        let createEntity = new CreateEntity()
        let cube = createEntity.createCube()
        let plane = createEntity.createPlane()
        let boll = createEntity.createSphere()
        let line = createEntity.createLine()

        scene.add(plane)
        scene.add(boll)
        scene.add(cube)
        scene.add(line)
        setScene(scene)
        
        camera.position.z = 5
        window.addEventListener('resize', onWindowResize, false)
        animate()
    }
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight * 0.94)
    }

    function animate() {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }
}

export default D3dComponent;