import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CreateEntity from "../../util/createEntity";

import "./dataStruct.css";
import { BTree } from "./treeStruct";

/**
 * 利用threeJS绘制每个树节点，并显示节点之间的关系
 * @returns
 */
function TreeOperate() {
  const [scene, setScene] = useState(new THREE.Scene());
  const [camera] = useState(
    new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
  );
  const [renderer, setRenderer] = useState<any>(
    new THREE.WebGLRenderer({ antialias: true, alpha: true })
  );
  const [cameraX] = useState(3);
  const [cameraY] = useState(10);
  const [cameraZ] = useState(3);
  const [showRightMenu, setShowRightMenu] = useState("none");
  const [rightMenuX, setRightMenuX] = useState(0);
  const [rightMenuY, setRightMenuY] = useState(0);
  const [tree, setTree] = useState<BTree>();
  const [showModal, setShowModal] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(-1);
  const [currentNodeValue, setCurrentNodeValue] = useState("");
  const [leftRight, setLeftRight] = useState(0);
  const [nodeEntities, setNodeEntities] = useState<THREE.Mesh[]>([]);

  const [controls, setControls] = useState(
    new OrbitControls(
      new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
      ),
      document.createElement("div")
    )
  );
  useEffect(() => {
    init();
    return () => {
      renderer.forceContextLoss();
      setRenderer(null);
    };
  }, []);
  return (
    <div>
      {/* 右键菜单 */}
      <div
        id="rightMenu"
        className="right-menu"
        style={{ display: showRightMenu, top: rightMenuY, left: rightMenuX }}
      >
        <ul>
          <li>
            <span onClick={() => createRoot(true, -1)}>添加根节点</span>
          </li>
          <li>
            <span onClick={() => createRoot(false, 0)}>添加左节点</span>
          </li>
          <li>
            <span onClick={() => createRoot(false, 1)}>添加右节点</span>
          </li>
        </ul>
      </div>

      <div
        id="treeDiv"
        onDoubleClick={(e) => {
          onDBMouseclick(e);
        }}
        onContextMenu={(e) => rightClick(e)}
      ></div>

      <Modal
        visible={showModal}
        title="添加节点"
        onOk={finishAddNode}
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <div>
          <span>父节点ID：{}</span>
          <input
            placeholder="输入节点值"
            onChange={(e) => {
              changeValue(e.target.value);
            }}
          ></input>
        </div>
      </Modal>
    </div>
  );

  /**
   * 鼠标双击触发的方法
   * @param event
   * @returns
   */
  function onDBMouseclick(event: React.MouseEvent) {
    setShowRightMenu("inline-block");
    if (tree == undefined) {
      return;
    }
    // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
    var intersects = getIntersects(event);

    // 获取选中最近的 Mesh 对象
    if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
      let selectObject = intersects[0].object;
      console.log(selectObject, selectObject.userData);
      setCurrentParentId(selectObject.userData.treeNodeId);
    } else {
      message.info("未选中 Mesh!");
    }
  }

  // 获取与射线相交的对象数组
  function getIntersects(event: React.MouseEvent) {
    event.preventDefault();
    console.log("event.clientX:" + event.clientX);
    console.log("event.clientY:" + event.clientY);

    // 声明 raycaster 和 mouse 变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, camera);

    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    var intersects = raycaster.intersectObjects(scene.children);

    //返回选中的对象
    return intersects;
  }

  /**
   * 创建根节点，如果根节点存在则提示存在不进行创建
   * @returns
   */
  function createRoot(isRoot: boolean, leftOrRight: number) {
    setShowRightMenu("none");
    if (isRoot) {
      if (tree?.root) {
        message.info("根节点已存在");
        return;
      }
    } else {
      if (currentParentId < 0) {
        message.info("未选则父节点");
        return;
      }
      setLeftRight(leftOrRight);
    }
    setShowModal(true);
  }

  function finishAddNode() {
    if (currentNodeValue === "" || isNaN(parseInt(currentNodeValue))) {
      message.error("节点值错误！");
      return;
    }
    addTreeNode(parseInt(currentNodeValue), currentParentId);
    setShowModal(false);
  }

  function changeValue(value: string) {
    setCurrentNodeValue(value);
  }

  /**
   * 右击鼠标显示右键菜单
   * 1、这里需要判断右键位置是否太靠边，如果太靠边则需要向中间移动
   * @param e
   */
  function rightClick(e: React.MouseEvent) {
    onDBMouseclick(e);
    setShowRightMenu("inline-block");
    setRightMenuX(e.clientX);
    setRightMenuY(e.clientY);
  }

  /**
   * 创建树结构
   * @param treeValue 节点值
   * @param parentId 父节点id，如果为根节点则没有父节点
   */
  function addTreeNode(treeValue: number, parentId: number) {
    let newTree = tree;
    if (newTree != undefined) {
      let result = newTree.addNode(treeValue, parentId, leftRight);
      console.log("创建子节点", result, parentId, leftRight);
    } else {
      console.log("创建根节点");

      newTree = new BTree(treeValue);
    }
    setTree(newTree);
    showTree(newTree, parentId);
  }

  /**
   * 显示新的tree
   * 1、首先需要遍历tree，获取每个节点，按照顺序绘制。这里采用先序顺序进行遍历
   */
  function showTree(tree: BTree, parentId: number) {
    for (let node of nodeEntities) {
      scene.remove(node);
    }
    let treeNodeList = tree.inOrderTraverse();
    console.log(treeNodeList);
    let createEntity = new CreateEntity();
    let newNodeEntities: THREE.Mesh[] = [];
    for (let node of treeNodeList) {
      let boll = createEntity.createSphere(node.x, node.y, 1, 1, {
        treeNodeId: node.id,
      });
      newNodeEntities.push(boll);
      scene.add(boll);
      createEntity.createText(
        node.value + "",
        node.x,
        node.y + 1,
        1,
        (fontEntity: any) => {
          scene.add(fontEntity);
        }
      );
    }
    setNodeEntities(newNodeEntities);
  }

  /**
   * 创建场景
   */
  function init() {
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);
    // 设置场景背景色
    // this.scene.background = new THREE.Color(0xcccccc)
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    camera.position.set(cameraX, cameraY, cameraY);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.85);
    renderer.setClearAlpha(0.5);
    let threeContainer = document.getElementById("treeDiv");
    if (threeContainer) {
      threeContainer.appendChild(renderer.domElement);
    }
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    setControls(controls);
    let createEntity = new CreateEntity();
    // // let cube = createEntity.createCube();
    // // let plane = createEntity.createPlane();
    // let boll = createEntity.createSphere(2, 13, 1, 2);
    // // let line = createEntity.createLine();

    // // scene.add(plane);
    // scene.add(boll);
    // scene.add(cube);
    // scene.add(line);
    setScene(scene);
    camera.position.z = 35;
    window.addEventListener("resize", onWindowResize, false);
    animate();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.85);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
}

export default TreeOperate;
