import { ECS } from "@ts-basic/ecs";
import * as planck from "planck";
import { ShapeComponent } from "./ShapeComponent";
import { TransformComponent } from "./TransformComponent";
import { DrawingSystem } from "./DrawingSystem";
import { clearCanvas, createCanvasElement, getCanvasContext, printFPS } from "./common";

// GAME CONSTANTS
const FPS_FRAME_COUNT = 50; // number of frames to average FPS over
const DRAWING_SCALE_FACTOR = 16;

// CANVAS SETUP
const canvasElement = createCanvasElement();
document.body.appendChild(canvasElement);
const canvasContext = getCanvasContext(canvasElement);

// ECS SETUP
const ecs = new ECS();
ecs.registerComponent(TransformComponent);
ecs.registerComponent(ShapeComponent);

const drawingSystem = new DrawingSystem(ecs, canvasContext, DRAWING_SCALE_FACTOR);
ecs.addSystem(drawingSystem);

// PHYSICS SETUP
const planckWorld = planck.World(planck.Vec2(0, 15));
planckWorld.setContinuousPhysics(true);

// GROUND SETUP
const groundEntity = ecs.createEntity();
const groundBody = planckWorld.createBody({ position: planck.Vec2(25, 40) });
const groundFixture = groundBody.createFixture(
    planck.Edge(planck.Vec2(-15, 0), planck.Vec2(15, 0)),
    0
);
ecs.assignComponent(groundEntity, new TransformComponent(groundBody));
ecs.assignComponent(groundEntity, new ShapeComponent(groundFixture.getShape()));

// PLATFORM SETUP
function createPlatform(position: planck.Vec2, length: number) {
    const platformEntity = ecs.createEntity();
    const platformBody = planckWorld.createBody({ position });
    const platformFixture = platformBody.createFixture(
        planck.Edge(planck.Vec2(-(length / 2), 0), planck.Vec2(length / 2, 0)),
        0
    );
    ecs.assignComponent(platformEntity, new TransformComponent(platformBody));
    ecs.assignComponent(platformEntity, new ShapeComponent(platformFixture.getShape()));
}

const platforms = [
    [25, 10],
    [22.5, 15], [27.5, 15],
    [20, 20], [25, 20], [30, 20],
    [17.5, 25], [22.5, 25], [27.5, 25], [32.5, 25]
];

for (let i = 0; i < platforms.length; i++) {
    createPlatform(planck.Vec2(platforms[i][0], platforms[i][1]), 0.5);
}

//
function createSquare(position: planck.Vec2, mass: number, size: number) {
    const boxEntity = ecs.createEntity();
    const boxBody = planckWorld.createDynamicBody({ position });
    const boxFixture = boxBody.createFixture(planck.Box(size, size), 0);
    boxBody.setMassData({ mass, center: planck.Vec2(), I: 1 });
    ecs.assignComponent(boxEntity, new TransformComponent(boxBody));
    ecs.assignComponent(boxEntity, new ShapeComponent(boxFixture.getShape()));
}
function createCircle(position: planck.Vec2, mass: number, radius: number) {
    const circleEntity = ecs.createEntity();
    const circleBody = planckWorld.createDynamicBody({ position });
    const circleFixture = circleBody.createFixture(planck.Circle(radius), 0);
    circleBody.setMassData({ mass, center: planck.Vec2(), I: 1 });
    ecs.assignComponent(circleEntity, new TransformComponent(circleBody));
    ecs.assignComponent(circleEntity, new ShapeComponent(circleFixture.getShape()));
}
function shapeFactory() {
    if (Math.random() * 2 > 1) {
        createSquare(planck.Vec2(20 + Math.random() * 10, 0), 5, 0.5);
    } else {
        createCircle(planck.Vec2(20 + Math.random() * 10, 0), 5, 0.5);
    }
}

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

    planckWorld.step(deltaTime, 8, 3);

    clearCanvas(canvasContext);
    shapeFactory();
    ecs.tick(deltaTime);
    printFPS(canvasContext, fps);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
