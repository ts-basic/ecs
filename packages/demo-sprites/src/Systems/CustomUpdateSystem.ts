import { BaseSystem, ECS } from "@ts-basic/ecs";
import { CustomUpdateComponent } from "../Components/CustomUpdateComponent";

export class CustomUpdateSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(CustomUpdateComponent);

    constructor(ecs: ECS) {
        super(ecs);
        ecs.addArchetype(this.signature);
    }

    public onEarlyUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, CustomUpdateComponent);
            updateComponent.onEarlyUpdate(deltaTime);
        }
    }

    public onUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, CustomUpdateComponent);
            updateComponent.onUpdate(deltaTime);
        }
    }

    public onLateUpdate(deltaTime: number): void {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const updateComponent = this.ecs.getComponent(entity, CustomUpdateComponent);
            updateComponent.onLateUpdate(deltaTime);
        }
    }
}
