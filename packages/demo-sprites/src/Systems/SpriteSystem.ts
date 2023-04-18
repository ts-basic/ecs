import * as PIXI from "pixi.js";
import { BaseSystem, ECS } from "@ts-basic/ecs";
import { SpriteComponent } from "../SpriteComponent";
import { TransformComponent } from "../Components/TransformComponent";

export class SpriteSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(SpriteComponent, TransformComponent);

    constructor(ecs: ECS, private readonly ppm: number, private readonly stage: PIXI.Container) {
        super(ecs);
    }

    public onEarlyUpdate(): void {}

    public onUpdate(): void {
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
                this.stage.addChild(sprite);
            }

            sprite.anchor.set(spriteComponent.origin.x, spriteComponent.origin.y);
            sprite.position.set(position.x * this.ppm, position.y * this.ppm);
            sprite.scale.set(scale.x, scale.y);
            sprite.rotation = rotation;
        }
    }

    public onLateUpdate(): void {}
}
