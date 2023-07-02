export interface Buffers {
    position: WebGLBuffer;
}

export function initBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = initPositionBuffer(gl);

    return {
        position: positionBuffer,
    };
}

export function initPositionBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    if (positionBuffer === null)
        throw new Error("initPositionBuffer-->gl.createBuffer() failed");

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}