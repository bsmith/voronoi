export interface Buffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
}

const squarePositions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
];

const squareColours = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
];

export function initBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = initArrayBuffer(gl, squarePositions);
    const colorBuffer = initArrayBuffer(gl, squareColours);

    return {
        position: positionBuffer,
        color: colorBuffer
    };
}

type toF32ArraySrc = Iterable<number> | Float32Array;
const toF32Array = (data: toF32ArraySrc) : Float32Array => {
    return data instanceof Float32Array ? data :
        new Float32Array(data);
}

export function initArrayBuffer(gl: WebGLRenderingContext, data: Iterable<number> | Float32Array): WebGLBuffer {
    // Create a buffer for the data
    const buffer = gl.createBuffer();
    if (buffer === null)
        throw new Error("initArrayBuffer-->gl.createBuffer() failed");

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, toF32Array(data), gl.STATIC_DRAW);

    return buffer;
}