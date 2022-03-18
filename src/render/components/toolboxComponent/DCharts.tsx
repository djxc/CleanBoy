import { useEffect, useState } from "react";
import "./DCharts.css";

interface DCircle {
  id: number;
  value: number;
  size: number;
  color: string;
  point?: Point;
}

interface Point {
  x: number;
  y: number;
  size: number;
}

function DCharts() {
  const [canvasPadding, setCanvasPadding] = useState(10);

  useEffect(() => {
    createBoble();
  }, []);

  return (
    <div>
      dcharts
      <div>
        <div>气泡图</div>
        <canvas id="bobleCanvas" width="400" height="200"></canvas>
      </div>
    </div>
  );

  function createBoble() {
    // 将所有的半径加起来，比较width与height最小的值，如果大于则同比例缩放
    let Width = 400;
    let Height = 200;
    let maxRadi = 50;
    let minRadi = 10;
    let data: DCircle[] = [
      { id: 1, value: 10, size: 10, color: "red" },
      { id: 2, value: 20, size: 20, color: "blue" },
      { id: 3, value: 30, size: 30, color: "green" },
      { id: 4, value: 65, size: 15, color: "yellow" },
      { id: 5, value: 57, size: 27, color: "Cyan1" },
      { id: 6, value: 40, size: 40, color: "PaleGreen" },
      { id: 7, value: 10, size: 10, color: "red" },
      { id: 8, value: 20, size: 20, color: "blue" },
      { id: 9, value: 30, size: 30, color: "green" },
      { id: 10, value: 15, size: 15, color: "yellow" },
      { id: 11, value: 27, size: 27, color: "Cyan1" },
      { id: 12, value: 40, size: 40, color: "PaleGreen" },
      { id: 13, value: 10, size: 10, color: "red" },
      { id: 14, value: 20, size: 20, color: "blue" },
      { id: 15, value: 30, size: 30, color: "green" },
    //   { id: 16, value: 15, size: 15, color: "yellow" },
    //   { id: 17, value: 27, size: 27, color: "Cyan1" },
    //   { id: 18, value: 40, size: 40, color: "PaleGreen" },
    //   { id: 19, value: 10, size: 10, color: "red" },
    //   { id: 20, value: 20, size: 20, color: "blue" },
    //   { id: 21, value: 30, size: 30, color: "green" },
    //   { id: 22, value: 15, size: 15, color: "yellow" },
    //   { id: 23, value: 27, size: 27, color: "Cyan1" },
    //   { id: 24, value: 40, size: 40, color: "PaleGreen" },
    ];
    let minHeightWidth = Width > Height ? Height : Width;
    let sizeSum = 0;
    for (let d of data) {
      sizeSum = sizeSum + d.value;
    }
    if (sizeSum >= minHeightWidth * 2) {
      for (let d of data) {
        d.size = d.value * (minHeightWidth / sizeSum) * 2;
        if (d.size > maxRadi) {
          d.size = maxRadi;
        } else if (d.size < minRadi) {
          d.size = minRadi;
        }
      }
    }
    data = data.sort((a, d) => {
      return d.value - a.value;
    });
    console.log(data);

    let canvas = document.getElementById("bobleCanvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let points: Point[] = [];
    for (let da of data) {
      let xy = createCircle(da, points);
      points.push({
        x: xy[0],
        y: xy[1],
        size: da.size,
      });
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], da.size, 0, 2 * Math.PI);
      ctx.fillStyle = da.color;
      ctx.fill();
      ctx.font = "10pt Calibri";
      ctx.fillStyle = "white";
      ctx.fillText(da.value + "", xy[0] - 8, xy[1] + 5);
    }
  }

  /**
   * 创建点的位置，需要根据之前的位置判断是否越界或重叠
   * 1、这里处理重叠问题，是采用重复计算的方式
   * @param circle
   * @param points
   * @returns
   */
  function createCircle(circle: DCircle, points: Point[]) {
    let width = 400;
    let height = 200;
    let value = circle.size;
    let xy = createRandomLocation(width, height, value);
    let point = { x: xy[0], y: xy[1], size: value };
    let i = 0;
    while (!checkCircleValid(point, points)) {
      if (i > 2000) {
        break;
      }
      xy = createRandomLocation(width, height, value);
      point = { x: xy[0], y: xy[1], size: value };
      i++;
    }
    console.log(i);
    circle.point = point;
    return xy;
  }

  /**
   * 计算当前的点是否与之前的点重叠
   * 1、遍历之前的点，计算两点之间的距离，判断距离是否大于两个半径和
   * @param point
   * @param points
   * @returns
   */
  function checkCircleValid(point: Point, points: Point[]) {
    for (let p of points) {
      let distance = Math.sqrt(
        (p.x - point.x) * (p.x - point.x) + (p.y - point.y) * (p.y - point.y)
      );
      if (distance < p.size + point.size + canvasPadding) {
        return false;
      }
    }
    return true;
  }

  /**
   * 根据范围随机生成数据
   * 1、如果生成的位置与边界相交则移动相交的距离
   * @param width
   * @param height
   * @returns
   */
  function createRandomLocation(width: number, height: number, size: number) {
    let x,
      y = 0;
    let x_random = Math.random();
    x = x_random * width
    // if (Math.random() > 0.5) {
    //   x = ((1 - x_random) * width) / 2;
    // } else {
    //   x = ((1 + x_random) * width) / 2;
    // }
    let y_random = Math.random();
    y = y_random * height
    // if (Math.random() > 0.5) {
    //   y = ((1 - y_random) * height) / 2;
    // } else {
    //   y = ((y_random + 1) * height) / 2;
    // }
    if (x + size + canvasPadding >= width) {
      x = x - (x + size + canvasPadding) - width;
    }

    if (y + size + canvasPadding >= height) {
      y = y - (y + size + canvasPadding) - height;
    }

    if (x - size - canvasPadding <= 0) {
      x = x - (x - size - canvasPadding);
    }

    if (y - size - canvasPadding <= 0) {
      y = y - (y - size - canvasPadding);
    }
    return [x, y];
  }
}

export default DCharts;
