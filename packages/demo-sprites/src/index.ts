import * as PIXI from "pixi.js";
import { Box, Vec2 } from "planck";
import { RigidBodyComponent, SpriteComponent, TransformComponent } from "./Components";
import resources from "./resources.json";
import { StrictMap } from "./common";
import { Game } from "./Game";

const game = new Game();
(async () => game.init())();

// ECS SETUP
let prevTime = 0;
const spritesheets: StrictMap<string, PIXI.Spritesheet> = new StrictMap();

async function init() {
    for (const resourceGroup in resources) {
        spritesheets.set(resource.name, new PIXI.Spritesheet(textures[resource.name], resource.atlas));
        await spritesheets.get(resource.name).parse();
    }

    const sprite = new PIXI.AnimatedSprite(spritesheets.get("characters").animations.personDown);
    sprite.animationSpeed = 0.1;
    sprite.play();
    sprite.x = 20;
    sprite.y = 20;
    const boxBody = physicsWorld.createDynamicBody({ position: new Vec2(7.5, 7.5) });
    const boxFixture = boxBody.createFixture(Box(1, 1), 0);
    boxBody.setMassData({ mass: 1, center: Vec2(), I: 1 });
    const entity = ecs.createEntity();
    ecs.assignComponent(entity, new SpriteComponent(sprite, Vec2(0.5, 0.5)));
    ecs.assignComponent(entity, new TransformComponent(Vec2(1, 1), Vec2(1, 1), 0));
    ecs.assignComponent(entity, new RigidBodyComponent(boxBody));

    // delta time warm-up cycle
    requestAnimationFrame((now: DOMHighResTimeStamp) => {
        prevTime = now / 1000;
        requestAnimationFrame(gameLoop);
    });
}

init();

// const drawingSystem = new RenderingSystem(ecs, canvasContext, PIXELS_PER_METER);
// ecs.addSystem(drawingSystem);

// GROUND SETUP
// const groundEntity = ecs.createEntity();
// const groundBody = planckWorld.createBody({ position: planck.Vec2(25, 40) });
// const groundFixture = groundBody.createFixture(
//     planck.Edge(planck.Vec2(-15, 0), planck.Vec2(15, 0)),
//     0
// );
// ecs.assignComponent(groundEntity, new TransformComponent(groundBody));
// ecs.assignComponent(groundEntity, new ShapeComponent(groundFixture.getShape()));

// PLATFORM SETUP
// function createPlatform(position: planck.Vec2, length: number) {
//     const platformEntity = ecs.createEntity();
//     const platformBody = planckWorld.createBody({ position });
//     const platformFixture = platformBody.createFixture(
//         planck.Edge(planck.Vec2(-(length / 2), 0), planck.Vec2(length / 2, 0)),
//         0
//     );
//     ecs.assignComponent(platformEntity, new TransformComponent(platformBody));
//     ecs.assignComponent(platformEntity, new ShapeComponent(platformFixture.getShape()));
// }

// const platforms = [
//     [25, 10],
//     [22.5, 15], [27.5, 15],
//     [20, 20], [25, 20], [30, 20],
//     [17.5, 25], [22.5, 25], [27.5, 25], [32.5, 25]
// ];

// for (let i = 0; i < platforms.length; i++) {
//     createPlatform(planck.Vec2(platforms[i][0], platforms[i][1]), 0.5);
// }

//
/*function createSquare(position: planck.Vec2, mass: number, size: number) {
    const boxEntity = ecs.createEntity();
    const boxBody = planckWorld.createDynamicBody({ position });
    const boxFixture = boxBody.createFixture(planck.Box(size, size), 0);
    boxBody.setMassData({ mass, center: planck.Vec2(), I: 1 });
    ecs.assignComponent(boxEntity, new TransformComponent(boxBody));
    ecs.assignComponent(boxEntity, new ShapeComponent(boxFixture.getShape()));
}*/
/*function createCircle(position: planck.Vec2, mass: number, radius: number) {
    const circleEntity = ecs.createEntity();
    const circleBody = planckWorld.createDynamicBody({ position });
    const circleFixture = circleBody.createFixture(planck.Circle(radius), 0);
    circleBody.setMassData({ mass, center: planck.Vec2(), I: 1 });
    ecs.assignComponent(circleEntity, new TransformComponent(circleBody));
    ecs.assignComponent(circleEntity, new ShapeComponent(circleFixture.getShape()));
}*/
/*function shapeFactory() {
    if (Math.random() * 2 > 1) {
        createSquare(planck.Vec2(20 + Math.random() * 10, 0), 5, 0.5);
    } else {
        createCircle(planck.Vec2(20 + Math.random() * 10, 0), 5, 0.5);
    }
}*/

/*
 * GAME LOOP
 *
 * DOMHighResTimeStamp accuracy is limited without certain security
 * requirements. See the following webpage for more information:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#security_requirements
 */
function gameLoop(now: DOMHighResTimeStamp) {
    const time = now / 1000;
    let deltaTime = time - prevTime;
    prevTime = time;
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 1) deltaTime = 1;

    game.ecs.tick(deltaTime);

    requestAnimationFrame(gameLoop);
}
