/* This is a es2016 module anyway */
"use strict";

import { printMessage } from './lib/messages';
import FpsCounter from './lib/FpsCounter';
import { drawSquareScene } from './lib/gl/square/drawScene';
import { ProgramInfo } from './lib/gl/initProgram';
import { SquareBuffers } from './lib/gl/square/buffers';
import { SquareContext, initSquareContext } from './lib/gl/square/initScene';
import { PointContext, initPointContext } from './lib/gl/point/initScene';
import { drawPointScene } from './lib/gl/point/drawScene';

/* load this file with type="module" for defer behaviour */
//main();

/* handle clicks */
interface ClickLocation {
    x: number;
    y: number;
}
var clickLocation : null | ClickLocation = null;
function canvasClickHandler(evt: MouseEvent, canvas: HTMLCanvasElement) {
    // const rect = canvas.getBoundingClientRect();
    // const x = evt.pageX - rect.left;
    // const y = evt.pageY - rect.top;
    clickLocation = {
        x: evt.offsetX,
        y: evt.offsetY,
    }
    printMessage(`clicked at (${clickLocation.x},${clickLocation.y})`);
    console.log(`click (${clickLocation.x},${clickLocation.y})`, evt);
}

function resetClickHandling() {
    clickLocation = null;
}

/* set up the state */
interface State {
    points: ClickLocation[];
    updateTime: number;
    squareRotation: number;
};
var state: State;
function initialiseState() {
    state = {
        points: [],
        updateTime: window.performance.now(),
        squareRotation: 0,
    };
}

/* calculate updated state */
function updateState(frameTime: number) {
    const deltaTime = frameTime - state.updateTime;
    state.updateTime = frameTime;

    // 0.0001 radians per millisecond???
    state.squareRotation += deltaTime * 0.0001;

    if (clickLocation) {
        state.points.push(clickLocation);
    }
}

/* redraw the display on a gl context */
interface DrawFrameContext {
    gl: WebGLRenderingContext;
    squareContext: SquareContext;
    pointContext: PointContext;
}

function drawFrame(ctx: DrawFrameContext) {
    /* MASSIVE OPENGL BULLSHIT GOES HERE */
    for (const point of state.points) {
        // drawPoint(point);
    }

    drawSquareScene(ctx.squareContext, state.squareRotation);

    let pointPos = {x: 400-.5, y: 300-.5};
    if (state.points.length > 0)
        pointPos = state.points[state.points.length-1];
    drawPointScene(ctx.pointContext, pointPos);
}

/* entry point */
function main() {
    console.log("Hello from voronoi-demo.js");

    try {
        const mainCanvas: HTMLCanvasElement = document.querySelector("#main-canvas") ??
            (() => { throw new Error("Couldn't find #main-canvas") })();

        /* XXX frob the dimensions */
        {
            const dpr = window.devicePixelRatio || 1;
            const rect = mainCanvas.getBoundingClientRect();
            // mainCanvas.width = rect.width * dpr;
            // mainCanvas.height = rect.height * dpr;
            mainCanvas.width = mainCanvas.clientWidth * dpr;
            mainCanvas.height = mainCanvas.clientHeight * dpr;
            printMessage(`mainCanvas dims: boundingClientRect=(${rect.width}x${rect.height}) clientW/H=(${mainCanvas.clientWidth}x${mainCanvas.clientHeight}) dpr=${dpr} width/height=${mainCanvas.width}x${mainCanvas.height}`);
        }

        const gl = mainCanvas.getContext("webgl");

        if (gl === null) {
            throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        printMessage(`Welcome to voronoi-demo. Starting...`);

        /* rebeccapurple is #663399 */
        gl.clearColor(0.2588, 0.1294, 0.3882, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const squareContext = initSquareContext(gl);
        console.log('square', squareContext);

        const pointContext = initPointContext(gl);
        console.log('point', pointContext);

        const fpsCounterElement : HTMLElement | null = document.querySelector("#fps-output");
        const fpsCounter = new FpsCounter({ element: fpsCounterElement });

        const context = { mainCanvas, gl, squareContext, pointContext, fpsCounter };
        // eval(`window.DEBUG??={};window.DEBUG.context=context;`);

        mainCanvas.addEventListener('click', e => canvasClickHandler(e, mainCanvas));

        let loopHandle: number;
        const mainLoop : FrameRequestCallback = (frameTime) => {
            loopHandle = window.requestAnimationFrame(mainLoop);
            try {
                fpsCounter.updateFps(frameTime);
                updateState(frameTime);
                resetClickHandling();
                drawFrame(context);
            } catch (e) {
                /* XXX: zombie event handlers are not cleared */
                printMessage("stopping: " + e);
                window.cancelAnimationFrame(loopHandle);
                throw e;
            }
        };

        /* setup and yield to the main loop */
        initialiseState();
        window.setTimeout(() => mainLoop(window.performance.now()), 0);
    } catch (e) {
        printMessage("initialisation failed: " + e);
        throw e;
    }
}

main();