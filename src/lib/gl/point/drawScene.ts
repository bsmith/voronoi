import { PointContext } from "./initScene";

type Position = {x: number, y: number};

export function drawPointScene({gl, programInfo, buffer}: PointContext, position: Position) {
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);

    gl.useProgram(programInfo.program);

    const canvas = gl.canvas as HTMLCanvasElement;

    gl.uniform2f(programInfo.uniformLocations.pointPosition,
        position.x, position.y);
    gl.uniform2f(programInfo.uniformLocations.resolution,
        canvas.clientWidth, canvas.clientHeight);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.POINTS, 0, 1);
    gl.disable(gl.BLEND);
}