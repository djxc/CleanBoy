import { useEffect, useState } from "react";

import {
    createProgram, createProgramFromSource, createShader,
    resizeCanvasToDisplaySize, getGLContextFromCanvas
} from "../../util/webGL/webGLUtils"

import { vertexShaderSource, fragmentShaderSource, imageFragmentShaderSource, imageVertexShaderSource } from "./shaderSource"

import Cat from '../../asset/cat.jpg';



function WebGLComponent() {


    const [gl, setGL] = useState<WebGL2RenderingContext>();
    const [program, setProgram] = useState<WebGLProgram>();
    const [vao, setVao] = useState<WebGLVertexArrayObject>();
    const [translationLocation, setTranslationLocation] = useState<any>();
    const [translation, setTranslation] = useState([0, 0]);
    const [positions, setPositions] = useState<number[]>(
        [
            0, 0,
            0, 0.5,
            0.7, 0,
            0.7, 0,
            0.7, 0.5,
            0, 0.5,
        ]
    )

    useEffect(() => {
        showShape()
        // renderImage()
    }, [])

    return (
        <div className="webgl-component-container">
            <div className="operate-shapely">
                <canvas id="webglCanvasDemo"></canvas>
                webGL page
                <button onClick={changeColor}>chang color</button>
                <button onClick={() => offsetFun(1)}>left</button>
                <button onClick={() => offsetFun(2)}>right</button>
                <button onClick={() => offsetFun(3)}>top</button>
                <button onClick={() => offsetFun(4)}>down</button>
            </div>
            <div className="operate-image">
                <p>显示图像：</p>
                <canvas id="imageCanvas"></canvas>
            </div>
        </div>
    )

    /**
     * 移动图形
     * 1、移动图形有两种方式：在js中设置新的顶点坐标；在顶点着色器中设置偏移量
     * @param type 
     */
    function offsetFun(type: number) {
        let x_offset = 0;
        let y_offset = 0;
        let offset_size = 0.1;
        switch (type) {
            case 1:
                x_offset = -1 * offset_size;
                break
            case 2:
                x_offset = offset_size;
                break
            case 3:
                y_offset = -1 * offset_size;
                break
            case 4:
                y_offset = offset_size;
                break
        };
        if (gl && program) {
            // draw(gl, program, vao, x_offset, y_offset);
            draw_v1(gl, program, vao, [translation[0] + x_offset, translation[1] + y_offset], translationLocation);
        }
    }

    function renderImage() {
        var image = new Image();
        image.src = Cat;  // MUST BE SAME DOMAIN!!!
        image.onload = function () {
            render(image);
        };
    }

    function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
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

    function render(image: HTMLImageElement) {
        let gl = getGLContextFromCanvas("imageCanvas");
        // setup GLSL program
        var program = createProgramFromSource(gl, imageVertexShaderSource, imageFragmentShaderSource);

        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var imageLocation = gl.getUniformLocation(program, "u_image");

        // Create a vertex array object (attribute state)
        var vao = gl.createVertexArray();

        // and make it the one we're currently working with
        gl.bindVertexArray(vao);

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        var positionBuffer = gl.createBuffer();

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), gl.STATIC_DRAW);

        // Turn on the attribute
        gl.enableVertexAttribArray(texCoordAttributeLocation);

        // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texCoordAttributeLocation, size, type, normalize, stride, offset);

        // Create a texture.
        var texture = gl.createTexture();

        // make unit 0 the active texture uint
        // (ie, the unit all other texture commands will affect
        gl.activeTexture(gl.TEXTURE0 + 0);

        // Bind it to texture unit 0' 2D bind point
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we don't need mips and so we're not filtering
        // and we don't repeat at the edges
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
        gl.texImage2D(gl.TEXTURE_2D,
            mipLevel,
            internalFormat,
            srcFormat,
            srcType,
            image);

        resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        clear_canvas(gl);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(imageLocation, 0);

        // Bind the position buffer so gl.bufferData that will be called
        // in setRectangle puts data in the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Set a rectangle the same size as the image.
        setRectangle(gl, 0, 0, image.width, image.height);
        draw_reactangle(gl);
    }

    /**
     * 修改当前图形颜色
     * 1、首先通过uniform修改颜色
     * 2、重绘图形
     */
    function changeColor() {
        if (gl && program) {
            clear_canvas(gl);
            setRandomColor(gl, program);
            draw_reactangle(gl)
        }
    }

    function showShape() {
        let gl = getGLContextFromCanvas("webglCanvasDemo")
        let program = createProgramFromSource(gl, vertexShaderSource, fragmentShaderSource);
        setGL(gl)
        setProgram(program)

        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let translationLocation = gl.getUniformLocation(program, "u_translation");
        let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

        // Create a buffer and put three 2d clip space points in it
        var positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let vao = create_vertex(gl, positionAttributeLocation);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        setTranslationLocation(translationLocation);
        setVao(vao);
        // draw(gl, program, vao, 0, 0);
        draw_v1(gl, program, vao, [0, 0], translationLocation);
    }

    /**
     * 通过着色器中的偏移量进行移动图形
     * @param gl 
     * @param program 
     * @param vao 
     * @param translation 
     * @param translationLocation 
     */
    function draw_v1(gl: WebGL2RenderingContext, program: WebGLProgram, vao: any, translation: number[], translationLocation: any) {
        resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);        
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        clear_canvas(gl);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);
       
        gl.uniform2fv(translationLocation, translation);
        setRandomColor(gl, program)
        draw_triangle(gl)
        setTranslation(translation);
    }

    function draw(gl: WebGL2RenderingContext, program: WebGLProgram, vao: any, xoffset: number, yoffset: number) {
        let new_positions = []
        for (let i = 0; i < positions.length; i++) {
            if (i % 2 == 0) {
                new_positions.push(positions[i] + xoffset)
            } else {
                new_positions.push(positions[i] + yoffset)
            }
        }
        setPositions(new_positions);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new_positions), gl.STATIC_DRAW);
        resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        clear_canvas(gl);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // setRandomColor(gl, program)
        setRandomColor(gl, program)
        draw_triangle(gl)
    }

    function draw_reactangle(gl: WebGL2RenderingContext) {
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;     // 顶点的偏移量
        var count = 6;      // 绘制多少个数据
        gl.drawArrays(primitiveType, offset, count);
    }

    function draw_triangle(gl: WebGL2RenderingContext) {
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;     // 顶点的偏移量
        var count = 3;      // 绘制多少个数据
        gl.drawArrays(primitiveType, offset, count);
    }

    function clear_canvas(gl: WebGL2RenderingContext) {
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    function create_vertex(gl: WebGL2RenderingContext, positionAttributeLocation: number) {
        // Create a vertex array object (attribute state)
        var vao = gl.createVertexArray() as WebGLVertexArrayObject;
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
        return vao;
    }


    function setRandomColor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        let colorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);    // 设置颜色

    }


}

export default WebGLComponent