import { BaseSystem, ECS } from "@ts-basic/ecs";
import { SpriteComponent, TransformComponent } from "../Components";
import { Game } from "../Game";

export class SpriteSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(SpriteComponent, TransformComponent);

    constructor(ecs: ECS) {
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
                Game.instance().stages.get("sprite").addChild(sprite);
            }

            sprite.anchor.set(spriteComponent.origin.x, spriteComponent.origin.y);
            sprite.position.set(position.x * Game.instance().ppm, position.y * Game.instance().ppm);
            sprite.scale.set(scale.x, scale.y);
            sprite.rotation = rotation;
        }
    }

    public onLateUpdate(): void {}
}
