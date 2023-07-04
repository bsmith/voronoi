import { initArrayBuffer } from "../initBuffers";

export interface SquareBuffers {
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

export function initSquareBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = initArrayBuffer(gl, squarePositions);
    const colorBuffer = initArrayBuffer(gl, squareColours);

    return {
        position: positionBuffer,
        color: colorBuffer
    };
}