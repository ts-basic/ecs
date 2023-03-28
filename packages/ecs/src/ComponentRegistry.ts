import { AbstractConstructor, idGenerator, Registry } from "./types";

export class ComponentRegistry<T extends AbstractConstructor> implements Registry<number, T> {
    private idToType = new Map<number, T>();
    private typeToId = new Map<T, number>();
    private freeIds: Set<number> = new Set<number>();
    public readonly MAX_COMPONENT_ID = 32;
    private idGenerator: Generator<number, never, never> = idGenerator(this.MAX_COMPONENT_ID);

    private nextId(): number {
        if (this.freeIds.size > 0) {
            const id = this.freeIds.values().next().value;
            this.freeIds.delete(id);
            return id;
        } else {
            return this.idGenerator.next().value;
        }
    }

    register(type: T): number {
        if (this.typeToId.has(type)) {
            throw new Error("component type already registered");
        }
        const id = this.nextId();
        this.idToType.set(id, type);
        this.typeToId.set(type, id);
        return id;
    }

    unregister(type: T): void {
        if (!this.typeToId.has(type)) {
            throw new Error("component type not registered");
        }
        const id = this.typeToId.get(type)!;
        this.idToType.delete(id);
        this.typeToId.delete(type);
        this.freeIds.add(id);
    }

    id(type: T): number {
        if (!this.typeToId.has(type)) {
            throw new Error("component type not registered");
        }
        return this.typeToId.get(type)!;
    }

    type(id: number): T {
        if (!this.idToType.has(id)) {
            throw new Error("component id not registered");
        }
        return this.idToType.get(id)!;
    }
}
