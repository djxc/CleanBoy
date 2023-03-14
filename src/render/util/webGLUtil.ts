

/**
 * 创建着色器
 * @param gl webgl上下文
 * @param type 着色器类型
 * @param source 着色器语言
 * @returns 创建的着色器
 */
function createShader(gl: any, type: number, source: string) {
    var shader = gl.createShader(type); // 创建着色器对象
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


/**
 * 创建program
 * @param gl webGL上下文
 * @param vertexShader 顶点着色器
 * @param fragmentShader 片元着色器
 * @returns program
 */
function createProgram(gl: any, vertexShader: any, fragmentShader: any) {
    var program = gl.createProgram();
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

export {
    createShader, createProgram
}