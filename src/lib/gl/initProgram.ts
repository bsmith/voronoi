export interface ShaderVariables {
    attribs: { [name:string]: string },
    uniforms: { [name:string]: string },
}

export interface ShaderInfo {
    shaderVariables: ShaderVariables,
    vertexSrc: string,
    fragmentSrc: string,
}

interface AttribLocations {
    [name: string]: number;
}

interface UniformLocations {
    [name: string]: WebGLUniformLocation;
}

export interface ProgramInfo {
    program: WebGLProgram,
    attribLocations: AttribLocations,
    uniformLocations: UniformLocations
}

export function initProgram(gl: WebGLRenderingContext, shaderInfo: ShaderInfo): ProgramInfo {
    const shaderProgram = initShaderProgram(gl, shaderInfo.vertexSrc, shaderInfo.fragmentSrc);
    const programInfo : ProgramInfo = {
        program: shaderProgram,
        attribLocations: {},
        uniformLocations: {}
    };
    for (const attribKey in shaderInfo.shaderVariables.attribs) {
        programInfo.attribLocations[attribKey] = gl.getAttribLocation(shaderProgram, shaderInfo.shaderVariables.attribs[attribKey]);
    };
    for (const uniformKey in shaderInfo.shaderVariables.uniforms) {
        const location = gl.getUniformLocation(shaderProgram, shaderInfo.shaderVariables.uniforms[uniformKey]);
        if (location === null)
            throw new Error("initProgram-->gl.getUniformLocation couldn't find attrib");
        programInfo.uniformLocations[uniformKey] = location;
    }
    return programInfo;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null)
        throw new Error("initShaderProgram-->gl.createProgram() failed");
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, throw
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
export function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (shader === null)
        throw new Error("loadShader-->gl.createShader() failed");

    // Send the source to the shader object
    gl.shaderSource(shader, source.trim());

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const e = new Error(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        );
        gl.deleteShader(shader);
        throw e;
    }

    const translated = (gl
        .getExtension("WEBGL_debug_shaders") as WEBGL_debug_shaders)
        .getTranslatedShaderSource(shader);
    console.log(`compiled shader`, source, translated);

    return shader;
}