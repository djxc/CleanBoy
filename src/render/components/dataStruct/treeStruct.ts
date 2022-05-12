import { TreeNodeI } from "../../interface/nodeInterface";

export class TreeNode implements TreeNodeI {
  id: number;
  x: number;
  y: number;
  value: number;
  leftNode: TreeNodeI | null;
  rightNode: TreeNodeI | null;
  parentNode: TreeNodeI;
  constructor(value: number, id: number) {
    this.value = value;
    this.leftNode = null;
    this.rightNode = null;
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.parentNode = this;
  }
}

/**
 * 二叉搜索树
 * 1、二叉搜索树规则为左侧节点值需要小于中间节点值，右侧需要大于中间节点值，因此适于查询搜索
 * @param {*} value
 */
export class BTree {
  root: TreeNodeI;
  nodeCount: number;
  constructor(value: number) {
    this.root = new TreeNode(value, 1);
    this.nodeCount = 1;
    this.root.x = 0;
    this.root.y = 0;
  }

  /**
   * 添加节点
   * 1、首先判断，当前节点value是否大于传入的value，大于放在右侧，小于放在左侧
   * 2、然后判断当前节点的左右节点是否为空，如果为空则直接当前节点创建一个新的node
   * @param {*} value
   */
  add(value: number) {
    this.insert(value, this.root);
  }

  /**
   * 给指定id的node节点添加子节点
   * 1、首先根据id查找到节点，然后根据对该节点添加子节点
   * 2、由于当前数不一定为二叉搜索树，因此需要遍历获取所有的子节点，然后获取id为nodeId的节点
   * @param value
   * @param nodeId
   * @param leftOrRight 0 左，1右
   */
  addNode(value: number, nodeId: number, leftOrRight: number) {
    let result = false;
    let node = this.findNodeById(nodeId);
    if (node == undefined) {
      return false;
    }
    if (leftOrRight === 1) {
      if (node.rightNode == null) {
        this.nodeCount = this.nodeCount + 1;
        let rightNode = new TreeNode(value, this.nodeCount);
        rightNode.x = node.x + 2;
        rightNode.y = node.y - 2;
        node.rightNode = rightNode;
        rightNode.parentNode = node;
        result = true;
      }
    } else {
      if (node.leftNode == null) {
        this.nodeCount = this.nodeCount + 1;
        let leftNode = new TreeNode(value, this.nodeCount);
        leftNode.x = node.x - 2;
        leftNode.y = node.y - 2;
        node.leftNode = leftNode;
        leftNode.parentNode = node;
        result = true;
      }
    }
    return result;
  }

  findNodeById(nodeId: number) {
    let nodeList = this.inOrderTraverse();
    for (let node of nodeList) {
      if (node.id === nodeId) {
        return node;
      }
    }
  }

  /**
   * 先序遍历，返回节点列表
   */
  inOrderTraverse() {
    let nodeList: TreeNode[] = [];
    this.inOrderTraverseNode(this.root, nodeList);
    return nodeList;
  }

  /**
   * 先序遍历
   * 1、首先判断当前节点的左节点是否为null，如果不为null则递归调用该左节点
   * 2、如果当前节点的左节点不存在，则将当前节点加入nodeList中，然后返回
   * 3、然后加载当前节点，最后递归遍历右侧节点
   * @param node
   * @param nodeList
   */
  private inOrderTraverseNode(node: TreeNode, nodeList: TreeNode[]) {
    if (node.leftNode != null) {
      this.inOrderTraverseNode(node.leftNode, nodeList);
    }
    nodeList.push(node);
    if (node.rightNode != null) {
      this.inOrderTraverseNode(node.rightNode, nodeList);
    }
  }

  private insert(value: number, node: TreeNodeI) {
    if (value >= node.value) {
      if (node.rightNode == null) {
        this.nodeCount = this.nodeCount + 1;
        node.rightNode = new TreeNode(value, this.nodeCount);
      } else {
        this.insert(value, node.rightNode);
      }
    } else {
      if (node.leftNode == null) {
        this.nodeCount = this.nodeCount + 1;
        node.leftNode = new TreeNode(value, this.nodeCount);
      } else {
        this.insert(value, node.leftNode);
      }
    }
  }
}
