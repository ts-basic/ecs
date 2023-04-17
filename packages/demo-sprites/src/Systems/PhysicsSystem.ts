import { BaseSystem, ECS } from "@ts-basic/ecs";
import { World } from "planck";
import { TransformComponent } from "../Components/TransformComponent";

export class PhysicsSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(TransformComponent);

    constructor(ecs: ECS, private world: World) {
        super(ecs);
    }

    public onEarlyUpdate(deltaTime: number) {}

    public onUpdate(deltaTime: number) {}

    public onLateUpdate(deltaTime: number) {}
}