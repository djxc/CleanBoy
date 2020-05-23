import * as THREE from 'three'

class CreateEntity {

    createCube() {
        // 创建几何体，包括几何形状以及纹理
        console.log('create cube')
        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let material = new THREE.MeshBasicMaterial({ color: 'red' })
        let cube = new THREE.Mesh(geometry, material)
        return cube
    }

    createSphere() {
        let sphereGeometry = new THREE.SphereGeometry(3, 20, 20)
        let sphereMaterial = new THREE.MeshBasicMaterial({ color: "blue" })
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.x = 2
        sphere.position.y = 1
        sphere.position.z = -5
        sphere.castShadow = true
        return sphere
    }

    createPlane() {
        let planeGeometry = new THREE.PlaneGeometry(20, 10, 1, 1)
        let planeMaterial = new THREE.MeshBasicMaterial({ color: 'green' })
        let plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = -0.5 * Math.PI
        plane.position.x = 2
        plane.position.y = 0
        plane.position.z = 0
        plane.receiveShadow = true
        return plane
    }

    createLine() {
        let lineGeometry = new THREE.Geometry()
        lineGeometry.vertices.push(new THREE.Vector3(-1, -2, -3))
        lineGeometry.vertices.push(new THREE.Vector3(1, 2, -3))
        lineGeometry.vertices.push(new THREE.Vector3(2, 0, 2))
        let lineMaterial = new THREE.LineBasicMaterial({ color: "green" })
        let line = new THREE.Mesh(lineGeometry, lineMaterial)
        return line
    }
}



export default CreateEntity