
function getGLContextFromCanvas(canvasId: string) {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    let canvas: any = document.getElementById(canvasId);

    let gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }
    return gl;
}

function createProgramFromSource(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader;
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;
    let program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;
    return program
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


export {
    getGLContextFromCanvas,
    createProgram, createProgramFromSource,
    createShader, resizeCanvasToDisplaySize
}