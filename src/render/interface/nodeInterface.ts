
export interface TreeNodeI {
    id: number
    value: number;
    x: number;
    y: number;
    leftNode: TreeNodeI | null;
    rightNode: TreeNodeI | null;
    parentNode: TreeNodeI
  }