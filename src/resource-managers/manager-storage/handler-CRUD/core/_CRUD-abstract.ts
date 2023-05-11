type TPrefixedKeyValue<V> = {
    prefixedKey: string; // The key of the key-value pair.
    value: V; // The value of the key-value pair.
};

type TCRUDHandler<V, C> = new ({ client, expireSec }: { client: C; expireSec?: number }) => AbstractCRUDHandler<V, C>;

abstract class AbstractCRUDHandler<V, C> {
    protected readonly _client: C;
    protected readonly _expireSec?: number;

    constructor({ client, expireSec }: { client: C; expireSec?: number }) {
        this._client = client;
        this._expireSec = expireSec;
    }
    /**
     * Adds a new key-value pair to the memory manager.
     * @param key The key of the new item.
     * @param value The value of the new item.
     * @returns {Object} Contains new added key-value pair.
     * @throws {Error} If the key already exists in the memory manager.
     */
    abstract add({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>>;

    /**
     * Updates the value of an existing key in the memory manager.
     * @param key The key of the item to update.
     * @param value The new value to assign to the item.
     * @returns {Object} Contains updated key-value pair.
     * @throws {Error} If the key does not exist in the memory manager.
     */
    abstract update({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>>;

    /**
     * Adds or updates a key-value pair in the memory manager.
     * If the key already exists, its value will be updated, otherwise a new key-value pair will be added.
     * @param key The key of the item to add or update.
     * @param value The value of the item to add or update.
     * @returns {Object} Contains added or updated key-value pair.
     */
    abstract upsert({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>>;

    /**
     * Removes a key-value pair from the memory manager.
     * @param key The key of the item to remove.
     * @returns {Object|undefined} Contains the removed key-value pair if it exists, undefined otherwise.
     */
    abstract delete(prefixedKey: string): Promise<boolean>;

    /**
     * Checks whether a key exists in the memory manager.
     * @param key The key to check for existence.
     * @returns {boolean} True if the key exists in the memory manager, false otherwise.
     */
    abstract has(prefixedKey: string): Promise<boolean>;

    /**
     * Gets the value associated with a given key in the memory manager.
     * @param key The key of the item to get the value for.
     * @returns {Object|undefined} Contains the key-value pair if it exists, undefined otherwise.
     */
    abstract get(prefixedKey: string): Promise<TPrefixedKeyValue<V> | undefined>;

    /**
     * Clears all key-value pairs from the memory manager.
     */
    abstract clearAll(): Promise<void>;
}

export { AbstractCRUDHandler, TCRUDHandler, TPrefixedKeyValue };
