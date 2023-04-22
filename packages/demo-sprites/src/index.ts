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
import { Player } from "./Scripts/Player";

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

    // prettier-ignore
    const tiles = [
        [
            ["crownNW", "crownN", "crownN", "crownN", "crownN", "crownN", "crownN", "crownN", "crownN", "crownNE"],
            ["crownW", "wallTop", "wallTop", "wallTop", "wallTop", "wallTop", "wallTop", "wallTop", "wallTop", "crownE"],
            ["crownW", "wallBtm", "wallBtm", "wallBtm", "wallBtm", "wallBtm", "wallBtm", "wallBtm", "wallBtm", "crownE"],
            ["crownW", "floor1", "floor1", "floor1", "floor1", "floor1", "floor2", "floor1", "floor1", "crownE"],
            ["crownW", "floor1", "floor2", "floor1", "floor1", "floor1", "floor1", "floor1", "floor2", "crownE"],
            ["crownW", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "crownE"],
            ["crownW", "floor1", "floor1", "floor1", "floor2", "floor1", "floor1", "floor1", "floor1", "crownE"],
            ["crownW", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "floor1", "crownE"],
            ["crownSW", "crownS", "crownS", "crownS", "crownS", "crownS", "crownS", "crownS", "crownS", "crownSE"]
        ], [
            [],
            [null, null, null, null, "windowTL", "windowTR"],
            [null, "bedTop", null, null, "windowBL", "windowBR", null, null, "plantT", null],
            [null, "bedBtm", null, null, null, null, null, "chair", "plantB", null],
        ], [
            [],
            [null, null, null, null, "curtainTL", "curtainTR"],
            [null, null, null, null, "curtainBL", "curtainBR"],
        ]
    ];

    for (const group of tiles) {
        for (let y = 0; y < group.length; y++) {
            for (let x = 0; x < group[y].length; x++) {
                const tile = group[y][x];
                if (tile === null) continue;
                const texture = game.tiles.get("interior").get(tile);
                const entity = game.ecs.createEntity();
                game.ecs.assignComponent(entity, SpriteComponent.createSprite(texture, Vec2()));
                game.ecs.assignComponent(
                    entity,
                    new TransformComponent(Vec2(x + 3, y + 2), Vec2(1, 1), 0)
                );
            }
        }
    }

    const player = createDynamicBody(Vec2(7.5, 7.5), 1, 0.5);
    const textures = game.animations.get("characters").get("personDown");
    const spriteComponent = SpriteComponent.createAnimatedSprite(textures, 0.1, Vec2(0.5, 0.8));
    spriteComponent.sprite.autoUpdate = false;
    game.ecs.assignComponent(player, spriteComponent);
    game.ecs.assignComponent(player, new CustomUpdateComponent(new Player()));

    createWall(Vec2(8, 4.5), 8, 1);
    createWall(Vec2(3.5, 7.5), 1, 5);
    createWall(Vec2(12.5, 7.5), 1, 5);
    createWall(Vec2(8, 10.5), 8, 1);

    createWall(Vec2(4.5, 5.5), 1, 1);
    createWall(Vec2(11, 5.5), 2, 1);

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
