import { ProgramInfo, initProgram } from "../initProgram";
import { SquareBuffers, initSquareBuffers } from "./buffers";
import { squareShadersInfo } from "./shaders";

export interface SquareContext {
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: SquareBuffers,
}

export function initSquareContext(gl: WebGLRenderingContext): SquareContext {
    const programInfo = initProgram(gl, squareShadersInfo);
    const buffers = initSquareBuffers(gl);
    return { gl, programInfo, buffers}
}