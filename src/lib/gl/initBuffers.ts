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