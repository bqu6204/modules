import Redis from 'ioredis';
import { IPrefixHandler } from './handler-prefix';
import { IRedlockHandler, IRedlockHandlerConfig } from './handler-redlock';
import { Settings } from 'redlock';

interface IRedisManangerConfig {
    client: Redis;
    expireSec: number;
    namespace: string;
    PrefixHandler: new (prefix: string) => IPrefixHandler;
    MutexHandler: new (props: IRedlockHandlerConfig) => IRedlockHandler;
    redlockConfig?: Partial<Settings>;
}

type TKeyValue<V> = {
    key: string; // The key of the key-value pair.
    value: V; // The value of the key-value pair.
};

interface IStorageOperators<V> {
    add({ key, value }: TKeyValue<V>): TKeyValue<V> | Promise<TKeyValue<V>>;
    update({ key, value }: TKeyValue<V>): TKeyValue<V> | Promise<TKeyValue<V>>;
    upsert({ key, value }: TKeyValue<V>): TKeyValue<V> | Promise<TKeyValue<V>>;
    delete(key: string): boolean | Promise<boolean>;
    has(key: string): boolean | Promise<boolean>;
    get(key: string): TKeyValue<V> | undefined | Promise<TKeyValue<V> | undefined>;
    clearAll(): void | Promise<void>;
}

class RedisManager<V extends string | number | Buffer> implements IStorageOperators<V> {
    private readonly _client: Redis;
    private readonly _namespace: string;
    private readonly _prefix: string;
    private readonly _expireSec: number;
    private readonly _prefixHandler;
    private readonly _mutex;

    constructor({ client, expireSec, namespace, PrefixHandler, MutexHandler, redlockConfig }: IRedisManangerConfig) {
        this._client = client;
        this._expireSec = expireSec;
        this._namespace = namespace;
        this._prefix = this._namespace + ':';
        this._prefixHandler = new PrefixHandler(this._prefix);
        this._mutex = new MutexHandler({ redisClient: this._client, redlockConfig: redlockConfig || {} });
    }

    get prefix() {
        return this._prefixHandler.prefix;
    }

    protected handleError(message: string, error?: Error): void {
        console.error(`[ ERROR ] ${message} { FROM ${this.constructor.name} }`);
        if (error) {
            console.error(error);
            throw error;
        }
        throw new Error(`[ ERROR ] ${message} { FROM ${this.constructor.name} }`);
    }

    public async add({ key, value }: TKeyValue<V>) {
        const prefixedKey = this._prefixHandler.concat(key);
        const lock = await this._mutex.acquire([`lock:${prefixedKey}`], 3000);

        if (await this.has(prefixedKey)) this.handleError(`Key ${String(key)} already exist in Redis`);
        try {
            await this._client.set(prefixedKey, value);

            if (this._expireSec) await this._client.expire(prefixedKey, this._expireSec);
        } catch (error: any) {
            this.handleError(`Failed to ADD key-value pair ${String({ key: value })} in Redis`, error);
        } finally {
            await lock.release();
        }
        return { key, value };
    }

    public async update({ key, value }: TKeyValue<V>) {
        const prefixedKey = this._prefixHandler.concat(key);
        const lock = await this._mutex.acquire([`lock:${prefixedKey}`], 3000);

        if (!(await this.has(prefixedKey))) throw this.handleError(`Key ${String(key)} does not exist in Redis`);
        try {
            await this._client.set(prefixedKey, value);

            if (this._expireSec) await this._client.expire(prefixedKey, this._expireSec);
        } catch (error: any) {
            throw this.handleError(`Failed to UPDATE key-value pair ${String({ key: value })} in Redis`, error);
        } finally {
            await lock.release();
        }

        return { key, value };
    }

    public async upsert({ key, value }: TKeyValue<V>) {
        const prefixedKey = this._prefixHandler.concat(key);
        const lock = await this._mutex.acquire([`lock:${prefixedKey}`], 3000);

        try {
            await this._client.set(prefixedKey, value);

            if (this._expireSec) await this._client.expire(prefixedKey, this._expireSec);
        } catch (error: any) {
            throw this.handleError(`Failed to UPSERT key-value pair ${String({ key: value })} in Redis`, error);
        } finally {
            await lock.release();
        }
        return { key, value };
    }
    public async delete(key: string) {
        const prefixedKey = this._prefixHandler.concat(key);
        const lock = await this._mutex.acquire([`lock:${prefixedKey}`], 3000);

        if (!(await this.has(prefixedKey))) return false;

        try {
            const result = await this._client.del(prefixedKey);
            return result === 1;
        } catch (error: any) {
            throw this.handleError(`Failed to DELETE key ${key} in Redis`, error);
        } finally {
            await lock.release();
        }
    }
    public async has(key: string) {
        const prefixedKey = this._prefixHandler.concat(key);
        try {
            const exist = await this._client.exists(prefixedKey);
            return exist === 1;
        } catch (error: any) {
            throw this.handleError('An error occurred while checking if key exists ', error);
        }
    }

    public async get(key: string) {
        const prefixedKey = this._prefixHandler.concat(key);
        const lock = await this._mutex.acquire([`lock:${prefixedKey}`], 3000);
        try {
            const value = await this._client.get(prefixedKey);
            if (!value) return undefined;
            return { key, value: JSON.parse(value) };
        } catch (error: any) {
            throw this.handleError(`Failed to GET key ${key} in Redis`, error);
        } finally {
            await lock.release();
        }
    }

    public async clearAll() {
        const lock = await this._mutex.acquire([`lock:clearAll`], 3000);
        try {
            await this._client.flushall();
        } catch (error: any) {
            throw this.handleError('Failed to FLUSH_ALL in Redis', error);
        } finally {
            await lock.release();
        }
    }
}

export { RedisManager, IRedisManangerConfig };
