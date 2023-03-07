import { useEffect } from "react";
import MV from "../../util/webGL/MV"
import WebGLUtils from "../../util/webGL/webgl-utils"
import InitShaders from "../../util/webGL/initShaders";

import "./webGL.css"


function WebGLPage() {
  const shadersSource = "attribute vec4 vPosition; void main(){	gl_PointSize = 1.0;    gl_Position = vPosition;}";
  const frameSource = "precision mediump float;  void  main()  {      gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );  }";

  useEffect(()=>{
    init()
  }, [])

  const NumPoints = 5000;
    return(
        <div className="webgl-container">
          <canvas id="gl-canvas" width="512" height="512">
            Oops ... your browser doesn't support the HTML5 canvas element
          </canvas>
        </div>
    )

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
      
      var canvas: any = document.getElementById( "gl-canvas" );

      let gl = WebGLUtils.setupWebGL( canvas );
      if ( !gl ) { alert( "WebGL isn't available" ); }

      //
      //  Initialize our data for the Sierpinski Gasket
      //

      // First, initialize the corners of our gasket with three points.

      var vertices = [
          MV.vec2( -1, -1 ),
          MV.vec2(  0,  1 ),
          MV.vec2(  1, -1 )
      ];

      // Specify a starting point p for our iterations
      // p must lie inside any set of three vertices

      var u = MV.add( vertices[0], vertices[1] );
      var v = MV.add( vertices[0], vertices[2] );
      var p = MV.scale( 0.25, MV.add( u, v ) );

      // And, add our initial point into our array of points

      let points = [ p ];

      // Compute new points
      // Each new point is located midway between
      // last point and a randomly chosen vertex

      for ( var i = 0; points.length < NumPoints; ++i ) {
          var j = Math.floor(Math.random() * 3);
          p = MV.add( points[i], vertices[j] );
          p = MV.scale( 0.5, p );
          points.push( p );
      }

      //
      //  Configure WebGL
      //
      gl.viewport( 0, 0, canvas.width, canvas.height );
      gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

      //  Load shaders and initialize attribute buffers

      var program = InitShaders.initShadersFromSource( gl, shadersSource, frameSource);
      gl.useProgram( program );

      // Load the data into the GPU

      var bufferId = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
      gl.bufferData( gl.ARRAY_BUFFER, MV.flatten(points), gl.STATIC_DRAW );

      // Associate out shader variables with our data buffer

      var vPosition = gl.getAttribLocation( program, "vPosition" );
      gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( vPosition );

      render(gl, points);
  };


  function render(gl: any, points: number[]) {
    gl.clear(gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.POINTS, 0, points.length );
  }

}

export default WebGLPage;