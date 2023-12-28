import { useEffect, useState } from "react";


function WebGLComponent() {
    const vertexShaderSource = `#version 300 es
 
        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec4 a_position;
        
        // all shaders have a main function
        void main() {
        
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = a_position;
        }
        `;

    const fragmentShaderSource = `#version 300 es
        
        // fragment shaders don't have a default precision so we need
        // to pick one. highp is a good default. It means "high precision"
        precision highp float;
        
        // we need to declare an output for the fragment shader
        uniform vec4 u_color;
        out vec4 outColor;
        
        void main() {
            // Just set the output to a constant reddish-purple
            outColor = u_color;
        }
        `;

    const [gl, setGL] = useState<WebGL2RenderingContext>();
    const [program, setProgram] = useState<WebGLProgram>();

    useEffect(() => {
        showShape()
    }, [])

    return (
        <div className="webgl-component-container">
            <canvas id="webglCanvasDemo"></canvas>
            webGL page
            <button onClick={changeColor}>chang color</button>
        </div>
    )

    /**
     * 修改当前图形颜色
     * 1、首先通过uniform修改颜色
     * 2、重绘图形
     */
    function changeColor() {
        console.log("change color", gl, program);
        if (gl && program) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            setRandomColor(gl, program);
            draw(gl)
        }
    }

    function showShape() {
        let canvas: any = document.getElementById("webglCanvasDemo");

        let gl: WebGL2RenderingContext = canvas.getContext("webgl2");
        if (!gl) {
            alert("WebGL isn't available");
        } else {
            let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader;
            let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;
            let program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;
            let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
            // Create a buffer and put three 2d clip space points in it
            var positionBuffer = gl.createBuffer();

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            var positions = [
                0, 0,
                0, 0.5,
                0.7, 0,
                0.7, 0,
                0.7, 0.5,
                0, 0.5,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            // Create a vertex array object (attribute state)
            var vao = gl.createVertexArray();
            // and make it the one we're currently working with
            gl.bindVertexArray(vao);
            // Turn on the attribute
            gl.enableVertexAttribArray(positionAttributeLocation);


            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionAttributeLocation, size, type, normalize, stride, offset);

            resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            // Bind the attribute/buffer set we want.
            gl.bindVertexArray(vao);
            setGL(gl)
            setProgram(program)
            // setRandomColor(gl, program)
            setRandomColor(gl, program)
            draw(gl)
        }
    }

    function draw(gl: WebGL2RenderingContext) {
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;     // 顶点的偏移量
        var count = 6;      // 绘制多少个数据
        gl.drawArrays(primitiveType, offset, count);
    }

    function setRandomColor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        let colorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);    // 设置颜色

    }


    /**
     * 比较clientWidth与width，如果二者不相同将with设置为clientWidth
     * @param canvas 
     * @returns 
     */
    function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
        // 获取浏览器显示的画布的CSS像素值
        const displayWidth = canvas.clientWidth
        const displayHeight = canvas.clientHeight

        // 检查画布大小是否相同。
        const needResize =
            canvas.width !== displayWidth || canvas.height !== displayHeight

        if (needResize) {
            // 使画布大小相同
            canvas.width = displayWidth
            canvas.height = displayHeight
        }

        return needResize
    }

    /**
     * 创建程序，将顶点着色器与片元着色器链接为一个程序
     * @param gl 
     * @param vertexShader 
     * @param fragmentShader 
     * @returns 
     */
    function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        var program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    /**
     * 创建着色器实例
     * @param gl 
     * @param type 
     * @param source 
     * @returns 
     */
    function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
        var shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

export default WebGLComponent