import { ShaderInfo } from "../initProgram";

export const pointShadersInfo : ShaderInfo = {
    shaderVariables: {
        attribs: {
        },
        uniforms: {
            pointPosition: 'uPointPosition',
            resolution: 'uResolution',
        },
    },
    fragmentSrc: `
#version 100
precision mediump float;
void main() {
    gl_FragColor = vec4(0.18, 0.54, 0.34, 0.5);
    float radius = distance(gl_PointCoord,vec2(0.5,0.5))*2.;
    gl_FragColor *= 1.-radius;
}
    `,
    vertexSrc: `
#version 100
uniform vec2 uPointPosition;
uniform vec2 uResolution;
void main() {
    vec2 uv = 2.*uPointPosition.xy/uResolution.xy-1.;
    uv *= vec2(1.0,-1.0);
    gl_Position = vec4(uv.xy, 0.0, 1.0);
    gl_PointSize = 64.0;
}
    `,
};