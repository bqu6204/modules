import { Redis } from 'ioredis';
import Redlock, { Settings } from 'redlock';
import { Lock, ExecutionResult } from 'redlock';

interface IRedlockHandler {
    acquire(
        resources: string[],
        ttl: number
    ): Promise<{
        extend(newTtl: number): Promise<Lock>;
        release(): Promise<ExecutionResult>;
    }>;
}

interface IRedlockHandlerConfig {
    redisClient: Redis;
    redlockConfig: Partial<Settings>;
}

class RedlockHandler implements IRedlockHandler {
    private _client: Redis;
    private _redlock: Redlock;
    constructor({ redisClient, redlockConfig }: IRedlockHandlerConfig) {
        this._client = redisClient;
        this._redlock = new Redlock([this._client], redlockConfig);
    }

    public async acquire(resources: string[], ttl: number) {
        const lock = await this._redlock.acquire(resources, ttl);
        return {
            async extend(newTtl: number) {
                return await lock.extend(newTtl);
            },
            async release() {
                return await lock.release();
            },
        };
    }
}
export { RedlockHandler, IRedlockHandler, IRedlockHandlerConfig };
