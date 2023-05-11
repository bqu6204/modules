import { AbstractCRUDHandler, TPrefixedKeyValue } from './core/_CRUD-abstract';
import { Redis } from 'ioredis';

class IORedisCRUDHandler<V extends string | number | Buffer, C extends Redis> extends AbstractCRUDHandler<V, C> {
    constructor({ client, expireSec }: { client: C; expireSec?: number }) {
        super({ client, expireSec });
    }

    public async add({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>> {
        try {
            const result = await this._client
                .multi()
                .set(prefixedKey, value, 'NX')
                .expire(prefixedKey, this._expireSec || 0)
                .exec();

            if (result === null || result[0][1] === null) {
                throw new Error(`Prefixed key ${prefixedKey} already exists in Redis`);
            }
        } catch (error: any) {
            const msg = `Failed to ADD prefixed key-value pair ${String({ key: value })} in Redis`;
            console.error(msg, error);
            throw new Error(msg);
        }
        return { prefixedKey, value };
    }

    public async update({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>> {
        try {
            await this._client.setex(prefixedKey, this._expireSec || 0, value);
        } catch (error: any) {
            const msg = `Failed to UPDATE prefixed key-value pair ${String({ prefixedKey, value })} in Redis`;
            console.error(msg, error);
            throw new Error(msg);
        }

        return { prefixedKey, value };
    }

    public async upsert({ prefixedKey, value }: TPrefixedKeyValue<V>): Promise<TPrefixedKeyValue<V>> {
        try {
            const result = await this._client
                .multi()
                .set(prefixedKey, value, 'NX')
                .expire(prefixedKey, this._expireSec || 0)
                .exec();

            if (result === null || result[0][1] === null) {
                // Key already exists, so update it
                await this.update({ prefixedKey, value });
            }
        } catch (error: any) {
            const msg = `Failed to UPSERT prefixed key-value pair ${String({ prefixedKey, value })} in Redis`;
            console.error(msg, error);
            throw new Error(msg);
        }
        return { prefixedKey, value };
    }

    public async delete(prefixedKey: string): Promise<boolean> {
        try {
            const result = await this._client.pipeline().del(prefixedKey).exec();
            if (result === null || result[0][1] !== 1) {
                return false;
            }
            return true;
        } catch (error: any) {
            const msg = `Failed to DELETE prefixed key ${prefixedKey} in Redis`;
            console.error(msg, error);
            throw new Error(msg);
        }
    }

    public async has(prefixedKey: string): Promise<boolean> {
        try {
            return (await this._client.exists(prefixedKey)) === 1;
        } catch (error: any) {
            const msg = 'An error occurred while checking if key exists ';
            console.error(msg, error);
            throw new Error(msg);
        }
    }

    public async get(prefixedKey: string): Promise<TPrefixedKeyValue<V> | undefined> {
        try {
            const value = await this._client.get(prefixedKey);
            if (!value) return undefined;
            return { prefixedKey, value: JSON.parse(value) };
        } catch (error: any) {
            const msg = `Failed to GET prefixed key ${prefixedKey} in Redis`;
            console.error(msg, error);
            throw new Error(msg);
        }
    }

    public async clearAll(): Promise<void> {
        try {
            await this._client.flushall();
        } catch (error: any) {
            const msg = 'Failed to FLUSH_ALL in Redis';
            console.error(msg, error);
            throw new Error(msg);
        }
    }
}

export { IORedisCRUDHandler };
