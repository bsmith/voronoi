export interface Buffers {
    position: WebGLBuffer;
}

const squarePositions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
];

export function initBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = initPositionBuffer(gl, squarePositions);

    return {
        position: positionBuffer,
    };
}

export function initPositionBuffer(gl: WebGLRenderingContext, positions: Iterable<number> | Float32Array): WebGLBuffer {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    if (positionBuffer === null)
        throw new Error("initPositionBuffer-->gl.createBuffer() failed");

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    const array = positions instanceof Float32Array ? positions :
        new Float32Array(positions);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

    return positionBuffer;
}