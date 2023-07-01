/* class to manage the fps counter */
export interface FpsCounter {
    updateFps(frameTime: number): void;
}

export interface FpsCounterConstructor {
    new(_ : { element: null | HTMLElement }): FpsCounter;
}

const FpsCounter = function (this: FpsCounter, { element } : { element: null | HTMLElement }) : FpsCounter {
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

export default FpsCounter;