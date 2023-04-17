import { AbstractConstructor } from "./types";
import { ECS } from "./ECS";

export abstract class BaseSystem<T extends AbstractConstructor = AbstractConstructor> {
    constructor(public ecs: ECS<T>) {}

    public abstract onEarlyUpdate(deltaTime: number): void;

    public abstract onUpdate(deltaTime: number): void;

    public abstract onLateUpdate(deltaTime: number): void;
}
