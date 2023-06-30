/* This is a es2016 module anyway */
"use strict";

/* load this file with type="module" for defer behaviour */
main();

/* show a message, both to the user and on the console */
function printMessage(message: string) {
    console.log(`message: ${message}`);
    const div = document.createElement("div");
    div.innerText = message;
    const output = document.querySelector("#messages-output");
    if (output == null)
        return;
    output.appendChild(div);
    // div.scrollIntoView();
    output.scrollTop = output.scrollHeight;
}

/* class to manage the fps counter */
interface FpsCounter {
    updateFps(frameTime: number): void;
}

interface FpsCounterConstructor {
    new(_ : { element: null | HTMLElement }): FpsCounter;
}

var FpsCounter = function (this: FpsCounter, { element } : { element: null | HTMLElement }) : FpsCounter {
    let frameCount = 0;
    let maxFrameTimeDelta = 0;
    let countStartTime = window.performance.now();
    let lastFrameTime = countStartTime;
    const updateFps = element ? (frameTime: number) => {
        frameCount++;

        const frameTimeDelta = frameTime - lastFrameTime;
        lastFrameTime = frameTime;
        if (frameTimeDelta > maxFrameTimeDelta)
            maxFrameTimeDelta = frameTimeDelta;

        /* update every 30 frame ie approx twice per second */
        if (frameCount === 30) {
            const fps = (frameCount / (frameTime - countStartTime) * 1000).toPrecision(3);
            const avg = ((frameTime - countStartTime) / frameCount).toPrecision(3);
            const max = maxFrameTimeDelta.toPrecision(3);
            element.innerText = `${fps} fps (avg: ${avg} ms; max: ${max} ms)`;

            frameCount = 0;
            maxFrameTimeDelta = 0;
            countStartTime = frameTime;
        }
    } : () => { /* do nothing */ };

    const methods = { updateFps };
    return Object.assign(new.target ? this : Object.create(FpsCounter.prototype), methods);
} as any as FpsCounterConstructor;

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
}

function resetClickHandling() {
    clickLocation = null;
}

/* set up the state */
var state: { points: ClickLocation[] };
function initialiseState() {
    state = {
        points: [],
    };
}

/* calculate updated state */
function updateState(frameTime: number) {
    if (clickLocation) {
        state.points.push(clickLocation);
    }
}

/* redraw the display on a gl context */
function drawFrame(gl: WebGLRenderingContext) {
    /* MASSIVE OPENGL BULLSHIT GOES HERE */
    for (const point of state.points) {
        // drawPoint(point);
    }
}

/* entry point */
function main() {
    console.log("Hello from voronoi-demo.js");

    try {
        const mainCanvas: HTMLCanvasElement = document.querySelector("#main-canvas") ??
            (() => { throw new Error("Couldn't find #main-canvas") })();
        const gl = mainCanvas.getContext("webgl");

        if (gl === null) {
            throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        printMessage(`Welcome to voronoi-demo. Starting...`);

        /* rebeccapurple is #663399 */
        gl.clearColor(0.2588, 0.1294, 0.3882, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const fpsCounterElement : HTMLElement | null = document.querySelector("#fps-output");
        const fpsCounter = new FpsCounter({ element: fpsCounterElement });

        mainCanvas.addEventListener('click', e => canvasClickHandler(e, mainCanvas));

        let loopHandle;
        const mainLoop : FrameRequestCallback = (frameTime) => {
            loopHandle = window.requestAnimationFrame(mainLoop);
            try {
                fpsCounter.updateFps(frameTime);
                updateState(frameTime);
                resetClickHandling();
                drawFrame(gl);
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