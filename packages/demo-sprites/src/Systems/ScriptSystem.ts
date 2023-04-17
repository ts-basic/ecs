import { BaseSystem, ECS } from "@ts-basic/ecs";
import { UpdateComponent } from "../Components/UpdateComponent";

export class ScriptSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(UpdateComponent);

    constructor(ecs: ECS) {
        super(ecs);
        ecs.addArchetype(this.signature);
    }

    public onEarlyUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, UpdateComponent);
            updateComponent.onEarlyUpdate(deltaTime);
        }
    }

    public onUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, UpdateComponent);
            updateComponent.onUpdate(deltaTime);
        }
    }

    public onLateUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, UpdateComponent);
            updateComponent.onLateUpdate(deltaTime);
        }
    }
}
