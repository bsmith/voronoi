import { ProgramInfo, initProgram } from "../initProgram";
import { pointShadersInfo } from "./shaders";

export interface PointContext {
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffer: WebGLBuffer,
}

export function initPointContext(gl: WebGLRenderingContext): PointContext {
    const programInfo = initProgram(gl, pointShadersInfo);
    const buffer = gl.createBuffer();
    if (buffer === null)
        throw new Error("initSquareContext-->gl.createBuffer() failed");
    /* we don't actually put any data in the buffer */
    return { gl, programInfo, buffer }
}