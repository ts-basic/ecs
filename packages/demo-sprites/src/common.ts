export class StrictMap<K, V> extends Map<K, V> {
    get(key: K): V {
        const value = super.get(key);
        if (value === undefined) {
            throw new Error(`Key ${key} not found`);
        }
        return value;
    }
}

export interface ReadonlyStrictMap<K, V> extends ReadonlyMap<K, V> {
    get(key: K): V;
}