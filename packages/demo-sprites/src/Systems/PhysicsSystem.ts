import { BaseSystem, ECS } from "@ts-basic/ecs";
import { World } from "planck";
import { RigidBodyComponent, TransformComponent } from "../Components";

export class PhysicsSystem extends BaseSystem {
    private signature = this.ecs.signatureFromComponents(RigidBodyComponent, TransformComponent);

    constructor(ecs: ECS, private world: World) {
        super(ecs);
    }

    public onEarlyUpdate(deltaTime: number) {}

    public onUpdate(deltaTime: number) {
        const entities = this.ecs.find(this.signature);
        for (const entity of entities) {
            const components = this.ecs.getComponents(entity);
            const transformComponent = components.get(TransformComponent);
            const rigidBodyComponent = components.get(RigidBodyComponent);
            const body = rigidBodyComponent.body;
            const position = body.getPosition();
            const rotation = body.getAngle();
            transformComponent.position.set(position.x, position.y);
            transformComponent.rotation = rotation;
        }
        this.world.step(deltaTime, 8, 3);
    }

    public onLateUpdate(deltaTime: number) {}
}