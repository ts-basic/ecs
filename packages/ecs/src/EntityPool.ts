import { idGenerator, Pool } from "./types";

export class EntityPool implements Pool<number> {
    private idGenerator: Generator<number, never, never> = idGenerator();
    private maxId = 0;
    private freeIds: Set<number> = new Set<number>();

    allocate(): number {
        if (this.freeIds.size > 0) {
            const id = this.freeIds.values().next().value;
            this.freeIds.delete(id);
            return id;
        } else {
            return (this.maxId = this.idGenerator.next().value);
        }
    }

    release(item: number): void {
        if (item > this.maxId) {
            throw new Error("invalid ID");
        }
        this.freeIds.add(item);
    }
}
