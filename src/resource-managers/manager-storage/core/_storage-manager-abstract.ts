import { AbstractPrefixHandler } from '../handler-prefix/core/_prefix-abstract';
import { AbstractCRUDHandler } from '../handler-CRUD/core/_CRUD-abstract';

type TKeyValue<V> = {
    key: string;
    value: V;
};

interface IStorageManager<V> {
    add({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>>;
    update({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>>;
    upsert({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>>;
    delete(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
    get(key: string): Promise<TKeyValue<V> | undefined>;
    clearAll(): Promise<void>;
}

abstract class AbstractStorageManager<V, C> implements IStorageManager<V> {
    protected abstract readonly _CRUDHandler: AbstractCRUDHandler<V, C>;
    protected abstract readonly _prefixHandler: AbstractPrefixHandler;

    public async add({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            const result = await this._CRUDHandler.add({ prefixedKey, value });
            return {
                key: this._prefixHandler.split(result.prefixedKey),
                value: result.value,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async update({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            const result = await this._CRUDHandler.update({ prefixedKey, value });
            return {
                key: this._prefixHandler.split(result.prefixedKey),
                value: result.value,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async upsert({ key, value }: TKeyValue<V>): Promise<TKeyValue<V>> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            const result = await this._CRUDHandler.upsert({ prefixedKey, value });
            return {
                key: this._prefixHandler.split(result.prefixedKey),
                value: result.value,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async get(key: string): Promise<TKeyValue<V> | undefined> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            const result = await this._CRUDHandler.get(prefixedKey);
            if (result === undefined) return result;
            else
                return {
                    key: this._prefixHandler.split(result.prefixedKey),
                    value: result.value,
                };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async has(key: string): Promise<boolean> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            return await this._CRUDHandler.has(prefixedKey);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async delete(key: string): Promise<boolean> {
        try {
            const prefixedKey = this._prefixHandler.concat(key);
            return await this._CRUDHandler.delete(prefixedKey);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async clearAll(): Promise<void> {
        try {
            await this._CRUDHandler.clearAll();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { AbstractStorageManager, TKeyValue };
