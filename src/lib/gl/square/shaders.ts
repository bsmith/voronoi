import { ShaderInfo } from "../initProgram";

export const shaderVariables = {
    attribs: {
        vertexPosition: 'aVertexPosition',
        vertexColor: 'aVertexColor'
    },
    uniforms: {
        modelViewMatrix: 'uModelViewMatrix',
        projectionMatrix: 'uProjectionMatrix'
    },
}

export const vertexSrc = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

export const fragmentSrc = `
    varying lowp vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

export const squareShadersInfo: ShaderInfo = {
    shaderVariables,
    vertexSrc,
    fragmentSrc
}