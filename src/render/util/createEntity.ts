import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

class CreateEntity {
  createCube() {
    // 创建几何体，包括几何形状以及纹理
    console.log("create cube");
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: "red" });
    let cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  /**
   * 创建圆形
   * @returns
   */
  createSphere(x: number, y: number, z: number, radius = 1, userData = {}) {
    let sphereGeometry = new THREE.SphereGeometry(radius, 20, 20);
    let sphereMaterial = new THREE.MeshBasicMaterial({ color: "blue" });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    sphere.castShadow = true;
    sphere.userData = userData;
    return sphere;
  }

  createPlane() {
    let planeGeometry = new THREE.PlaneGeometry(20, 10, 1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial({ color: "green" });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 2;
    plane.position.y = -2;
    plane.position.z = 0;
    plane.receiveShadow = true;
    return plane;
  }

  createLine() {
    let lineGeometry = new THREE.BufferGeometry();
    let positions: number[] = [];
    positions.push(-1, -2, -3);
    positions.push(1, 2, -3);
    positions.push(2, 0, 2);
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    let line = new THREE.Mesh(lineGeometry, lineMaterial);
    return line;
  }

  createText(text: string, x: number, y: number, z: number, callback: Function) {
    let loader = new FontLoader();
    loader.load("http://localhost/helvetiker_regular.typeface.json", function (font) {
      let textGeometry = new TextGeometry(text, {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 20,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelEnabled: true,
      });
      let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let fontObj = new THREE.Mesh(textGeometry, material);
      fontObj.position.set(x, y, z);
      callback(fontObj);
    });
  }
}

export default CreateEntity;
