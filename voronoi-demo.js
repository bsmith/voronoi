/* load this file with type="module" for defer behaviour */
main();

/* show a message, both to the user and on the console */
function printMessage(message) {
    console.log(`message: ${message}`);
    const div = document.createElement("div");
    div.innerText = message;
    document.querySelector("#messages-output").appendChild(div);
}

/* class to manage the fps counter */
function FpsCounter({ element }) {
    let frameCount = 0;
    let lastFrameTime = window.performance.now();
    const updateFps = element ? (frameTime) => {
        frameCount++;
        if (frameCount === 30) {
            const fps = (frameTime - lastFrameTime) / frameCount;
            element.innerText = `${fps}`;

            frameCount = 0;
            lastFrameTime = frameTime;
        }
    } : () => { /* do nothing */ };

    const methods = { updateFps };
    return Object.assign(new.target ? this : Object.create(FpsCounter.prototype), methods);
}

/* calculate updated state */
function updateState(frameTime) {

}

/* redraw the display on a gl context */
function drawFrame(gl) {

}

/* entry point */
function main() {
    console.log("Hello from voronoi-demo.js");

    try {
        const mainCanvas = document.querySelector("#main-canvas");
        const gl = mainCanvas.getContext("webgl");

        if (gl === null) {
            throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        printMessage(`Welcome to voronoi-demo. Starting...`);

        /* rebeccapurple is #663399 */
        gl.clearColor(0.2588, 0.1294, 0.3882, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const fpsCounterElement = document.querySelector("#fps-output");
        const fpsCounter = new FpsCounter({ element: fpsCounterElement });

        const mainLoop = (frameTime) => {
            window.requestAnimationFrame(mainLoop);
            fpsCounter.updateFps(frameTime);
            updateState(frameTime);
            drawFrame(gl);
        };

        /* yield to the main loop */
        window.setTimeout(mainLoop, 0);
    } catch (e) {
        printMessage("" + e);
        throw e;
    }
}