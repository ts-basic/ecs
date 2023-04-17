import { BaseSystem } from "@ts-basic/ecs";
import { Game } from "../Game";
import { TransformComponent, UITextComponent } from "../Components";

export class UISystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(UITextComponent, TransformComponent);

    public onEarlyUpdate(): void {}

    public onUpdate(): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const components = this.ecs.getComponents(entity);
            const uiTextComponent = components.get(UITextComponent);
            const transformComponent = components.get(TransformComponent);
            const text = uiTextComponent["text"];
            const position = transformComponent.position;

            text.position.set(position.x * Game.instance().ppm, position.y * Game.instance().ppm);
        }
    }

    public onLateUpdate(): void {}
}
