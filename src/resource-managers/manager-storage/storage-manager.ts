import { AbstractStorageManager } from './core/_storage-manager-abstract';
import { TPrefixHandler } from './handler-prefix/core/_prefix-abstract';
import { TCRUDHandler } from './handler-CRUD/core/_CRUD-abstract';
import { BasicPrefixHandler } from './handler-prefix/prefix-basic';
import { Redis } from 'ioredis';
import { IORedisCRUDHandler } from './handler-CRUD/CRUD-ioredis';

/**
 * A class that manages storage operations.
 * @template V - The type of the stored values.
 * @template C - The type of the client.
 */
class StorageManager<V, C> extends AbstractStorageManager<V, C> {
    /** The CRUD handler used by the storage manager. */
    protected readonly _CRUDHandler;
    /** The prefix handler used by the storage manager. */
    protected readonly _prefixHandler;
    /**
     * Creates a new instance of the storage manager.
     * @param client - The client to use.
     * @param namespace - The namespace for the keys stored in the storage.
     * @param expireSec - The TTL (in seconds) for the keys stored in storage.
     * @param PrefixHandler - The prefix handler to use.
     * @param CRUDHandler - The CRUD handler to use.
     */
    constructor({
        client,
        namespace,
        expireSec,
        PrefixHandler,
        CRUDHandler,
    }: {
        client: C;
        namespace: string;
        expireSec: number;
        PrefixHandler?: TPrefixHandler;
        CRUDHandler: TCRUDHandler<V, C>;
    }) {
        super();
        this._prefixHandler = PrefixHandler ? new PrefixHandler(namespace) : new BasicPrefixHandler(namespace);
        this._CRUDHandler = new CRUDHandler({ client, expireSec });
    }
}

// DEMO
// Use any client that is compatible with the CRUDHandler and PrefixHandler
const redis = new Redis();

const CSRFManager = new StorageManager({
    CRUDHandler: IORedisCRUDHandler,
    client: redis,
    namespace: 'hello',
    expireSec: 1231,
});

export { StorageManager };
