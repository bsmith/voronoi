/* load this file with type="module" for defer behaviour */
main();

/* show a message, both to the user and on the console */
function printMessage(message) {
    console.log(`message: ${message}`);
    const div = document.createElement("div");
    div.innerText = message;
    const output = document.querySelector("#messages-output");
    output.appendChild(div);
    // div.scrollIntoView();
    output.scrollTop = output.scrollHeight;
}

/* class to manage the fps counter */
function FpsCounter({ element }) {
    let frameCount = 0;
    let lastFrameTime = window.performance.now();
    const updateFps = element ? (frameTime) => {
        frameCount++;
        if (frameCount === 30) {
            const fps = (frameTime - lastFrameTime) / frameCount;
            element.innerText = fps.toPrecision(3);

            frameCount = 0;
            lastFrameTime = frameTime;
        }
    } : () => { /* do nothing */ };

    const methods = { updateFps };
    return Object.assign(new.target ? this : Object.create(FpsCounter.prototype), methods);
}

/* handle clicks */
let clickLocation = null;
function canvasClickHandler(evt, canvas) {
    // const rect = canvas.getBoundingClientRect();
    // const x = evt.pageX - rect.left;
    // const y = evt.pageY - rect.top;
    clickLocation = {
        x: evt.offsetX,
        y: evt.offsetY,
    }
    printMessage(`clicked at (${clickLocation.x},${clickLocation.y}`);
}

function resetClickHandling() {
    clickLocation = null;
}

/* set up the state */
let state;
function initialiseState() {
    state = {
        points: [],
    };
}

/* calculate updated state */
function updateState(frameTime) {
    if (clickLocation) {
        state.points.push(clickLocation);
    }
}

/* redraw the display on a gl context */
function drawFrame(gl) {
    /* MASSIVE OPENGL BULLSHIT GOES HERE */
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

        mainCanvas.addEventListener('click', e => canvasClickHandler(e, mainCanvas));

        const mainLoop = (frameTime) => {
            window.requestAnimationFrame(mainLoop);
            fpsCounter.updateFps(frameTime);
            updateState(frameTime);
            resetClickHandling();
            drawFrame(gl);
        };

        /* setup and yield to the main loop */
        initialiseState();
        window.setTimeout(mainLoop, 0);
    } catch (e) {
        printMessage("" + e);
        throw e;
    }
}