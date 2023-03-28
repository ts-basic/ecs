export type AbstractConstructor = abstract new (...args: never[]) => unknown;

export type Immutable<T> = { +readonly [K in keyof T]: T[K] };

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export function* idGenerator(
    max: number = Number.MAX_SAFE_INTEGER
): Generator<number, never, never> {
    for (let id = 1; id < max; id++) {
        yield id;
    }
    throw new Error("available IDs exhausted");
}

export interface Registry<K, T extends AbstractConstructor> {
    readonly MAX_COMPONENT_ID: number;

    register(type: T): K;

    unregister(type: T): void;

    id(type: T): K;

    type(id: K): T;
}

export type EntityRef = {
    id: number;
    alive: boolean;
};

export interface Pool<T> {
    allocate(): T;

    release(item: T): void;
}
