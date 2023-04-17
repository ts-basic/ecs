import { Game } from "./Game";
import {
    CustomUpdateComponent,
    RigidBodyComponent,
    SpriteComponent,
    TransformComponent,
    UITextComponent,
} from "./Components";
import { Vec2 } from "planck";
import { FPSScript } from "./Scripts/FPSScript";

function createDynamicBody(position: Vec2, width: number, height: number): number {
    const game = Game.instance();
    const entity = game.ecs.createEntity();
    const transformComponent = new TransformComponent(Vec2(), Vec2(1, 1), 0);
    const rigidBodyComponent = new RigidBodyComponent(
        game.physics.createDynamicBody({
            position,
            fixedRotation: true,
        })
    );
    rigidBodyComponent.attachBoxCollider(width, height).setMassData(1, Vec2());
    game.ecs.assignComponent(entity, transformComponent);
    game.ecs.assignComponent(entity, rigidBodyComponent);
    return entity;
}

function createWall(position: Vec2, width: number, height: number): number {
    const game = Game.instance();
    const entity = game.ecs.createEntity();
    const transformComponent = new TransformComponent(position, Vec2(1, 1), 0);
    const rigidBodyComponent = new RigidBodyComponent(game.physics.createBody(position));
    rigidBodyComponent.attachBoxCollider(width, height);
    game.ecs.assignComponent(entity, transformComponent);
    game.ecs.assignComponent(entity, rigidBodyComponent);
    return entity;
}

(async () => {
    const game = Game.instance();
    await game.init();

    const player = createDynamicBody(Vec2(5, 5), 1, 1);
    const textures = game.animations.get("characters").get("personDown");
    const spriteComponent = SpriteComponent.createAnimatedSprite(textures, 0.1, Vec2(0.5, 0.7));
    game.ecs.assignComponent(player, spriteComponent);

    createWall(Vec2(7.5, 15.5), 15, 1);
    createWall(Vec2(7.5, -0.5), 15, 1);
    createWall(Vec2(-0.5, 7.5), 1, 15);
    createWall(Vec2(15.5, 7.5), 1, 15);

    const fpsEntity = game.ecs.createEntity();
    game.ecs.assignComponent(fpsEntity, new CustomUpdateComponent(new FPSScript()));
    game.ecs.assignComponent(fpsEntity, new UITextComponent("FPS"));
    game.ecs.assignComponent(fpsEntity, new TransformComponent(Vec2(0, 0), Vec2(1, 1), 0));

    game.start();
})();

// const groundFixture = groundBody.createFixture(
//     planck.Edge(planck.Vec2(-15, 0), planck.Vec2(15, 0)),
//     0
// );
// ecs.
