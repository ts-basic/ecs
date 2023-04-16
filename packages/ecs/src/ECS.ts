import { AbstractConstructor, EntityRef, Immutable, Mutable, Pool, Registry } from "./types";
import { BaseSystem } from "./BaseSystem";
import { EntityPool } from "./EntityPool";
import { ComponentRegistry } from "./ComponentRegistry";

export class ECS<T extends AbstractConstructor = AbstractConstructor> {
    private entityPool: Pool<number> = new EntityPool();
    private componentRegistry: Registry<number, T> = new ComponentRegistry<T>();
    private entityIds = new Set<number>();
    private entitySignatures = new Map<number, number>();
    private entityRefs = new Map<number, WeakRef<EntityRef>>();
    private entityComponents = new Map<number, Map<T, InstanceType<T>>>();
    private archetype = new Map<number, Array<number>>();
    private systems = new Map<typeof BaseSystem, BaseSystem<T>>();

    private finalizationRegistry = new FinalizationRegistry<number>((key) => {
        if (!this.entityRefs.get(key)?.deref()) {
            this.entityRefs.delete(key);
        }
    });

    public count(): number {
        return this.entityIds.size;
    }

    public reference(entity: number): Immutable<EntityRef> {
        if (this.entityRefs.has(entity)) {
            return this.entityRefs.get(entity)!.deref()!;
        }
        const ref = { id: entity, alive: true };
        this.entityRefs.set(entity, new WeakRef(ref));
        this.finalizationRegistry.register(ref, entity);
        return ref;
    }

    public createEntity(): number {
        const entity = this.entityPool.allocate();
        this.entityIds.add(entity);
        this.entitySignatures.set(entity, 0);
        this.entityComponents.set(entity, new Map<T, InstanceType<T>>());
        return entity;
    }

    public destroyEntity(entity: number): void {
        this.entityExistsOrError(entity);
        this.entityIds.delete(entity);
        this.entitySignatures.delete(entity);
        const ref = this.entityRefs.get(entity)?.deref();
        this.entityRefs.delete(entity);
        if (ref) {
            (ref as Mutable<EntityRef>).alive = false;
        }
        this.entityComponents.delete(entity);
        this.entityPool.release(entity);
        for (const [signature, entities] of this.archetype.entries()) {
            const index = entities.indexOf(entity);
            if (index !== -1) {
                this.archetype.get(signature)!.splice(index, 1);
            }
        }
    }

    public registerComponent(component: T): number {
        return this.componentRegistry.register(component);
    }

    public addSystem(system: BaseSystem<T>): void {
        const type = Object.getPrototypeOf(system).constructor;
        if (this.systems.has(type)) {
            throw new Error("system already added");
        }
        this.systems.set(type, system);
    }

    private entityExistsOrError(entity: number): void {
        if (!this.entityIds.has(entity)) {
            throw new Error("entity does not exist");
        }
    }

    public assignComponent(entity: number, component: InstanceType<T>): void {
        this.entityExistsOrError(entity);
        const componentId = this.componentRegistry.id(Object.getPrototypeOf(component).constructor);
        let signature = this.entitySignatures.has(entity) ? this.entitySignatures.get(entity)! : 0;
        signature |= 1 << (componentId - 1);
        this.entitySignatures.set(entity, signature);
        this.entityComponents
            .get(entity)!
            .set(Object.getPrototypeOf(component).constructor, component);
        for (const archetype of this.archetype.keys()) {
            if (
                (archetype & signature) === archetype &&
                !this.archetype.get(archetype)!.includes(entity)
            ) {
                this.archetype.get(archetype)!.push(entity);
            }
        }
    }

    public signatureFromComponents(...components: T[]): number {
        return components.reduce((signature, component) => {
            const componentId = this.componentRegistry.id(component);
            return signature | (1 << (componentId - 1));
        }, 0);
    }

    public addArchetype(signature: number): void {
        if (!this.archetype.has(signature)) {
            this.archetype.set(signature, new Array<number>());
        }
    }

    public removeArchetype(signature: number): void {
        this.archetype.delete(signature);
    }

    public find(signature: number, limit?: number): Array<number> {
        if (this.archetype.has(signature)) {
            return limit
                ? this.archetype.get(signature)!.slice(0, limit)
                : this.archetype.get(signature)!;
        }
        const entities = new Array<number>();
        for (const entity of this.entityIds) {
            if ((this.entitySignatures.get(entity)! & signature) === signature) {
                entities.push(entity);
            }
            if (limit && entities.length >= limit) {
                break;
            }
        }
        return entities;
    }

    public first(signature: number): number | undefined {
        const entity = this.find(signature, 1);
        return entity.length === 1 ? entity[0] : undefined;
    }

    tick(deltaTime: number): void {
        for (const system of this.systems.values()) {
            system.onEarlyUpdate(deltaTime);
        }
        for (const system of this.systems.values()) {
            system.onUpdate(deltaTime);
        }
        for (const system of this.systems.values()) {
            system.onLateUpdate(deltaTime);
        }
    }

    public getComponent<U extends T>(entity: number, component: U): InstanceType<U> {
        this.entityExistsOrError(entity);
        if (!this.entityComponents.get(entity)!.has(component)) {
            throw new Error("entity does not have component");
        }
        return this.entityComponents.get(entity)!.get(component)!;
    }

    public getComponents(entity: number): Map<T, InstanceType<T>> {
        return this.entityComponents.get(entity)!;
    }
}
