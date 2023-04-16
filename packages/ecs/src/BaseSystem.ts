import { AbstractConstructor } from "./types";
import { ECS } from "./ECS";

export interface IPerformsUpdates {
    onEarlyUpdate(deltaTime: number): void;

    onUpdate(deltaTime: number): void;

    onLateUpdate(deltaTime: number): void;
}

export abstract class BaseSystem<T extends AbstractConstructor = AbstractConstructor>
    implements IPerformsUpdates
{
    constructor(public ecs: ECS<T>) {}

    public abstract onEarlyUpdate(deltaTime: number): void;

    public abstract onUpdate(deltaTime: number): void;

    public abstract onLateUpdate(deltaTime: number): void;
}
