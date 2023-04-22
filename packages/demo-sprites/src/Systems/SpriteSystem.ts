import * as PIXI from "pixi.js";
import { BaseSystem, ECS } from "@ts-basic/ecs";
import { SpriteComponent, TransformComponent } from "../Components";
import { Game } from "../Game";

export class SpriteSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(SpriteComponent, TransformComponent);

    constructor(ecs: ECS) {
        super(ecs);
    }

    public onEarlyUpdate(): void {}

    public onUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const components = this.ecs.getComponents(entity);
            const spriteComponent = components.get(SpriteComponent);
            const transformComponent = components.get(TransformComponent);
            const sprite = spriteComponent.sprite;
            const position = transformComponent.position;
            const scale = transformComponent.scale;
            const rotation = transformComponent.rotation;

            if (sprite.parent === null) {
                Game.instance().stages.get("sprite").addChild(sprite);
            }

            sprite.anchor.set(spriteComponent.origin.x, spriteComponent.origin.y);
            sprite.position.set(
                Math.round(position.x * Game.instance().ppm),
                Math.round(position.y * Game.instance().ppm)
            );
            sprite.scale.set(scale.x, scale.y);
            sprite.rotation = rotation;

            if (sprite instanceof PIXI.AnimatedSprite) {
                sprite.update(deltaTime * 1000 * PIXI.Ticker.targetFPMS);
            }
        }
    }

    public onLateUpdate(): void {}
}
