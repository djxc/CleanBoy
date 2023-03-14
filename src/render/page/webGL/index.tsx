import { useEffect, useState } from "react";
import MV from "../../util/webGL/MV"
import WebGLUtils from "../../util/webGL/webgl-utils"
import { createShader, createProgram } from "../../util/webGLUtil";
import InitShaders from "../../util/webGL/initShaders";
// import WindSurface from "../../asset/wind-surface.jpg";
import WindSurface from '../../asset/cloudsrain-surface.jpg';


import "./webGL.css"


function WebGLPage() {
  const shadersSource = "attribute vec4 vPosition; void main(){	gl_PointSize = 1.0;    gl_Position = vPosition;}";
  const frameSource = "precision mediump float;  void  main()  {      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );  }";
  const [gl, setGL] = useState<any>(null)
  const [uColor, setUColor] = useState<any>(null)
  const [pointX, setPointX] = useState(0)
  const [pointY, setPointY] = useState(0)
  const [width, setWidth] = useState(randomInt(200))
  const [height, setHeight] = useState(randomInt(200))
  useEffect(() => {
    // init()
    // showWind()
    createTrangle()
    // loadImage()
  }, [])

  const NumPoints = 5000;
  return (
    <div className="webgl-container">
      <canvas id="gl-canvas" width="512" height="512">
        Oops ... your browser doesn't support the HTML5 canvas element
      </canvas>

      <canvas id="gl-canvas1" width="512" height="512">
        Oops ... your browser doesn't support the HTML5 canvas element
      </canvas>

      <canvas id="gl-legend" width="250" height="50">
        Oops ... your browser doesn't support the HTML5 canvas element
      </canvas>
      <button onClick={() => reDraw("left")}>left</button>
      <button onClick={() => reDraw("right")}>right</button>
      <button onClick={() => reDraw("top")}>top</button>
      <button onClick={() => reDraw("bottom")}>bottom</button>
    </div>
  )

  function reDraw(type: string) {
    switch (type) {
      case "left":
        let leftPointX = pointX - 3;
        setPointX(leftPointX);
        drawEntity(gl, leftPointX, pointY, width, height, uColor);
        break
      case "right":
        let rightPointX = pointX + 3;
        setPointX(rightPointX);
        drawEntity(gl, rightPointX, pointY, width, height, uColor);
        break
      case "top":
        let topPointY = pointY + 3;
        setPointY(topPointY);
        drawEntity(gl, pointX, topPointY, width, height, uColor);

        break
      case "bottom":
        let bottomPointY = pointY - 3;
        setPointY(bottomPointY);
        drawEntity(gl, pointX, bottomPointY, width, height, uColor);
        break
    }
  }

  /**
   * 1、首先获取canvas元素，webGL需要以canvas作为绘画板
   * 2、在canvas获取webgl上下文
   * 3、创建顶点，需要显示的位置坐标
   * 4、设置webgl可视域以及颜色
   * 5、初始化着色语言以及纹理，首先创建shaderSource,将着色器语言放置在shaderSource中，然后创建program，将shaderSource连接到program中，最后返回program
   * 6、创建buffer，存放创建的顶点
   * 7、从顶点着色器中获取位置属性，将buffer绘制
   */
  function init() {

    var canvas: any = document.getElementById("gl-canvas");

    let gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
      MV.vec2(-1, -1),
      MV.vec2(0, 1),
      MV.vec2(1, -1)
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = MV.add(vertices[0], vertices[1]);
    var v = MV.add(vertices[0], vertices[2]);
    var p = MV.scale(0.25, MV.add(u, v));

    // And, add our initial point into our array of points

    let points = [p];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for (var i = 0; points.length < NumPoints; ++i) {
      var j = Math.floor(Math.random() * 3);
      p = MV.add(points[i], vertices[j]);
      p = MV.scale(0.5, p);
      points.push(p);
    }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = InitShaders.initShadersFromSource(gl, shadersSource, frameSource);
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, MV.flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render(gl, points);
  }

  function createTrangle() {
    // 顶点着色器,位置默认在[-1, 1]之间，
    let pointGLSL = `
      // 一个属性值，将会从缓冲中获取数据
      // attribute vec4 a_position;      
      attribute vec2 a_position;
 
      uniform vec2 u_resolution;
      // 所有着色器都有一个main方法
      void main() {
      
        // gl_Position 是一个顶点着色器主要设置的变量
        // gl_Position = a_position;
        // 从像素坐标转换到 0.0 到 1.0
        vec2 zeroToOne = a_position / u_resolution;
     
        // 再把 0->1 转换 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
     
        // 把 0->2 转换到 -1->+1 (裁剪空间)
        vec2 clipSpace = zeroToTwo - 1.0;
     
        gl_Position = vec4(clipSpace, 0, 1);
      }`;
    // 片元着色器
    let framgeGLSL = `
      // 片段着色器没有默认精度，所以我们需要设置一个精度
      // mediump是一个不错的默认值，代表“medium precision”（中等精度）
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        // gl_FragColor是一个片段着色器主要设置的变量
        gl_FragColor = u_color; // 返回“红紫色”
      }`;
    let canvas: any = document.getElementById("gl-canvas");
    var gl: WebGLRenderingContext = canvas.getContext("webgl");
    if (!gl) {
      console.log("您不能使用webgl！");
    }
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, pointGLSL);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, framgeGLSL);
    let program = createProgram(gl, vertexShader, fragmentShader);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let u_color = gl.getUniformLocation(program, "u_color");    // 从着色器中获取变量对象
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 三个二维点坐标
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 清空画布
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 告诉它用我们之前写好的着色程序（一个着色器对）
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    var size = 2;          // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    let pointX = randomInt(200)
    let pointY = randomInt(200)
    gl.uniform4f(u_color, Math.random(), Math.random(), Math.random(), Math.random())
    // 设置随机颜色
    drawEntity(gl, pointX, pointY, width, height, u_color);
    setPointX(pointX)
    setPointY(pointY)
    setGL(gl);
    setUColor(u_color);
  }

  function drawEntity(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number, u_color: any) {
    var positions = [
      x, y,
      x, y + width,
      x + height, y,
      x + height, y,
      x + height, y + width,
      x, y + width,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;  // 需要获取数据个数
    gl.drawArrays(primitiveType, offset, count);
  }

  // 返回 0 到 range 范围内的随机整数
  function randomInt(range: number) {
    return Math.floor(Math.random() * range);
  }

  function showWind() {
    const cv: any = document.getElementById("gl-canvas");;
    const ctx = cv.getContext('2d');

    const cv1: any = document.getElementById("gl-canvas1");;
    const ctx1 = cv1.getContext('2d');

    const image = new Image();

    image.onload = () => {
      cv.width = image.width;
      cv.height = image.height;

      ctx.drawImage(image, 0, 0, image.width, image.height);
      const data = ctx.getImageData(0, 0, image.width, image.height);
      let new_data = []
      for (let i = 0; i < data.data.length; i = i + 3) {
        new_data[i] = data.data[i]
        new_data[i + 1] = 0
        new_data[i + 2] = 0
      }
      ctx1.drawImage(image, 0, 0, image.width, image.height);

      const l = decode(data.data, 257);
      console.log('image-parse', l);
      encode(l, 257);
    }
    image.src = WindSurface
  }

  function encode(data: any, width: number) {
    const legend: any = document.getElementById("gl-legend");;
    const legendCtx = legend.getContext('2d');
    const buffer = new ArrayBuffer(28);
    const unitBuffer = new Uint8Array(buffer);
    const floatBuffer = new Float32Array(buffer);

    legend.width = width;
    legend.height = 8;

    for (let i = 0; i < 7; i++) {
      floatBuffer[i] = data[i];
    }

    const offset = 4;
    const color = [];
    for (let j = 0; j < 28; j++) {
      // 下面以原始数据为 v
      const v = unitBuffer[j];
      let r = v >> 6;
      let g = (v - (r << 6)) >> 2;
      let b = v - (r << 6) - (g << 2);
      r = r * 64;
      g = g * 16;
      b = b * 64;
      color.push([r, g, b]);

      legendCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      legendCtx.fillRect(offset * j, 0, 4, 8);
    }

  }

  function decode(data: any, width: any) {
    const buffer = new ArrayBuffer(28);
    const unitBuffer = new Uint8Array(buffer);
    const floatBuffer = new Float32Array(buffer);
    let c = 4 * width * 4 + 8;
    for (let i = 0; i < 28; i++) {
      let r = data[c];
      let g = data[c + 1];
      let b = data[c + 2];
      console.log(r, g, b);

      r = Math.round(r / 64);
      g = Math.round(g / 16);
      b = Math.round(b / 64);
      unitBuffer[i] = (r << 6) + (g << 2) + b;
      c += 16;
    }
    return floatBuffer
  }


  function render(gl: any, points: number[]) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
  }

  function loadImage() {
    var image = new Image();
    image.src = WindSurface;  // 必须在同一域名下
    image.onload = function () {
      showImage(image);
    }
  }

  function showImage(image: HTMLImageElement) {
    // 顶点着色器,位置默认在[-1, 1]之间，
    let pointGLSL = `
     // 一个属性值，将会从缓冲中获取数据
     attribute vec2 a_position;
     varying vec2 v_texCoord;
     attribute vec2 a_texCoord;
     uniform vec2 u_resolution;
     // 所有着色器都有一个main方法
     void main() {
     
       // gl_Position 是一个顶点着色器主要设置的变量    
       v_texCoord = a_texCoord;   
       // 从像素坐标转换到 0.0 到 1.0
       vec2 zeroToOne = a_position / u_resolution;
    
       // 再把 0->1 转换 0->2
       vec2 zeroToTwo = zeroToOne * 2.0;
    
       // 把 0->2 转换到 -1->+1 (裁剪空间)
       vec2 clipSpace = zeroToTwo - 1.0;
    
       gl_Position = vec4(clipSpace, 0, 1);
     }`;
    // 片元着色器
    let framgeGLSL = `
      // 片段着色器没有默认精度，所以我们需要设置一个精度
      // mediump是一个不错的默认值，代表“medium precision”（中等精度）
      precision mediump float;
      // 纹理
      uniform sampler2D u_image;    
      // 从顶点着色器传入的纹理坐标
      varying vec2 v_texCoord;
      void main() {
        // gl_FragColor是一个片段着色器主要设置的变量
        gl_FragColor = texture2D(u_image, v_texCoord).bgra;
      }`;
    let canvas: any = document.getElementById("gl-canvas");
    var gl: WebGLRenderingContext = canvas.getContext("webgl");
    if (!gl) {
      console.log("您不能使用webgl！");
    }
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, pointGLSL);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, framgeGLSL);
    let program = createProgram(gl, vertexShader, fragmentShader);
    // 三个二维点坐标
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 清空画布
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 告诉它用我们之前写好的着色程序（一个着色器对）
    gl.useProgram(program);

    let positionLocation = gl.getAttribLocation(program, "a_position");
    // 找到纹理的地址
    let texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height);
    // 给矩形提供纹理坐标
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // 创建纹理
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 将图像上传到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texCoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      texCoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

  function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }


}

export default WebGLPage;