import { ECS } from "@ts-basic/ecs";
import * as PIXI from "pixi.js";
import { RenderingSystem } from "./RenderingSystem";
import { UISystem } from "./UISystem";
import { SpriteSystem } from "./SpriteSystem";
import { Vec2, World } from "planck";
import { PhysicsSystem } from "./Systems/PhysicsSystem";
import { TransformComponent } from "./Components/TransformComponent";
import { SpriteComponent } from "./SpriteComponent";
import CharactersSheet from "./Spritesheets/characters.json";

// GAME CONSTANTS
const PIXELS_PER_METER = 16;

// RENDERER SETUP
const renderer = new PIXI.Renderer({ backgroundColor: "black", antialias: false });
PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
const mainStage = new PIXI.Container();
const spriteStage = new PIXI.Container();
const uiStage = new PIXI.Container();
mainStage.addChild(spriteStage);
mainStage.addChild(uiStage);

// ECS SETUP
const ecs = new ECS();
ecs.registerComponent(SpriteComponent);
ecs.registerComponent(TransformComponent);

const physicsWorld = new World(Vec2(0, 9.8));
physicsWorld.setContinuousPhysics(true);
const physicsSystem = new PhysicsSystem(ecs, physicsWorld);
ecs.addSystem(physicsSystem);

const spriteSystem = new SpriteSystem(ecs, PIXELS_PER_METER, spriteStage);
ecs.addSystem(spriteSystem);

const uiSystem = new UISystem(ecs, uiStage);
ecs.addSystem(uiSystem);

const renderingSystem = new RenderingSystem(ecs, renderer, mainStage);
window.addEventListener("resize", () => renderingSystem.resizeRenderer());
ecs.addSystem(renderingSystem);


const texture = PIXI.BaseTexture.from(CharactersSheet.src);
const spritesheet = new PIXI.Spritesheet(texture, CharactersSheet.atlas);
(async () => await spritesheet.parse())();
const sprite = new PIXI.AnimatedSprite(spritesheet.animations.personDown);
sprite.textures = spritesheet.animations.personUp;
sprite.animationSpeed = 0.1;
sprite.play();
sprite.x = 20;
sprite.y = 20;
const entity = ecs.createEntity();
ecs.assignComponent(entity, new SpriteComponent(sprite, Vec2(0.5, 0.5)));
ecs.assignComponent(entity, new TransformComponent(Vec2(1, 1), Vec2(1, 1), 0));


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

document.body.appendChild(renderingSystem.canvas);

/*
 * GAME LOOP
 *
 * DOMHighResTimeStamp accuracy is limited without certain security
 * requirements. See the following webpage for more information:
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#security_requirements
 */
let prevTime = 0;

function gameLoop(now: DOMHighResTimeStamp) {
    const time = now / 1000;
    let deltaTime = time - prevTime;
    prevTime = time;
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 1) deltaTime = 1;

    // planckWorld.step(deltaTime, 8, 3);

    ecs.tick(deltaTime);

    requestAnimationFrame(gameLoop);
}

// delta time warm-up cycle
requestAnimationFrame((now: DOMHighResTimeStamp) => {
    prevTime = now / 1000;
    requestAnimationFrame(gameLoop);
});
