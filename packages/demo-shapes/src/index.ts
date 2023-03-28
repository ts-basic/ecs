import { ECS } from "@ts-basic/ecs";
import { ShapeComponent } from "./ShapeComponent";
import { PositionComponent } from "./PositionComponent";
import { ColorComponent } from "./ColorComponent";
import { DrawingSystem } from "./DrawingSystem";
import { clearCanvas, createCanvasElement, getCanvasContext, printFPS } from "./common";

// GAME CONSTANTS
const MAX_SHAPE_SIZE = 32; // circle diameter or rectangle width/height
const MAX_SHAPE_COUNT = 2500; // number of shapes to draw
const FPS_FRAME_COUNT = 50; // number of frames to average FPS over

// CANVAS SETUP
const canvasElement = createCanvasElement();
document.body.appendChild(canvasElement);
const canvasContext = getCanvasContext(canvasElement);

// ECS SETUP
const ecs = new ECS();

ecs.registerComponent(PositionComponent);
ecs.registerComponent(ShapeComponent);
ecs.registerComponent(ColorComponent);

const drawingSystem = new DrawingSystem(ecs, canvasContext, MAX_SHAPE_SIZE, MAX_SHAPE_COUNT);
ecs.addSystem(drawingSystem);

/*
 * GAME LOOP
 *
 * DOMHighResTimeStamp accuracy is limited without certain security
 * requirements. See the following webpage for more information:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#security_requirements
 */
let prevTime = performance.now() / 1000;
const frameTimes = Array(FPS_FRAME_COUNT).fill(0);

function gameLoop(now: DOMHighResTimeStamp) {
    const time = now / 1000;
    const deltaTime = time - prevTime;
    frameTimes.shift();
    frameTimes.push(1 / deltaTime);
    const fps = Math.round(frameTimes.reduce((a, b) => a + b, 0) / FPS_FRAME_COUNT);
    prevTime = time;

    clearCanvas(canvasContext);
    ecs.tick(deltaTime);
    printFPS(canvasContext, fps);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
